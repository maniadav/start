# Scripts Directory

This directory contains utility scripts for the START Project.

## Gmail SMTP Setup Scripts

### `generate-gmail-refresh-token.js`
Generates a refresh token for Gmail SMTP authentication.

**Usage:**
```bash
# Update the script with your Google Cloud credentials first
node scripts/generate-gmail-refresh-token.js

# Or use the npm script
yarn gmail:setup
```

**What it does:**
1. Prompts you to visit a Google OAuth URL
2. Asks for the authorization code
3. Exchanges the code for a refresh token
4. Displays the complete environment variables for your `.env` file

### `test-gmail-setup.js`
Tests your Gmail SMTP configuration by sending a test email.

**Usage:**
```bash
# Test with a specific email address
node scripts/test-gmail-setup.js recipient@example.com

# Or use the npm script
yarn gmail:test recipient@example.com
```

**What it does:**
1. Validates all required environment variables
2. Sends a test email to the specified recipient
3. Displays success/error messages with troubleshooting tips

## Prerequisites

Before running these scripts, make sure you have:

1. **Google Cloud Project** with Gmail API enabled
2. **OAuth 2.0 credentials** (Client ID and Client Secret)
3. **Environment variables** set in your `.env` file (for test script)

## Environment Variables Required

```env
GOOGLE_SMTP_EMAIL_ID=your-email@gmail.com
GOOGLE_SMTP_CLIENT_ID=your-client-id
GOOGLE_SMTP_CLIENT_SECRET=your-client-secret
GOOGLE_SMTP_REDIRECT_URI=http://localhost:3000
GOOGLE_SMTP_REFRESH_TOKEN=your-refresh-token
```

## Troubleshooting

- **"Invalid credentials"**: Check your Client ID and Client Secret
- **"Access blocked"**: Verify OAuth consent screen configuration
- **"Quota exceeded"**: Gmail has daily sending limits (100 emails/day for free accounts)
- **Missing environment variables**: Make sure your `.env` file is properly configured

For detailed setup instructions, see `docs/backend/email_service.md`.
