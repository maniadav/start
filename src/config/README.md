# Configuration Management

This directory contains centralized configuration management for the application.

## Files

- `app.config.ts` - Main configuration class that loads and validates all environment variables

## Usage

### Basic Usage

```typescript
import AppConfig from '@config/app.config';

// Access configuration values
const bucketName = AppConfig.AWS.BUCKET_NAME;
const maxFileSize = AppConfig.UPLOAD.MAX_FILE_SIZE;
const isProd = AppConfig.isProduction();
```

### Configuration Sections

#### AWS Configuration
```typescript
AppConfig.AWS.BUCKET_NAME
AppConfig.AWS.BUCKET_REGION
AppConfig.AWS.ACCESS_KEY
AppConfig.AWS.SECRET_ACCESS_KEY
```

#### Database Configuration
```typescript
AppConfig.DATABASE.MONGODB_URI
AppConfig.DATABASE.MONGODB_DB_NAME
```

#### JWT Configuration
```typescript
AppConfig.JWT.SECRET
AppConfig.JWT.ACCESS_TOKEN_EXPIRY
AppConfig.JWT.REFRESH_TOKEN_EXPIRY
```

#### File Upload Configuration
```typescript
AppConfig.UPLOAD.MAX_FILE_SIZE
AppConfig.UPLOAD.ALLOWED_FILE_TYPES
```

#### Server Configuration
```typescript
AppConfig.SERVER.PORT
AppConfig.SERVER.NODE_ENV
AppConfig.SERVER.API_BASE_URL
```

## Environment Variables

### Required Variables
- `AWS_BUCKET_NAME` - S3 bucket name for file uploads
- `AWS_BUCKET_REGION` - AWS region for S3 bucket
- `AWS_ACCESS_KEY` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Optional Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: development)
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 1MB)
- `ALLOWED_FILE_TYPES` - Comma-separated list of allowed MIME types
- `SMTP_HOST` - SMTP server host for emails
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password

## Validation

The configuration is automatically validated on application startup:

1. **Critical errors** - Application will exit if required values are missing
2. **Warnings** - Non-critical missing values will log warnings but allow startup
3. **Configuration summary** - Logs current configuration status

## Example .env File

```bash
# AWS Configuration
AWS_BUCKET_NAME=my-app-files
AWS_BUCKET_REGION=us-east-1
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Database
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=my-super-secret-key

# File Upload
MAX_FILE_SIZE=1048576
ALLOWED_FILE_TYPES=image/jpeg,image/png,text/csv

# Server
PORT=3000
NODE_ENV=development
```

## Benefits

1. **Centralized** - All configuration in one place
2. **Validated** - Automatic validation on startup
3. **Typed** - Full TypeScript support
4. **Secure** - No sensitive data in logs
5. **Flexible** - Easy to add new configuration sections
6. **Environment-aware** - Different behavior for dev/prod

## Adding New Configuration

To add new configuration sections:

1. Add new properties to the `AppConfig` class
2. Add validation logic in the `validate()` method
3. Add logging in the `logConfiguration()` method
4. Update this README with new variables



