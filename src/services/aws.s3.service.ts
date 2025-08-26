import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3ServiceException,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AppConfig from "../config/app.config";

/**
 * File type enumeration for S3 storage categorization
 */
export enum FileType {
  IMAGE = "image",
  CSV = "csv",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  JSON = "json",
}

/**
 * AWS S3 Service Class for managing file operations
 */
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = AppConfig.AWS.BUCKET_NAME;
    this.region = AppConfig.AWS.BUCKET_REGION;
    const accessKeyId = AppConfig.AWS.ACCESS_KEY;
    const secretAccessKey = AppConfig.AWS.SECRET_ACCESS_KEY;

    // Configuration is already validated by AppConfig, but double-check for safety
    if (!this.bucketName || !this.region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "AWS configuration is incomplete. Please check your environment variables."
      );
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Determines the folder to store the file based on mimetype
   */
  private getFileFolder(mimetype: string): string {
    // CSV files
    if (mimetype === "text/csv") return FileType.CSV;

    // Spreadsheet files
    if (
      mimetype === "application/vnd.ms-excel" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
      return FileType.SPREADSHEET;

    // Document files
    if (
      mimetype === "application/msword" ||
      mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return FileType.DOCUMENT;

    // JSON files
    if (mimetype === "application/json") return FileType.JSON;

    // Default to document type for other files
    return FileType.DOCUMENT;
  }

  /**
   * Generates a unique filename with timestamp and sanitization
   */
  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `${timestamp}_${sanitizedName}`;
  }

  /**
   * Uploads a file to S3 and returns the S3 key (not public URL)
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimetype: string
  ): Promise<string> {
    try {
      const folder = this.getFileFolder(mimetype);
      const uniqueFileName = this.generateUniqueFileName(fileName);
      const key = `${folder}/${uniqueFileName}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Body: fileBuffer,
        Key: key,
        ContentType: mimetype,
        CacheControl: "max-age=31536000", // 1 year cache
        Metadata: {
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
        },
        // Make file private by default
        ACL: ObjectCannedACL.private,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      console.log(`File uploaded successfully to S3: ${key}`);
      // Return the S3 key instead of public URL
      return key;
    } catch (error) {
      console.error("Error uploading file to S3:", error);

      if (error instanceof S3ServiceException) {
        switch (error.name) {
          case "NoSuchBucket":
            throw new Error(`S3 bucket '${this.bucketName}' does not exist`);
          case "AccessDenied":
            throw new Error(
              "Access denied to S3 bucket. Check your AWS credentials and permissions"
            );
          case "InvalidAccessKeyId":
            throw new Error("Invalid AWS access key ID");
          case "SignatureDoesNotMatch":
            throw new Error("Invalid AWS secret access key");
          default:
            throw new Error(`S3 upload failed: ${error.message}`);
        }
      }

      throw new Error(
        `Failed to upload file to S3: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Uploads JSON data to S3 as a file
   */
  async uploadJSON(data: object, fileName: string): Promise<string> {
    const jsonString = JSON.stringify(data, null, 2);
    const fileBuffer = Buffer.from(jsonString);
    return this.uploadFile(fileBuffer, fileName, "application/json");
  }

  /**
   * Deletes a file from S3
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: fileName,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log(`File deleted successfully from S3: ${fileName}`);
    } catch (error) {
      console.error("Error deleting file from S3:", error);

      if (error instanceof S3ServiceException) {
        if (error.name === "NoSuchKey") {
          console.warn(`File ${fileName} not found in S3 bucket`);
          return; // File doesn't exist, consider deletion successful
        }
        throw new Error(`S3 deletion failed: ${error.message}`);
      }

      throw new Error(
        `Failed to delete file from S3: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generates a signed URL for secure file access
   * This URL expires after the specified time and only works for authorized users
   */
  async generateSecureDownloadUrl(
    key: string,
    expiresIn: number = 300 // 5 minutes default
  ): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      console.log(
        `Generated secure download URL for ${key}, expires in ${expiresIn} seconds`
      );
      return signedUrl;
    } catch (error) {
      console.error("Error generating secure download URL:", error);
      throw new Error(
        `Failed to generate secure download URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generates a signed URL for secure file access with custom response headers
   * Useful for forcing downloads with specific filenames
   */
  async generateSecureDownloadUrlWithHeaders(
    key: string,
    originalFileName: string,
    expiresIn: number = 300 // 5 minutes default
  ): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${originalFileName}"`,
        ResponseContentType: "application/octet-stream",
      };

      const command = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      console.log(
        `Generated secure download URL with headers for ${key}, expires in ${expiresIn} seconds`
      );
      return signedUrl;
    } catch (error) {
      console.error(
        "Error generating secure download URL with headers:",
        error
      );
      throw new Error(
        `Failed to generate secure download URL with headers: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Checks if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3Client.send(new GetObjectCommand(params));
      return true;
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === "NoSuchKey") {
        return false;
      }
      throw error;
    }
  }

  /**
   * Gets file metadata from S3
   */
  async getFileMetadata(
    key: string
  ): Promise<{ size: number; lastModified: Date; contentType: string } | null> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const response = await this.s3Client.send(command);

      return {
        size: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        contentType: response.ContentType || "application/octet-stream",
      };
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === "NoSuchKey") {
        return null;
      }
      throw error;
    }
  }
}
