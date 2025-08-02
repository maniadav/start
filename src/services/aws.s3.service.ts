import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

/**
 * File type enumeration for S3 storage categorization
 */
export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
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
    this.bucketName = process.env.AWS_BUCKET_NAME || "";
    this.region = process.env.AWS_BUCKET_REGION || "";
    const accessKeyId = process.env.AWS_ACCESS_KEY || "";
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

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
    if (mimetype.startsWith("image/")) return FileType.IMAGE;
    if (mimetype.startsWith("video/")) return FileType.VIDEO;
    if (mimetype.startsWith("application/json")) return FileType.JSON;
    if (
      mimetype.includes("document") ||
      mimetype.includes("pdf") ||
      mimetype.includes("msword") ||
      mimetype.includes("text/")
    )
      return FileType.DOCUMENT;

    // Default to document type for other files
    return FileType.DOCUMENT;
  }

  /**
   * Uploads a file to S3 and returns the public URL
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimetype: string
  ): Promise<string> {
    const folder = this.getFileFolder(mimetype);
    const key = `${folder}/${fileName}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileBuffer,
      Key: key,
      ContentType: mimetype,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      // Generate a public URL for the uploaded file
      const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      return publicUrl;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Error uploading file to S3");
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
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  }

  /**
   * Generates a signed URL for accessing a private S3 object
   */
  async getObjectSignedUrl(
    key: string,
    expiresIn: number = 60
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }
}
