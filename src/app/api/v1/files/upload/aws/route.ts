import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import ObserverProfileModel from "@models/observer.profile.model";
import { S3Service } from "@services/aws.s3.service";
import AppConfig from "../../../../../../config/app.config";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(request: Request) {
  try {
    await connectDB();

    // 1. Authentication & Authorization
    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "observer",
    ]);

    // 2. Parse multipart form data
    const formData = await request.formData();
    console.log("=== Form Data Debug ===");
    console.log("FormData object:", formData);
    
    // Log all form data entries
    for (const [key, value] of formData.entries()) {
      console.log(`Key: "${key}", Value:`, value);
      if (value instanceof File) {
        console.log(`  File: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
      }
    }
    
    const title = formData.get("title") as string;
    const task_id = formData.get("task_id") as string;
    const child_id = formData.get("child_id") as string;
    const organisation_id = formData.get("organisation_id") as string;
    const file = formData.get("file") as File;
    
    console.log("=== Parsed Values ===");
    console.log("title:", title);
    console.log("task_id:", task_id);
    console.log("child_id:", child_id);
    console.log("organisation_id:", organisation_id);
    console.log("file:", file);
    console.log("file instanceof File:", file instanceof File);
    console.log("=== End Debug ===");

    // 3. Validate required fields
    if (!title || !task_id || !child_id || !organisation_id || !file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_REQUIRED_FIELDS",
            message:
              "Title, task_id, child_id, organisation_id, and file are required",
          },
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // 4. Validate file
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_FILE",
            message: "Invalid file provided",
          },
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // 5. Check file size limit from config
    const maxFileSize = AppConfig.UPLOAD.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File size exceeds maximum limit of ${maxFileSize / 1024 / 1024}MB`
          }
        },
        { status: HttpStatusCode.PayloadTooLarge }
      );
    }

    // 6. Validate file type from config
    const allowedMimeTypes = AppConfig.UPLOAD.ALLOWED_FILE_TYPES;
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: "UNSUPPORTED_FILE_TYPE",
            message: "File type not supported"
          }
        },
        { status: HttpStatusCode.UnsupportedMediaType }
      );
    }

    // 7. Get observer profile to validate organisation
    const observerProfile = await ObserverProfileModel.findOne({
      user_id: user_id,
    });

    if (!observerProfile) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "OBSERVER_NOT_FOUND",
            message: "Observer not found",
          },
        },
        { status: HttpStatusCode.NotFound }
      );
    }

    // 9. Upload file to S3
    const s3Service = new S3Service();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    let s3Key: string;
    try {
      s3Key = await s3Service.uploadFile(fileBuffer, file.name, file.type);
    } catch (uploadError) {
      console.error("S3 upload error:", uploadError);
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: "S3_UPLOAD_FAILED",
            message: uploadError instanceof Error ? uploadError.message : "Failed to upload file to S3"
          }
        },
        { status: HttpStatusCode.InternalServerError }
      );
    }

    // 10. Create file record in database
    const newFile = new FilesModel({
      title,
      task_id,
      file_size: file.size,
      organisation_id: observerProfile.organisation_id,
      observer_id: user_id,
      child_id,
      file_url: s3Key, // Store S3 key instead of public URL
      date_created: new Date(),
      last_updated: new Date(),
    });

    const savedFile = await newFile.save();

    // 11. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          file_id: savedFile._id,
          s3_key: savedFile.file_url, // Return S3 key instead of public URL
          message: "File uploaded successfully"
        }
      },
      { status: HttpStatusCode.Created }
    );
  } catch (error) {
    console.error("Error in file upload:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTHENTICATION_ERROR",
            message: error.message,
          },
        },
        { status: HttpStatusCode.Forbidden }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        },
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
