# File Upload Instructions

## Overview

Observers are only allowed to upload files through the designated upload endpoint.

## Endpoint Details

- **URL**: `/api/v1/upload/aws`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

## Request Payload

```typescript
{
  title: string;           // File title/name
  task_id: TASK_TYPE;      // Type of task associated with the file
  child_id: string;        // ID of the child participant
  observer_id: string;     // ID of the observer uploading the file
  file: File | Blob        // File data (form data blob)
}
```

## Implementation Logic

### 1. Authentication & Authorization

- Use `profile.utils` to verify user authentication
- Ensure the user has observer privileges

### 2. Observer Validation

- Verify observer ID exists in `user.model`
- Check observer status is `active`
- Validate observer belongs to the specified organisation

### 3. File Upload to S3

- Upload file to AWS S3 bucket
- Generate and return unique key (something that can be used to access the file through backend)
- Handle upload errors gracefully

### 4. File Record Creation

Create a new file record with the following structure:

```typescript
{
  title: string;                                    // File title
  task_id: (typeof TASK_TYPE)[number];              // Task type identifier
  file_size: number;                                // File size in bytes (calculate on frontend or backend as needed)
  organisation_id: IOrganisationProfile["_id"];     // Organisation ID
  observer_id: IObserverProfile["_id"];             // Observer ID
  child_id: IChild["user_id"];                      // Child participant ID
  date_created: Date;                               // Current date when file is uploaded
  file_url: string;                                 // S3 file URL
  last_updated: Date;                               // Last modification timestamp (same as date_created initially)
}
```

**Note**: File size can be calculated either on the frontend (before upload) or on the backend (after receiving the file). Choose the approach that best fits your architecture.

### 5. Database Storage

- Save the file record to `files.model`
- Handle database operation errors
- Return success/error response

### 5. Database Access

- file can only be accessible by the uplaoder or the specific organisation they belong to or admin
- they don't directly see th epublic url, instead they request a download and backend will check:
  observer_id or organisation_id whatever passed to allow them access the file. if child_id is provided filter the cild only for athat


## Validation Rules

### Required Fields

- All payload fields are mandatory
- File must be present and valid
- File size should be within acceptable limits

### File Restrictions

- Supported file formats: [specify allowed formats]
- Maximum file size: [specify size limit]
- File naming conventions: [specify rules]

### Business Rules

- Observer must be active
- Child must exist and be associated with observer's organisation
- Task ID must be valid
- Organisation must exist and be active

## Error Handling

### Common Error Scenarios

- **400**: Invalid payload or missing required fields
- **401**: Unauthorized access
- **403**: Observer not active or insufficient permissions
- **404**: Observer, child, or organisation not found
- **413**: File too large
- **415**: Unsupported file type
- **500**: Internal server error (S3 upload failure, database error)

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Success Response

```typescript
{
  success: true,
  data: {
    file_id: string,
    file_url: string,
    message: "File uploaded successfully"
  }
}
```

## Security Considerations

- Validate file type and content
- Sanitize file names
- Implement rate limiting for uploads
- Log all upload activities for audit purposes
- Ensure proper access controls

## Testing Checklist

- [ ] Valid file upload with all required fields
- [ ] Invalid observer ID handling
- [ ] Inactive observer handling
- [ ] File size limit enforcement
- [ ] Unsupported file type rejection
- [ ] Database error handling
- [ ] S3 upload failure handling
- [ ] Authentication/authorization validation
- [ ] File size calculation accuracy (frontend vs backend)
- [ ] Date timestamp accuracy
