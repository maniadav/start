import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import {
  handleApiError,
  createSuccessResponse,
  createErrorResponse,
} from "@utils/errorHandler";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    const { user_id, role } = await ProfileUtils.verifyProfile(authHeader, [
      "admin",
      "organisation",
      "observer",
    ]);

    const url = new URL(request.url);
    const queryParams = url.searchParams;

    // Get pagination parameters
    const page = parseInt(queryParams.get("page") || "1", 10);
    const limit = parseInt(queryParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // Build filter object based on provided query parameters
    const filter: Record<string, any> = {};

    if (queryParams.has("taskId")) {
      filter.task_id = queryParams.get("taskId");
    }

    if (role === "organisation") {
      // Organisations can only see their own files
      filter.organisation_id = user_id;
    } else if (queryParams.has("organisationId")) {
      // Admins can filter by any organization
      filter.organisation_id = queryParams.get("organisationId");
    }

    if (role === "observer") {
      // Observers can only see their own files
      filter.observer_id = user_id;
    } else if (queryParams.has("observerId")) {
      // Admins can filter by any observer
      filter.observer_id = queryParams.get("observerId");
    }

    if (queryParams.has("childId")) {
      filter.child_id = queryParams.get("childId");
    }

    if (queryParams.has("dateCreated")) {
      filter.date_created = queryParams.get("dateCreated");
    }

    // Get total count for pagination
    const totalCount = await FilesModel.countDocuments(filter);

    // Add sorting by date and implement pagination
    const files = await FilesModel.find(filter)
      .sort({ date_created: -1 })
      .skip(skip)
      .limit(limit);

    const data = files.map((file) => ({
      id: file._id.toString(),
      task_id: file.task_id || null,
      file_size: file.file_size || 0,
      organisation_id: file.organisation_id || null,
      observer_id: file.observer_id || null,
      child_id: file.child_id || null,
      date_created: file.date_created || new Date(),
      file_url: file.file_url || "",
      last_updated: file.last_updated || file.date_created || new Date(),
    }));

    return createSuccessResponse(
      {
        files: data,
        total: data.length,
        page: page || 1,
        limit: limit || 10,
      },
      HttpStatusCode.Ok,
      "Files retrieved successfully"
    );
  } catch (error) {
    // Use the global error handler for consistent error responses
    return handleApiError(error);
  }
}
