# Handling Existing Collections and Data

## Database Specification

### MongoDB URI Format
```bash
# Basic format with database name
mongodb+srv://username:password@cluster.mongodb.net/DATABASE_NAME?options

# Your setup
MONGODB_URI=mongodb+srv://manishyadavelit:manish@bhishma-cluster.3uslt90.mongodb.net/bhishma_lab_db?retryWrites=true&w=majority&appName=bhishma-cluster
```

**Key Points:**
- `/bhishma_lab_db` specifies the database name
- Without it, MongoDB uses the default `test` database
- Collections will be created in the specified database

## Handling Existing Collections

### 1. Collection Detection

The migration system automatically detects existing collections:

```typescript
// Check what collections already exist
const collections = await mongoose.connection.db.listCollections().toArray();
const existingCollections = collections.map(c => c.name);
console.log("Existing collections:", existingCollections);
```

### 2. Safe Schema Updates

When collections exist, the system:
- ✅ Preserves existing data
- ✅ Adds new fields safely
- ✅ Creates missing indexes
- ✅ Updates schema incrementally

### 3. Migration Strategies for Existing Data

#### Strategy A: Additive Changes (Safest)
```typescript
// Add new fields to existing documents
await Child.updateMany(
  {}, // All documents
  {
    $set: {
      new_field: "default_value",
      another_field: null
    }
  }
);
```

#### Strategy B: Field Transformation
```typescript
// Transform existing data
const documents = await Child.find({ old_field: { $exists: true } });
for (const doc of documents) {
  doc.new_field = transformOldField(doc.old_field);
  await doc.save();
}
```

#### Strategy C: Data Restructuring
```typescript
// Restructure complex data
await SurveyData.updateMany(
  { "attempts": { $exists: true } }, // Has old format
  [
    {
      $set: {
        attempt1: { $arrayElemAt: ["$attempts", 0] },
        attempt2: { $arrayElemAt: ["$attempts", 1] },
        attempt3: { $arrayElemAt: ["$attempts", 2] }
      }
    },
    {
      $unset: "attempts" // Remove old field
    }
  ]
);
```

## Common Scenarios

### Scenario 1: Brand New Database
```bash
# Collections will be created fresh
npm run migrate:up
# ✅ All collections created with proper schema
```

### Scenario 2: Existing Database, No Collections
```bash
# Migration detects empty database
npm run migrate:up
# ✅ Creates all collections with indexes
```

### Scenario 3: Some Collections Exist
```bash
# Migration detects existing collections
npm run migrate:up
# ✅ Updates existing collections
# ✅ Creates missing collections
# ✅ Preserves existing data
```

### Scenario 4: All Collections Exist with Data
```bash
# Migration handles existing data carefully
npm run migrate:up
# ✅ Adds missing fields
# ✅ Creates missing indexes
# ✅ Transforms data if needed
# ✅ No data loss
```

## Pre-Migration Checks

### 1. Backup Existing Data
```bash
# Create backup before major changes
mongodump --uri="your_mongodb_uri" --out backup_$(date +%Y%m%d_%H%M%S)
```

### 2. Check Current State
```bash
# See what migrations have been applied
npm run migrate:status

# Check existing collections
mongo your_connection_string --eval "db.adminCommand('listCollections')"
```

### 3. Test on Development Copy
```bash
# Copy production data to development
mongodump --uri="production_uri" --out prod_backup
mongorestore --uri="dev_uri" prod_backup

# Test migrations on development
npm run migrate:up
```

## Advanced Migration Patterns

### 1. Conditional Migrations
```typescript
{
  version: "004",
  description: "Migrate old survey format if exists",
  up: async () => {
    const manager = new MigrationManager();
    
    // Only migrate if old format exists
    const hasOldFormat = await mongoose.connection.db
      .collection('surveys')
      .findOne({ old_format_field: { $exists: true } });
    
    if (hasOldFormat) {
      console.log("🔄 Migrating old survey format...");
      // Migration logic here
    } else {
      console.log("⏭️ No old format found, skipping migration");
    }
  }
}
```

### 2. Batch Processing for Large Collections
```typescript
{
  version: "005", 
  description: "Update large collection in batches",
  up: async () => {
    const batchSize = 1000;
    let processed = 0;
    let batch;
    
    do {
      batch = await SurveyData.find({})
        .skip(processed)
        .limit(batchSize);
      
      for (const doc of batch) {
        // Process each document
        doc.new_field = computeValue(doc);
        await doc.save();
      }
      
      processed += batch.length;
      console.log(`📊 Processed ${processed} documents...`);
      
    } while (batch.length === batchSize);
  }
}
```

### 3. Data Validation During Migration
```typescript
{
  version: "006",
  description: "Validate and clean existing data",
  up: async () => {
    // Find invalid records
    const invalidRecords = await User.find({
      email: { $not: /@/ } // Invalid email format
    });
    
    console.log(`⚠️ Found ${invalidRecords.length} invalid records`);
    
    // Clean or fix data
    for (const record of invalidRecords) {
      if (record.email && !record.email.includes('@')) {
        record.email = `${record.email}@example.com`; // Fix format
        await record.save();
      }
    }
  }
}
```

## Troubleshooting Existing Data

### Issue 1: Duplicate Key Errors
```bash
# If unique index conflicts with existing data
Error: E11000 duplicate key error
```

**Solution:**
```typescript
// Remove duplicates before creating unique index
const duplicates = await User.aggregate([
  { $group: { _id: "$email", count: { $sum: 1 }, docs: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
]);

for (const dup of duplicates) {
  // Keep first, remove others
  const [keep, ...remove] = dup.docs;
  await User.deleteMany({ _id: { $in: remove } });
}
```

### Issue 2: Schema Mismatch
```bash
# Existing data doesn't match new schema
```

**Solution:**
```typescript
// Gradually transform data
await User.updateMany(
  { created_at: { $type: "string" } }, // Old string format
  [
    {
      $set: {
        created_at: { $dateFromString: { dateString: "$created_at" } }
      }
    }
  ]
);
```

### Issue 3: Missing Required Fields
```bash
# New schema requires fields that don't exist
```

**Solution:**
```typescript
// Add default values for required fields
await User.updateMany(
  { required_field: { $exists: false } },
  { $set: { required_field: "default_value" } }
);
```

## Best Practices for Existing Data

1. **Always Backup First**
2. **Test on Development Copy**
3. **Use Transactions for Related Changes**
4. **Process Large Collections in Batches**
5. **Validate Data After Migration**
6. **Keep Rollback Plans Ready**
7. **Monitor Performance During Migration**

## Database Naming Conventions

### Recommended Structure
```
Production:   bhishma_lab_prod
Staging:      bhishma_lab_staging  
Development:  bhishma_lab_dev
Testing:      bhishma_lab_test
```

### Collection Naming
```
users               # User accounts
children            # Child profiles
survey_data         # Survey responses
admin_profiles      # Admin user profiles
observer_profiles   # Observer user profiles
organisation_profiles # Organisation profiles
migrations          # Migration tracking
```

This approach ensures your existing data is safely preserved while enabling schema evolution.
