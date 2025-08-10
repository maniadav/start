# Backend API Documentation

This document provides an overview of the available API endpoints, their functionality, required parameters, and authentication requirements for the backend service.

## API Overview

This API is structured to support a medical research platform focused on early detection of ASD (Autism Spectrum Disorder) in children aged 2-5 years. The API follows a hierarchical organization structure with multiple user roles:

### Directory Structure

```
/api/v1/
├── auth/                    # Authentication & token management
│   ├── login               # User login and token generation
│   ├── get-access-token    # Refresh access tokens
│   └── update-password     # Password management
│
├── user/                   # User profile management
│   ├── create             # Create new users (admin only)
│   └── fetch              # Get user profile data
│
├── organisation/           # Research centers/clinics that manage observers
│   ├── create             # Create new organization (admin)
│   ├── list               # List all organizations
│   ├── delete             # Remove organization
│   └── update             # Modify organization details
│
├── observer/              # Medical practitioners who collect child data
│   ├── create             # Create new observer (org/admin)
│   ├── list               # List observers by organization
│   └── delete             # Remove observer
│
├── child/                 # Children being assessed for ASD
│   ├── create             # Create child profile (observer)
│   ├── list               # List children by org/observer
│   └── fetch              # Get child details and files
│
├── files/                 # Assessment data management
│   ├── list               # List uploaded files
│   ├── upload             # Upload new assessment (observer)
│   └── create             # Create file record (org/admin)
│
├── admin/                 # Administrative data access
│   ├── user               # User data management
│   ├── survey             # Survey configuration
│   ├── observer           # Observer management
│   └── file               # File system management
│
└── health/               # System monitoring endpoint
```

### Role Relationships

- **Admin**: System administrators who manage organizations and have full access
- **Organisation**: Research centers/clinics that:
  - Create and manage observers
  - Access data for their observers and children
  - Generate reports and analytics
- **Observer**: Medical practitioners who:
  - Create and manage child profiles
  - Conduct assessments and upload data
  - Access their assigned children's data
- **Public**: Unauthenticated access to health check and documentation

### Core Functionalities

1. **Authentication & User Management**

   - Role-based access control (Admin, Organisation, Observer)
   - Token-based authentication with refresh mechanism
   - Profile management for different user types

2. **Research Data Collection**

   - Child profile management
   - Assessment data collection
   - File upload and management for medical observations

3. **Organization Management**

   - Multi-organization support
   - Observer assignment and management
   - Data access controls based on organizational hierarchy

4. **Data Security**
   - Token-based secure access
   - Role-specific permissions
   - Encrypted file handling

### Role Hierarchy

- **Admin**: System-wide access and management
- **Organisation**: Clinic/research center management
- **Observer**: Medical practitioners conducting assessments
- **Public**: Limited access to non-sensitive endpoints

## Health

### `GET /api/v1/health`

- **Description:** Health check endpoint. Returns server status and uptime.
- **Authentication:** None
- **Response:**
  ```json
  {
    "status": "ok",
    "uptime": 123.45,
    "timestamp": "2025-08-06T12:34:56.789Z",
    "environment": "development"
  }
  ```

---

## Auth

### `POST /api/v1/auth/login`

- **Description:** Login with email and password. Returns access and refresh tokens.
- **Body:** `{ email: string, password: string }`
- **Authentication:** None
- **Response:** `{ accessToken, refreshToken, ... }`

### `POST /api/v1/auth/update-password`

- **Description:** Update the password for the authenticated user.
- **Body:** `{ password: string }`
- **Authentication:** Bearer access token required
- **Response:** `{ message, user_id, email, role }`

### `POST /api/v1/auth/get-access-token`

- **Description:** Get a new access token using a refresh token.
- **Body/Header:** `refreshToken` in body or `Authorization` header
- **Authentication:** Refresh token required
- **Response:** `{ accessToken }`

---

## User

### `POST /api/v1/user/create`

- **Description:** Create a new user (admin only, bypass key required).
- **Body:** `{ name, email, address, role, password }`
- **Header:** `Authorization: Bearer-<bypass>`
- **Authentication:** Bypass key required
- **Response:** User object or error

### `GET /api/v1/user/fetch`

- **Description:** Fetch the profile of the authenticated user.
- **Authentication:** Bearer access token required
- **Response:** `{ userProfile }`

---

## Files

### `GET /api/v1/files/list`

- **Description:** List files with optional filters and pagination.
- **Query:** `page`, `limit`, `task_id`, `organisation_id`, `observer_id`
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** List of files

### `POST /api/v1/files/upload`

- **Description:** Upload a file (observer only).
- **Body:** `{ title?, task_id, file_size, organisation_id?, observer_id?, child_id?, file_url }`
- **Authentication:** Bearer access token (observer)
- **Response:** File object

### `POST /api/v1/files/create`

- **Description:** Create a file record (admin/organisation).
- **Body:** `{ title?, task_id, file_size, organisation_id?, observer_id?, child_id?, file_url }`
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** File object

---

## Observer

### `POST /api/v1/observer/create`

- **Description:** Create a new observer profile (admin/organisation).
- **Body:** `{ name, email, address, organisation_id, password }`
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** Observer profile

### `GET /api/v1/observer/list`

- **Description:** List observers with optional filters.
- **Query:** `organisation_id`, `status`, `joined_on`
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** List of observer profiles

### `DELETE /api/v1/observer/delete/{observer_id}`

- **Description:** Delete an observer by ID (admin/organisation).
- **Path:** `observer_id`
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** Success or error message

