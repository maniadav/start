import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import ObserverProfileModel from "@models/observer.profile.model";
import { S3Service } from "@services/aws.s3.service";
import AppConfig from "../../../../../config/app.config";
import { HttpStatusCode } from "enums/HttpStatusCode";
import {
  handleApiError,
  createSuccessResponse,
  createErrorResponse,
} from "@utils/errorHandler";

export async function POST(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    const { user_id } = await ProfileUtils.verifyProfile(authHeader, [
      "observer",
    ]);

    // 2. Parse multipart form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const taskId = formData.get("taskId") as string;
    const childId = formData.get("childId") as string;
    const organisationId = formData.get("organisationId") as string;
    const file = formData.get("file") as File;

    // 3. Validate required fields
    if (!title || !taskId || !childId || !organisationId || !file) {
      return createErrorResponse(
        "MISSING_REQUIRED_FIELDS",
        "Title, taskId, childId, organisationId, and file are required",
        HttpStatusCode.BadRequest
      );
    }

    // 4. Validate file
    if (!(file instanceof File) || file.size === 0) {
      return createErrorResponse(
        "INVALID_FILE",
        "Invalid file provided",
        HttpStatusCode.BadRequest
      );
    }

    // 5. Check file size limit from config
    const maxFileSize = AppConfig.UPLOAD.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      return createErrorResponse(
        "FILE_TOO_LARGE",
        `File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`,
        HttpStatusCode.PayloadTooLarge
      );
    }

    // 6. Validate file type - support CSV and JSON files
    const allowedMimeTypes = [
      ...AppConfig.UPLOAD.ALLOWED_FILE_TYPES,
      "text/csv",
      "application/json",
      "text/plain", // For CSV files that might be detected as text/plain
    ];

    // Also check file extension as fallback
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isAllowedExtension =
      fileExtension === "csv" || fileExtension === "json";
    const isAllowedMimeType = allowedMimeTypes.includes(file.type);

    if (!isAllowedMimeType && !isAllowedExtension) {
      return createErrorResponse(
        "UNSUPPORTED_FILE_TYPE",
        `File type not supported. Got: ${file.type}, extension: ${fileExtension}. Allowed: CSV and JSON files.`,
        HttpStatusCode.UnsupportedMediaType
      );
    }

    // 7. Get observer profile to validate organisation
    const observerProfile = await ObserverProfileModel.findOne({
      user_id: user_id,
    });

    if (!observerProfile) {
      return createErrorResponse(
        "OBSERVER_NOT_FOUND",
        "Observer not found",
        HttpStatusCode.NotFound
      );
    }

    // 8. Validate organisation access
    if (observerProfile.organisation_id?.toString() !== organisationId) {
      return createErrorResponse(
        "ORGANISATION_MISMATCH",
        "Observer does not have access to this organisation",
        HttpStatusCode.Forbidden
      );
    }

    // 9. Upload file to S3
    const s3Service = new S3Service();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    let s3Key: string;
    try {
      s3Key = await s3Service.uploadFile(fileBuffer, file.name, file.type);
    } catch (uploadError) {
      return createErrorResponse(
        "S3_UPLOAD_FAILED",
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload file to S3",
        HttpStatusCode.InternalServerError
      );
    }

    // 10. Create file record in database
    const newFile = new FilesModel({
      title,
      task_id: taskId,
      file_size: file.size,
      organisation_id: observerProfile.organisation_id,
      observer_id: user_id,
      child_id: childId,
      file_url: s3Key, // Store S3 key instead of public URL
      date_created: new Date(),
      last_updated: new Date(),
    });

    const savedFile = await newFile.save();

    return createSuccessResponse(
      {
        file_id: savedFile._id,
        s3_key: savedFile.file_url, // Return S3 key instead of public URL
      },
      HttpStatusCode.Ok,
      "File uploaded successfully"
    );
  } catch (error) {
    // Use the global error handler for all unhandled errors
    return handleApiError(error);
  }
}
