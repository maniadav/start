# AWS S3 Storage Setup Guide for START Backend

This document provides a step-by-step guide to integrating AWS S3 as the primary storage solution for the START backend. Follow each section carefully to ensure secure and reliable access to your S3 bucket.

---

## 1. Create an AWS Account

Register for an AWS account at [AWS Signup](https://signin.aws.amazon.com/signup?request_type=register). Complete all required details, including payment information.

---

## 2. Create an S3 Bucket

1. Log in to the AWS Management Console.
2. Search for "S3" in the AWS search bar and navigate to the S3 Console.
3. Click **Create bucket**.
4. Configure the following settings:
   - **Bucket name**: Choose a globally unique name (e.g., `your_bucket_name`).
   - **Region**: Select your preferred region (e.g., `eu-north-1`).
   - **Object Ownership**: ACLs disabled.
   - **Block Public Access**: Keep all options enabled (recommended for security).
   - **Bucket Versioning**: Disabled.
   - **Default Encryption**: Enable server-side encryption with Amazon S3 managed keys (SSE-S3).
   - **Bucket Key**: Enable.
   - Leave other settings as default unless you have specific requirements.
5. Click **Create bucket** to finalize.

---

## 3. Create an IAM User for Programmatic S3 Access

Your backend requires an IAM user with programmatic access to S3. Follow these steps:

1. In the AWS Console, search for "IAM" and navigate to the IAM service.
2. Go to **Users** and click **Create user**.
3. Set a username (e.g., `your_bucket_user`).
4. Under **Set permissions**, select **Attach policies directly**.
5. Click **Create policy** and switch to the **JSON** tab in the policy editor. Paste the following policy, replacing `your_bucket_name` with the one created above:

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
           "arn:aws:s3:::your_bucket_name",
           "arn:aws:s3:::your_bucket_name/*"
         ]
       }
     ]
   }
   ```

6. Name the policy (e.g., `<your_iam_bucket_access_policy>`) and create it.
7. Return to the user creation page, refresh the policies list, and attach your new policy.
8. Complete user creation.
9. After the user is created, select the user and go to the **Security credentials** tab.
10. Click **Create access key**:
    - Select **Third-party service**.
    - Download and securely store the Access Key ID and Secret Access Key. These credentials are required for backend integration.

**Note:**

- Save the Access Key ID and Secret Access Key for your `.env` file or share them securely with the START admin.
- Copy the IAM user's ARN (e.g., `arn:aws:iam::<id>:user/<your_bucket_user>`) from the user details page. This will be needed for the bucket policy.

---

## 4. Configure the S3 Bucket Policy

1. In the S3 Console, select your bucket `your_bucket_name` and go to the **Permissions** tab.
2. Ensure **Block all public access** is enabled.
3. Add or update the bucket policy as follows (replace placeholders with your actual values):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowUserObjectManagement",
         "Effect": "Allow",
         "Principal": {
           "AWS": "<your_bucket_user_arn>"
         },
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::your_bucket_name/*",
           "arn:aws:s3:::your_bucket_name"
         ]
       },
       {
         "Sid": "ExplicitlyDenyEveryoneElse",
         "Effect": "Deny",
         "Principal": "*",
         "Action": "s3:*",
         "Resource": [
           "arn:aws:s3:::your_bucket_name",
           "arn:aws:s3:::your_bucket_name/*"
         ],
         "Condition": {
           "StringNotEquals": {
             "aws:PrincipalArn": [
               "<your_bucket_user_arn>",
               "<your_aws_account_root_user_arn>"
             ]
           }
         }
       }
     ]
   }
   ```

   - `<your_bucket_user_arn>`: The ARN of the IAM user created above.
   - `<your_aws_account_root_user_arn>`: The ARN of your AWS account root user (optional, for root access).

---

## 5. Set Environment Variables

Create a `.env` file in your project root (if self-deploying) or securely share the following credentials with the START team if you want to use your own storage server:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=<your_bucket_user_access_key>
AWS_SECRET_ACCESS_KEY=<your_bucket_user_secret_access_key>
AWS_S3_BUCKET_NAME=<your_bucket_name>
AWS_DEFAULT_REGION=<your_bucket_region>
```

---
