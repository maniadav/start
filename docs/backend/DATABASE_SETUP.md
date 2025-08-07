# Database Setup and Seeding Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment

```bash
# Copy and configure your environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
```

### 3. Run Database Migrations with Seeding

```bash
# Check current migration status
yarn migrate:status

# Run all migrations (includes initial setup + data seeding)
yarn migrate:up
```

## 📊 What Gets Created

When you run the migrations, the following dummy data will be populated:

### Users (6 total)

- **1 Admin**: `admin@bhishmalab.com` (password: `admin123`)
- **2 Organisations**:
  - `ashoka@university.edu` (password: `org123`)
  - `iitb@iitbombay.ac.in` (password: `org123`)
- **3 Observers**:
  - `observer1@ashoka.edu` (password: `obs123`)
  - `observer2@iitbombay.ac.in` (password: `obs123`)

### Profiles

- **1 Admin Profile**: System Administrator with full permissions
- **2 Organisation Profiles**: Ashoka University & IIT Bombay
- **3 Observer Profiles**: Dr. Priya Sharma, Dr. Rajesh Kumar, Dr. Anita Singh

### Test Data

- **5 Children**: With realistic Indian names and addresses
- **3 Sample Survey Records**: Including BubblePoppingTask, MotorFollowingTask, and DelayedGratificationTask

## 🔧 Migration Commands

```bash
# Check what migrations have been applied
yarn migrate:status

# Run all pending migrations
yarn migrate:up

# Rollback specific migration (e.g., remove seeded data)
yarn migrate:down 004

# Rollback data seeding only
yarn migrate:down 004
```

## 🎯 Sample Data Structure

### Sample Survey Data Includes:

- **BubblePoppingTask**: Complete attempt data with bubble coordinates and timing
- **MotorFollowingTask**: Touch coordinates, ball tracking, and mouse movements
- **DelayedGratificationTask**: Multiple attempts with choice patterns and wait times

### Data Relationships:

```
Users → Profiles (Admin/Organisation/Observer)
Organisations → Observers
Observers → Children
Children → Survey Data
```

## 🔐 Default Login Credentials

### Admin Access

- Email: `admin@bhishmalab.com`
- Password: `admin123`
- Permissions: Full system access

### Organisation Access

- **Ashoka University**

  - Email: `ashoka@university.edu`
  - Password: `org123`

- **IIT Bombay**
  - Email: `iitb@iitbombay.ac.in`
  - Password: `org123`

### Observer Access

- Email: `observer1@ashoka.edu` / `observer2@iitbombay.ac.in` / `researcher@bhishmalab.com`
- Password: `obs123`

## 🛡️ Security Notes

- All passwords are properly hashed using bcrypt with salt rounds of 12
- Unique IDs follow the pattern: `AD001` (Admin), `OG001` (Organisation), `OB001` (Observer)
- All email addresses are unique and validated
- Foreign key relationships are properly maintained

## 📈 Data Verification

After running migrations, you can verify the data was created:

```bash
# Connect to your MongoDB and check collections
use bhishma_lab_db
db.users.countDocuments()        # Should return 6
db.children.countDocuments()     # Should return 5
db.survey_data.countDocuments()  # Should return 3
```

## 🔄 Resetting Data

To completely reset and reseed the database:

```bash
# Remove all data
yarn migrate:down 004

# Re-run seeding
yarn migrate:up
```

## 📝 Customizing Dummy Data

To modify the dummy data, edit files in `/src/models/dummyData/`:

- `userData.ts` - User accounts
- `adminProfileData.ts` - Admin profiles
- `organisationProfileData.ts` - Organisation profiles
- `observerProfileData.ts` - Observer profiles
- `childData.ts` - Child records
- `surveyData.ts` - Sample survey data

After modifying, rollback and re-run migration 004:

```bash
yarn migrate:down 004
yarn migrate:up
```

This setup provides a complete, realistic dataset for development and testing!
