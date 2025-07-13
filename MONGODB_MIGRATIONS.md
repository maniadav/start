# MongoDB Schema Migration Guide

## Overview

This guide explains how to manage MongoDB schema changes in your Next.js application using our custom migration system.

## What Happens When You Update Schemas

### Schema Evolution Strategies

MongoDB is schema-less, but your application code expects certain data structures. When you modify schemas:

1. **Backward Compatible Changes** (Safe)
   - Adding optional fields
   - Adding indexes
   - Changing field validation (making fields less restrictive)

2. **Breaking Changes** (Requires Migration)
   - Renaming fields
   - Changing field types
   - Making optional fields required
   - Removing fields that application code depends on

### Migration System

Our migration system handles schema changes through versioned migration scripts:

#### Migration Structure
```typescript
{
  version: '001',           // Sequential version number
  description: 'What this migration does',
  up: async () => {        // Apply changes
    // Migration code here
  },
  down: async () => {      // Rollback changes
    // Rollback code here
  }
}
```

## Common Migration Scenarios

### 1. Adding New Fields

```typescript
// Migration Example: Add survey tracking fields to Child model
{
  version: '002',
  description: 'Add survey tracking fields to children',
  up: async () => {
    await Child.updateMany(
      {},
      {
        $set: {
          last_survey_date: null,
          total_surveys: 0,
          survey_status: 'pending'
        }
      }
    );
  },
  down: async () => {
    await Child.updateMany(
      {},
      {
        $unset: {
          last_survey_date: "",
          total_surveys: "",
          survey_status: ""
        }
      }
    );
  }
}
```

### 2. Renaming Fields

```typescript
{
  version: '003',
  description: 'Rename createdAt to created_at',
  up: async () => {
    await SurveyData.updateMany(
      { createdAt: { $exists: true } },
      { $rename: { "createdAt": "created_at" } }
    );
  },
  down: async () => {
    await SurveyData.updateMany(
      { created_at: { $exists: true } },
      { $rename: { "created_at": "createdAt" } }
    );
  }
}
```

### 3. Data Type Changes

```typescript
{
  version: '004',
  description: 'Convert string dates to Date objects',
  up: async () => {
    const documents = await SurveyData.find({ 
      "attempt1.start_time": { $type: "string" } 
    });
    
    for (const doc of documents) {
      if (doc.attempt1?.start_time) {
        doc.attempt1.start_time = new Date(doc.attempt1.start_time);
        await doc.save();
      }
    }
  },
  down: async () => {
    const documents = await SurveyData.find({ 
      "attempt1.start_time": { $type: "date" } 
    });
    
    for (const doc of documents) {
      if (doc.attempt1?.start_time) {
        doc.attempt1.start_time = doc.attempt1.start_time.toISOString();
        await doc.save();
      }
    }
  }
}
```

### 4. Adding Indexes

```typescript
{
  version: '005',
  description: 'Add compound index for efficient querying',
  up: async () => {
    await SurveyData.collection.createIndex(
      { child_id: 1, assessment_id: 1, created_at: -1 },
      { background: true }
    );
  },
  down: async () => {
    await SurveyData.collection.dropIndex({
      child_id: 1, 
      assessment_id: 1, 
      created_at: -1 
    });
  }
}
```

## Running Migrations

### Commands

```bash
# Check migration status
npm run migrate:status

# Run all pending migrations
npm run migrate:up

# Rollback specific migration
npm run migrate:down 002

# Custom migration command
npm run migrate up
npm run migrate down 002
npm run migrate status
```

### Development Workflow

1. **Make Schema Changes**
   ```typescript
   // Update your Mongoose model
   const UserSchema = new Schema({
     // ... existing fields
     newField: { type: String, default: null } // New field
   });
   ```

2. **Create Migration**
   ```typescript
   // Add to migrations.ts
   {
     version: '006',
     description: 'Add newField to User model',
     up: async () => {
       await User.updateMany({}, { $set: { newField: null } });
     },
     down: async () => {
       await User.updateMany({}, { $unset: { newField: "" } });
     }
   }
   ```

3. **Test Migration**
   ```bash
   npm run migrate:status  # Check current state
   npm run migrate:up      # Apply migration
   ```

4. **Deploy and Run**
   ```bash
   # In production
   NODE_ENV=production npm run migrate:up
   ```

## Best Practices

### 1. Always Write Rollback Logic
- Every `up` migration should have a corresponding `down`
- Test rollbacks in development
- Consider data loss scenarios

### 2. Use Transactions for Complex Migrations
```typescript
up: async () => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Multiple operations here
      await User.updateMany({}, { $set: { newField: "default" } }, { session });
      await UserProfile.updateMany({}, { $set: { relatedField: true } }, { session });
    });
  } finally {
    await session.endSession();
  }
}
```

### 3. Handle Large Datasets
```typescript
up: async () => {
  const batchSize = 1000;
  let skip = 0;
  let batch;
  
  do {
    batch = await User.find({}).skip(skip).limit(batchSize);
    
    for (const user of batch) {
      // Process each user
      user.newField = computeValue(user);
      await user.save();
    }
    
    skip += batchSize;
  } while (batch.length === batchSize);
}
```

### 4. Backup Before Major Changes
```bash
# Create backup before migration
mongodump --uri="your_mongodb_uri" --out backup_$(date +%Y%m%d_%H%M%S)

# Run migration
npm run migrate:up

# If issues occur, restore from backup
mongorestore --uri="your_mongodb_uri" backup_20240101_120000/
```

## Production Considerations

### 1. Zero-Downtime Migrations
- Deploy backward-compatible schema changes first
- Run migrations during low-traffic periods
- Use feature flags for new functionality

### 2. Monitoring
- Log all migration activities
- Monitor performance during migrations
- Set up alerts for migration failures

### 3. Testing
- Test migrations on production-like data
- Verify rollback procedures
- Performance test with realistic data volumes

## Troubleshooting

### Common Issues

1. **Migration Fails Midway**
   ```bash
   # Check which migrations were applied
   npm run migrate:status
   
   # Manually fix data if needed
   # Then re-run migration
   npm run migrate:up
   ```

2. **Performance Issues**
   - Add `{ background: true }` for index creation
   - Process large datasets in batches
   - Consider running during off-peak hours

3. **Rollback Needed**
   ```bash
   # Rollback latest migration
   npm run migrate:down <version>
   
   # Check status
   npm run migrate:status
   ```

## Example: Complete Schema Evolution

Let's say you want to restructure survey data storage:

### Current Structure
```typescript
interface SurveyData {
  attempts: Array<{
    data: any;
    timestamp: Date;
  }>;
}
```

### New Structure
```typescript
interface SurveyData {
  attempt1: AttemptData;
  attempt2: AttemptData;
  attempt3: AttemptData;
}
```

### Migration Steps

1. **Migration 1: Add new fields**
2. **Migration 2: Copy data to new format**
3. **Migration 3: Update application code**
4. **Migration 4: Remove old fields**

This ensures your application continues working throughout the transition.
