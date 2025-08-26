primary storage is aws s3.

# Storage Setup for START

This document provides essential setup steps for AWS S3 integration with START backend.

## Overview

This setup created organisation specific storage

- files storage in organisation speific aws s3 resources.

## Setup Steps

### 1. Create S3 Bucket

1. Navigate to AWS S3 Console and click "Create bucket"
2. Set bucket name: `your-bucket-name` (must be globally unique)
3. Select region: `eu-north-1` (or your preferred region)
4. Configure options:

- Enable versioning
- Enable server-side encryption (SSE-S3)
- Disable Object Lock

5. Keep all public access blocks enabled for now
6. Click "Create bucket"

**Note**: Remember your bucket name for policies and environment variables.

### 2. Create S3 Folders

Create these folders in your bucket:

your-bucket-name/

├──survey_files/

**Method**: Click on bucket → "Create folder" → Enter folder name → Repeat for both folders.

### 3. Create IAM User

Your backend needs programmatic access to S3:

1. Navigate to IAM Console → Users → Create user
2. Set username: `your-bucket-user`
3. Select "Access key - Programmatic access"
4. Attach policy: "AmazonS3FullAccess"
5. Add tags: `Project: YugenSpace`, `Environment: Production`
6. Create user → Security credentials → Create access key
7. Select "Application running outside AWS"
8. Download CSV with credentials
9. Add this iam policy

```json
{
  "Version": "2012-10-17",

  "Statement": [
    {
      "Effect": "Allow",

      "Action": [
        "s3:GetObject",

        "s3:PutObject",

        "s3:DeleteObject",

        "s3:ListBucket"
      ],

      "Resource": [
        "arn:aws:s3:::your-bucket-name",

        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

**Important**: Save the Access Key ID and Secret Access Key for your .env file.

### 4. Configure Bucket Policy

Make images in `eo_uploads/` publicly accessible:

1. Go to S3 Console → Your bucket → Permissions → Bucket policy
2. Disable public access blocks first:

- Navigate to "Block public access" → Edit
- Uncheck "Block all public access"
- Save changes (type "confirm")

3. Add this bucket policy (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",

  "Id": "YugenSpaceAccessPolicy",

  "Statement": [
    {
      "Sid": "PublicReadForEOUploads",

      "Effect": "Allow",

      "Principal": "*",

      "Action": "s3:GetObject",

      "Resource": "arn:aws:s3:::your-bucket-name/eo_uploads/*"
    },

    {
      "Sid": "PrivateAccessForEODownloads",

      "Effect": "Deny",

      "Principal": "*",

      "Action": "s3:GetObject",

      "Resource": "arn:aws:s3:::your-bucket-name/eo_downloads/*",

      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": "arn:aws:iam::248189943386:user/your-bucket-user"
        }
      }
    }
  ]
}
```

**Result**: Images in `eo_uploads/` will be public, data in `eo_downloads/` remains private.

### 5. Set Environment Variables

Create a `.env` file in your project root:

```bash

# AWS S3 Configuration

AWS_ACCESS_KEY_ID=<your_access_key>

AWS_SECRET_ACCESS_KEY=<your_secret_access_key>

AWS_S3_BUCKET_NAME=your-bucket-name

AWS_DEFAULT_REGION=eu-north-1

```

**Replace with your actual values** from the IAM user CSV file.

### 6. Install Dependencies

```bash

poetryinstall

# or

pipinstallboto3

```

## S3 Service Integration

### S3Service Class Overview

The `services/s3_services.py` file contains the `S3Service` class that handles all S3 operations:

```python

from yugenspace_backend.services.s3_services import s3_service


# Check if file exists

if s3_service.file_exists("roi_123_ndvi.png","eo_uploads"):

    url = s3_service.get_file_url("roi_123_ndvi.png","eo_uploads")


# Upload file

s3_url = s3_service.upload_file("local_file.png","roi_123_ndvi.png","eo_uploads")


# Download file

success = s3_service.download_file("data.npy.gz","local_path","eo_downloads")

```

### Key Methods

| Method | Purpose | Example |

| ----------------- | -------------------------- | --------------------------------------------------------------------------- |

| `file_exists()` | Check if file exists in S3 | `s3_service.file_exists("roi_123_ndvi.png", "eo_uploads")` |

| `get_file_url()` | Get public URL for file | `s3_service.get_file_url("roi_123_ndvi.png", "eo_uploads")` |

| `upload_file()` | Upload local file to S3 | `s3_service.upload_file("local.png", "remote.png", "eo_uploads")` |

| `download_file()` | Download S3 file locally | `s3_service.download_file("remote.npy.gz", "local.npy.gz", "eo_downloads")` |

| `list_files()` | List files in S3 folder | `s3_service.list_files("eo_uploads")` |

### Integration Points

1.**EO Downloads** (`eo_tools.py`):

- Downloads data to temp directory
- Uploads all files to `eo_downloads/{roi_key}/`
- Cleans up temp directory
- Returns S3 folder URL

  2.**Image Generation** (`tools_helper.py`):

- Checks if image exists in S3 first
- Downloads required data from `eo_downloads/`
- Generates image locally
- Uploads to `eo_uploads/` with flat naming
- Returns S3 image URL

### S3 File Structure

```

your-bucket/

├── eo_downloads/                    # Private - Raw EO data

│   ├── roi_123/

│   │   ├── bbox.geojson

│   │   ├── timestamps.json

│   │   └── data/BANDS.npy.gz

│   └── roi_456/

│       └── ...

└── eo_uploads/                      # Public - Generated images

    ├── roi_123_ndvi.png            # Flat naming

    ├── roi_123_truecolor.png

    ├── roi_456_ndvi.png

    └── roi_456_truecolor.png

```

### URL Generation

Images are accessible at:

```

https://your-bucket.s3.your-region.amazonaws.com/eo_uploads/roi_123_ndvi.png

https://your-bucket.s3.your-region.amazonaws.com/eo_uploads/roi_123_truecolor.png

```

## AWS CLI Test

```bash

# Test bucket access

awss3lss3://your-bucket-name


# Test file operations

echo"test">test.txt

awss3cptest.txts3://your-bucket-name/eo_uploads/test.txt

awss3cps3://your-bucket-name/eo_uploads/test.txttest_download.txt

awss3rms3://your-bucket-name/eo_uploads/test.txt

rmtest.txttest_download.txt

```

## CORS Configuration

For web browser access to S3 images:

```json
[
  {
    "AllowedHeaders": ["*"],

    "AllowedMethods": ["GET"],

    "AllowedOrigins": ["*"],

    "ExposeHeaders": ["ETag"],

    "MaxAgeSeconds": 3000
  }
]
```

### Lifecycle Policies

Automatically move old data to cheaper storage:

```json
{
  "ID": "EODataLifecycle",

  "Status": "Enabled",

  "Filter": { "Prefix": "eo_downloads/" },

  "Transitions": [
    { "Days": 30, "StorageClass": "STANDARD_IA" },

    { "Days": 90, "StorageClass": "GLACIER" }
  ]
}
```
