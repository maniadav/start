import { NextRequest, NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import { S3Service } from "@services/aws.s3.service";
import JSZip from "jszip";
import { HttpStatusCode } from "enums/HttpStatusCode";
import {
  handleApiError,
  createErrorResponse,
} from "@utils/errorHandler";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(authHeader, [
      "admin",
      "organisation",
      "observer",
    ]);

    const { searchParams } = new URL(request.url);

    // Extract filter parameters from query string
    const observerId = searchParams.get("observerId");
    const organisationId = searchParams.get("organisationId");
    const taskId = searchParams.get("taskId");
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");
    const fileSizeMin = searchParams.get("fileSizeMin");
    const fileSizeMax = searchParams.get("fileSizeMax");
    const searchTerm = searchParams.get("searchTerm");
    const sortField = searchParams.get("sortField") || "date_created";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    // Build filter object for database query
    const filters: any = {};

    // Role-based access control
    if (role === "observer") {
      // Observers can only access their own files
      filters.observer_id = user_id;
    } else if (role === "organisation") {
      // Organisation users can access files from their organisation
      if (organisationId) {
        filters.organisation_id = organisationId;
      } else {
        // If no specific organisation specified, use user's organisation
        // You might need to get this from the user's profile
        filters.organisation_id = { $exists: true }; // Placeholder - adjust based on your user model
      }
    }
    // Admin users can access all files

    if (observerId) filters.observer_id = observerId;
    if (organisationId) filters.organisation_id = organisationId;
    if (taskId) filters.task_id = taskId;
    if (dateStart || dateEnd) {
      filters.date_created = {};
      if (dateStart) filters.date_created.$gte = new Date(dateStart);
      if (dateEnd) filters.date_created.$lte = new Date(dateEnd);
    }
    if (fileSizeMin || fileSizeMax) {
      filters.file_size = {};
      if (fileSizeMin) filters.file_size.$gte = parseInt(fileSizeMin);
      if (fileSizeMax) filters.file_size.$lte = parseInt(fileSizeMax);
    }
    if (searchTerm) {
      filters.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { task_id: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortField] = sortDirection === "desc" ? -1 : 1;

    // Query files from database
    const files = await FilesModel.find(filters).sort(sort);

    if (files.length === 0) {
      return createErrorResponse(
        "NO_FILES_FOUND",
        "No files found matching the specified criteria",
        HttpStatusCode.NotFound
      );
    }

    // Create zip file
    const zip = new JSZip();
    const s3Service = new S3Service();

    // Add files to zip
    for (const file of files) {
      try {
        // Download file from S3
        const fileBuffer = await s3Service.downloadFile(file.file_url);

        // Create a descriptive filename
        const fileName = `${file.title}_${file.task_id}_${
          file.child_id
        }.${getFileExtension(file.file_url)}`;

        // Add to zip with organized folder structure
        zip.file(`data/${fileName}`, new Uint8Array(fileBuffer));
      } catch (error) {
        console.error(`Failed to download file ${file.file_url}:`, error);
      }
    }

    // Generate zip buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Create response with zip file
    const response = new NextResponse(zipBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="bulk_download_${
          new Date().toISOString().split("T")[0]
        }.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(authHeader, [
      "admin",
      "organisation",
      "observer",
    ]);

    const body = await request.json();
    const { filters } = body;

    // Build filter object for database query
    const dbFilters: any = {};

    // Role-based access control
    if (role === "observer") {
      dbFilters.observer_id = user_id;
    } else if (role === "organisation") {
      if (filters.organisationId) {
        dbFilters.organisation_id = filters.organisationId;
      } else {
        dbFilters.organisation_id = { $exists: true }; // Placeholder
      }
    }

    // Apply other filters
    if (filters?.observerId) dbFilters.observer_id = filters?.observerId;
    if (filters?.organisationId)
      dbFilters.organisation_id = filters?.organisationId;
    if (filters?.taskId) dbFilters.task_id = filters?.taskId;
    if (filters?.dateStart || filters?.dateEnd) {
      dbFilters.date_created = {};
      if (filters?.dateStart)
        dbFilters.date_created.$gte = new Date(filters?.dateStart);
      if (filters?.dateEnd)
        dbFilters.date_created.$lte = new Date(filters?.dateEnd);
    }
    if (filters?.fileSizeMin || filters?.fileSizeMax) {
      dbFilters.file_size = {};
      if (filters?.fileSizeMin)
        dbFilters.file_size.$gte = parseInt(filters?.fileSizeMin);
      if (filters?.fileSizeMax)
        dbFilters.file_size.$lte = parseInt(filters?.fileSizeMax);
    }
    if (filters?.searchTerm) {
      dbFilters.$or = [
        { title: { $regex: filters?.searchTerm, $options: "i" } },
        { task_id: { $regex: filters?.searchTerm, $options: "i" } },
      ];
    }

    // Count total files matching criteria
    const totalFiles = await FilesModel.countDocuments(dbFilters);

    if (totalFiles === 0) {
      return createErrorResponse(
        "NO_FILES_FOUND",
        "No files found matching the specified criteria",
        HttpStatusCode.NotFound
      );
    }

    // Check if total file size would be reasonable (e.g., < 100MB)
    const totalSizeEstimate = totalFiles * 1024 * 1024; // Rough estimate: 1MB per file
    if (totalSizeEstimate > 100 * 1024 * 1024) {
      // 100MB limit
      return createErrorResponse(
        "DOWNLOAD_TOO_LARGE",
        `Estimated download size (${Math.round(
          totalSizeEstimate / 1024 / 1024
        )}MB) exceeds limit. Please refine your filters?.`,
        HttpStatusCode.PayloadTooLarge
      );
    }

    const jobId = `bulk_${Date.now()}`;

    const response = {
      jobId,
      status: "ready",
      message: "Bulk download ready for processing",
      totalFiles,
      estimatedSize: `${Math.round(totalSizeEstimate / 1024 / 1024)}MB`,
      downloadUrl: `/api/v1/files/download/bulk?${new URLSearchParams(
        filters as Record<string, string>
      ).toString()}`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

// Helper function to get file extension from S3 key
function getFileExtension(s3Key: string): string {
  const parts = s3Key.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "bin";
}