---

## Organisation

### `POST /api/v1/organisation/create`

- **Description:** Create a new organisation profile (admin only).
- **Body:** `{ name, email, address }`
- **Authentication:** Bearer access token (admin)
- **Response:** Organisation profile

### `GET /api/v1/organisation/list`

- **Description:** List all organisations.
- **Authentication:** Bearer access token (admin/organisation)
- **Response:** List of organisation profiles

### `DELETE /api/v1/organisation/delete/{organisation_id}`

- **Description:** Delete an organisation by ID (admin only).
- **Path:** `organisation_id`
- **Authentication:** Bearer access token (admin)
- **Response:** Success or error message

### `PATCH /api/v1/organisation/update/{organisation_id}`

- **Description:** Update an organisation profile (admin only).
- **Path:** `organisation_id`
- **Authentication:** Bearer access token (admin)
- **Response:** Updated organisation profile

---

## Child

### `POST /api/v1/child/create`

- **Description:** Create a new child profile (observer only).
- **Body:** `{ child_id, child_name, child_address?, child_gender }`
- **Authentication:** Bearer access token (observer)
- **Response:** Child profile

### `GET /api/v1/child/list`

- **Description:** List children with optional filters.
- **Query:** `organisation_id`
- **Authentication:** Bearer access token (admin/organisation/observer)
- **Response:** List of child profiles

### `GET /api/v1/child/fetch/{child_id}`

- **Description:** Fetch a child profile by ID (admin only).
- **Path:** `child_id`
- **Body:** `{ details?, files? }`
- **Authentication:** Bearer access token (admin)
- **Response:** Child profile or error

---

## Admin (Data Endpoints)

### `GET /api/v1/admin/user`

- **Description:** Get all users (mock/data endpoint).
- **Authentication:** None

### `GET /api/v1/admin/survey`

- **Description:** Get all surveys (mock/data endpoint).
- **Authentication:** None

### `GET /api/v1/admin/observer`

- **Description:** Get all observer profiles (mock/data endpoint).
- **Authentication:** None

### `GET /api/v1/admin/file`

- **Description:** Get all files (mock/data endpoint).
- **Authentication:** None

---

## Error Handling & Token Management

### Token Related Errors

- **Token Invalid/Expired (401)**
  ```json
  {
    "error": "Token is invalid or expired",
    "statusCode": 401
  }
  ```
  - Frontend should redirect to login page
  - Clear local storage tokens
- **Token Missing (401)**

  ```json
  {
    "error": "Token is required",
    "statusCode": 401
  }
  ```

  - Frontend should redirect to login page

- **Token Refresh Required (401)**
  ```json
  {
    "error": "Access token expired",
    "statusCode": 401
  }
  ```
  - Frontend should:
    1. Call `/api/v1/auth/get-access-token` with refresh token
    2. If successful, retry original request with new access token
    3. If refresh fails, redirect to login

### Profile Related Errors

- **Profile Not Found (404)**

  ```json
  {
    "error": "Profile not found",
    "statusCode": 404
  }
  ```

  - Frontend should redirect to profile creation/completion

- **Invalid Profile Role (403)**

  ```json
  {
    "error": "Unauthorized access: Invalid role for this operation",
    "statusCode": 403
  }
  ```

  - Frontend should show permission denied message
  - Optional: redirect to home page

- **Profile Verification Failed (401)**
  ```json
  {
    "error": "Profile verification failed",
    "statusCode": 401
  }
  ```
  - Frontend should redirect to login page

### General Error Format

```json
{
  "error": "Error message",
  "statusCode": 4XX/5XX,
  "details": {} // Optional additional error details
}
```

### HTTP Status Codes

- **400** - Bad Request (Invalid input)
- **401** - Unauthorized (Authentication required)
- **403** - Forbidden (Permission denied)
- **404** - Not Found
- **409** - Conflict (Resource already exists)
- **500** - Internal Server Error

### Token Management Guidelines for Frontend

#### Token Storage

- Store tokens in secure storage (localStorage/sessionStorage)
- Access Token: Short lived (15-60 minutes)
- Refresh Token: Longer lived (7-30 days)

#### Token Refresh Flow

1. On API call failure with 401:

   ```typescript
   if (error.status === 401) {
     if (error.message.includes("expired")) {
       // Try token refresh
       const newAccessToken = await refreshAccessToken();
       if (newAccessToken) {
         // Retry original request
         return retryRequestWithNewToken(newAccessToken);
       }
     }
     // If refresh fails or other 401 error
     redirectToLogin();
   }
   ```

2. Implement request interceptor to:
   - Add token to requests
   - Handle token refresh
   - Retry failed requests

#### Error Handling Strategy

1. Global error interceptor for common errors:

   - 401 -> Token refresh/Login
   - 403 -> Permission denied, Invalid Access Token
   - 404 -> Not found page
   - 500 -> Error page

2. Specific error handling for:

   - Profile errors -> Profile completion
   - Permission errors -> Role-specific pages
   - Validation errors -> Form feedback

3. User feedback:
   - Show appropriate error messages
   - Provide clear next steps
   - Maintain audit trail for critical operations

---

## Notes

- All endpoints (except health and admin data endpoints) require a valid Bearer token in the `Authorization` header unless otherwise specified.
- For endpoints with `{param}` in the path, replace with the actual value.
- Pagination and filtering are available on list endpoints via query parameters.
- Error responses are returned with appropriate HTTP status codes and error messages.
