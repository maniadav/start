# Verification Email Integration

This document explains how verification emails are automatically sent when creating organisation and observer accounts.

## Overview

The system now automatically sends verification emails to newly created users when:
- An admin creates an organisation account
- An organisation creates an observer account

## How It Works

### 1. Account Creation Flow

```
Admin/Organisation → Creates Account → Database Save → Send Verification Email → Return Success Response
```

### 2. Email Templates

Different email templates are used based on the account type:
- **Organisation Creation**: Email sent when admin creates organisation
- **Observer Creation**: Email sent when organisation creates observer
- **General Verification**: Fallback template for other verification types

### 3. Verification Token

- 24-hour expiration time
- Contains user role and email information
- Links to verification endpoint: `/api/v1/auth/verify?token={token}`

## Updated Endpoints

### POST `/api/v1/organisation/create`

**Request Body:**
```json
{
  "name": "Example Organisation",
  "email": "org@example.com",
  "address": "123 Main St, City"
}
```

**Response:**
```json
{
  "message": "Organisation created successfully and verification email sent",
  "organisation": {
    "user_id": "...",
    "name": "Example Organisation",
    "status": "pending",
    "email": "org@example.com",
    "address": "123 Main St, City"
  },
  "verificationEmailSent": true
}
```

### POST `/api/v1/observer/create`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "observer@example.com",
  "address": "456 Oak Ave, Town"
}
```

**Response:**
```json
{
  "message": "Observer created successfully and verification email sent",
  "observer": {
    "user_id": "...",
    "name": "John Doe",
    "status": "pending",
    "email": "observer@example.com",
    "address": "456 Oak Ave, Town",
    "organisation_id": "..."
  },
  "verificationEmailSent": true
}
```

## Email Content

### Organisation Creation Email
- Subject: "Verify Your Organisation Account - START Project"
- Content includes:
  - Welcome message
  - Account details (email, role, organisation name)
  - Verification button/link
  - 24-hour expiration notice
  - Support contact information

### Observer Creation Email
- Subject: "Verify Your Observer Account - START Project"
- Content includes:
  - Welcome message
  - Account details (email, role, observer name)
  - Verification button/link
  - 24-hour expiration notice
  - Support contact information

## Error Handling

- If email sending fails, the account creation still succeeds
- Email errors are logged but don't break the main flow
- Response includes `verificationEmailSent` flag to indicate status

## Configuration

Make sure these environment variables are set:
```env
GOOGLE_SMTP_EMAIL_ID=your-email@gmail.com
GOOGLE_SMTP_CLIENT_ID=your-client-id
GOOGLE_SMTP_CLIENT_SECRET=your-client-secret
GOOGLE_SMTP_REDIRECT_URI=your-redirect-uri
GOOGLE_SMTP_REFRESH_TOKEN=your-refresh-token
JWT_SECRET=your-jwt-secret
API_BASE_URL=http://localhost:3000
```

## Testing

### Test Organisation Creation
```bash
curl -X POST http://localhost:3000/api/v1/organisation/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin-token}" \
  -d '{
    "name": "Test Org",
    "email": "test@example.com",
    "address": "Test Address"
  }'
```

### Test Observer Creation
```bash
curl -X POST http://localhost:3000/api/v1/observer/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {organisation-token}" \
  -d '{
    "name": "Test Observer",
    "email": "observer@example.com",
    "address": "Test Address"
  }'
```

## Next Steps

1. **Create Verification Endpoint**: Implement `/api/v1/auth/verify` to handle token verification
2. **User Activation**: Update user status from "pending" to "active" after verification
3. **Password Setup**: Allow users to set their password during verification
4. **Email Templates**: Customize email templates for your branding
5. **Monitoring**: Add email delivery tracking and retry mechanisms

## Architecture Benefits

- **Separation of Concerns**: Each endpoint handles its specific user type
- **Modular Email System**: Email templates are reusable and maintainable
- **Fault Tolerance**: Email failures don't break account creation
- **Consistent User Experience**: All new users receive verification emails
- **Security**: JWT tokens with expiration for secure verification

