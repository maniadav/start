import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import { S3Service } from "@services/aws.s3.service";
import AppConfig from "../../../../../../config/app.config";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function GET(
  request: Request,
  { params }: { params: { file_id: string } }
) {
  try {
    await connectDB();

    const { file_id } = params;
    if (!file_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_FILE_ID",
            message: "File ID is required"
          }
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // 1. Authentication & Authorization
    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin", "organisation", "observer"
    ]);

    // 2. Get file record from database
    const fileRecord = await FilesModel.findById(file_id);
    if (!fileRecord) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_NOT_FOUND",
            message: "File not found"
          }
        },
        { status: HttpStatusCode.NotFound }
      );
    }

    // 3. Check access permissions
    let hasAccess = false;
    
    if (role === "admin") {
      // Admins can access all files
      hasAccess = true;
    } else if (role === "organisation") {
      // Organisations can only access files from their organisation
      hasAccess = fileRecord.organisation_id.toString() === user_id;
    } else if (role === "observer") {
      // Observers can access files they uploaded or files from their organisation
      hasAccess = (
        fileRecord.observer_id.toString() === user_id ||
        fileRecord.organisation_id.toString() === user_id
      );
    }

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCESS_DENIED",
            message: "You don't have permission to access this file"
          }
        },
        { status: HttpStatusCode.Forbidden }
      );
    }

    // 4. Generate secure download URL
    const s3Service = new S3Service();
    const secureUrl = await s3Service.generateSecureDownloadUrlWithHeaders(
      fileRecord.file_url, // This is now the S3 key
      fileRecord.title || "download",
      AppConfig.SECURITY.RATE_LIMIT_WINDOW / 1000 // Convert to seconds for S3 signed URL
    );

    // 5. Return secure download URL
    return NextResponse.json(
      {
        success: true,
        data: {
          download_url: secureUrl,
          expires_in: AppConfig.SECURITY.RATE_LIMIT_WINDOW / 1000, // Convert to seconds
          file_name: fileRecord.title,
          file_size: fileRecord.file_size,
          message: "Secure download URL generated successfully"
        }
      },
      { status: HttpStatusCode.Ok }
    );

  } catch (error) {
    console.error("Error generating download URL:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTHENTICATION_ERROR",
            message: error.message
          }
        },
        { status: HttpStatusCode.Forbidden }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate download URL"
        }
      },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
