# New Auth Flow Implementation

## Overview
The authentication system has been redesigned to follow a database-like structure with separate profile tables for different user roles, similar to your backend SQL query approach.

## Database Structure

### 1. Users Table (Base Authentication)
```typescript
interface User {
  id: string
  email: string           // Used for login
  role: UserRole         // Determines which profile table to query
  createdAt: string
  hashedPassword?: string // For authentication
  lastLogin?: string
}
```

**SQL Equivalent:**
```sql
SELECT id, email, role FROM users WHERE email = ?;
```

### 2. Profile Tables (Role-Specific Data)

#### Admin Profiles
```typescript
interface AdminProfile {
  id: string
  userId: string         // Foreign key to users table
  name: string
  address?: string
  permissions: string[]   // Admin-specific permissions
  createdAt: string
}
```

**SQL Equivalent:**
```sql
SELECT * FROM admin_profiles WHERE user_id = ?;
```

#### Organisation Profiles
```typescript
interface OrganisationProfile {
  id: string
  userId: string         // Foreign key to users table
  name: string
  organizationName: string
  email: string
  address: string
  status: Status
  allowedStorage: number
  createdAt: string
  contactPhone?: string
  website?: string
}
```

**SQL Equivalent:**
```sql
SELECT * FROM organization_profiles WHERE user_id = ?;
```

#### Observer Profiles
```typescript
interface ObserverProfile {
  id: string
  userId: string         // Foreign key to users table
  name: string
  email: string
  address: string
  status: Status
  organizationId: string
  createdAt: string
  specialization?: string
  certifications?: string[]
}
```

**SQL Equivalent:**
```sql
SELECT * FROM observer_profiles WHERE user_id = ?;
```

## Auth Flow Implementation

### Step 1: User Authentication
```typescript
function getUserByEmail(email: string): User | null {
  // Equivalent to: SELECT id, email, role FROM users WHERE email = ?;
  const users = getUsers()
  return users.find(user => user.email === email) || null
}
```

### Step 2: Role-Based Profile Fetching
```typescript
function getUserWithProfile(userId: string): UserWithProfile | null {
  const user = getUserById(userId)
  if (!user) return null

  let profile: AdminProfile | OrganisationProfile | ObserverProfile | undefined

  switch (user.role) {
    case "admin":
      profile = getAdminProfile(userId)  // SELECT * FROM admin_profiles WHERE user_id = ?
      break
    case "organisation":
      profile = getOrganizationProfile(userId)  // SELECT * FROM organization_profiles WHERE user_id = ?
      break
    case "observer":
    case "surveyor":
      profile = getObserverProfile(userId)  // SELECT * FROM observer_profiles WHERE user_id = ?
      break
  }

  return { ...user, profile, name: profile?.name || "" }
}
```

### Step 3: Complete Login Flow
```typescript
function login(email: string, password: string): UserWithProfile | null {
  // 1. Query users table
  const user = getUserByEmail(email)
  
  // 2. Verify credentials
  if (!user || !verifyPassword(password, user.hashedPassword)) {
    return null
  }
  
  // 3. Fetch profile based on role
  const userWithProfile = getUserWithProfile(user.id)
  
  // 4. Update last login
  if (userWithProfile) {
    updateLastLogin(user.id)
  }
  
  return userWithProfile
}
```

## Data Storage Structure

### LocalStorage Keys
```typescript
export const STORAGE_KEYS = {
  USERS: "survey_app_users",                    // Base user table
  ADMIN_PROFILES: "survey_app_admin_profiles",  // Admin profile table
  ORGANISATION_PROFILES: "survey_app_organization_profiles", // Org profile table
  OBSERVER_PROFILES: "survey_app_observer_profiles",         // Observer profile table
  // ... other keys
}
```

## Sample Data

### Users (Base Table)
```json
[
  {
    "id": "1",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2025-06-28T...",
    "hashedPassword": "hashed_password_1"
  },
  {
    "id": "2",
    "email": "org1@example.com",
    "role": "organisation",
    "createdAt": "2025-06-28T...",
    "hashedPassword": "hashed_password_2"
  }
]
```

### Admin Profiles
```json
[
  {
    "id": "admin_1",
    "userId": "1",
    "name": "System Admin",
    "address": "123 Admin St, Tech City, TC 12345",
    "permissions": ["manage_users", "manage_organizations", "manage_system"],
    "createdAt": "2025-06-28T..."
  }
]
```

### Organisation Profiles
```json
[
  {
    "id": "org_1",
    "userId": "2",
    "name": "Org Admin 1",
    "organizationName": "Healthcare Research Corp",
    "email": "contact@healthcareresearch.com",
    "address": "100 Medical Plaza, Healthcare City, HC 12345",
    "status": "active",
    "allowedStorage": 10240,
    "createdAt": "2025-06-28T...",
    "contactPhone": "+1-555-0123",
    "website": "https://healthcareresearch.com"
  }
]
```

## Benefits of This Structure

1. **Separation of Concerns**: Authentication data is separate from profile data
2. **Role-Specific Fields**: Each role can have its own specific fields without affecting others
3. **Scalability**: Easy to add new roles without modifying existing structures
4. **Security**: Sensitive auth data is separate from profile information
5. **Backward Compatibility**: `UserWithProfile` interface maintains compatibility with existing code

## Usage Example

```typescript
// Login flow
const user = authenticateUser("admin@example.com", "password")
if (user) {
  console.log("Welcome", user.name)
  console.log("Role:", user.role)
  
  // Access role-specific profile data
  if (user.role === "admin" && user.profile) {
    const adminProfile = user.profile as AdminProfile
    console.log("Permissions:", adminProfile.permissions)
  }
}
```

This structure exactly mirrors your backend SQL query pattern while maintaining the flexibility of the frontend data management system.
