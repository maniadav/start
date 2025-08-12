import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(
      authHeader || "",
      ["admin", "organisation", "observer"]
    );

    const url = new URL(request.url);
    const queryParams = url.searchParams;

    // Get pagination parameters
    const page = parseInt(queryParams.get("page") || "1", 10);
    const limit = parseInt(queryParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    // Build filter object based on provided query parameters
    const filter: Record<string, any> = {};

    if (queryParams.has("task_id")) {
      filter.task_id = queryParams.get("task_id");
    }

    if (role === "organisation") {
      // Organizations can only see their own files
      filter.organisation_id = user_id;
    } else if (queryParams.has("organisation_id")) {
      // Admins can filter by any organization
      filter.organisation_id = queryParams.get("organisation_id");
    }

    if (queryParams.has("observer_id")) {
      filter.observer_id = queryParams.get("observer_id");
    }

    if (queryParams.has("child_id")) {
      filter.child_id = queryParams.get("child_id");
    }

    if (queryParams.has("date_created")) {
      filter.date_created = queryParams.get("date_created");
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

    return NextResponse.json(
      {
        success: true,
        count: data.length,
        total: totalCount,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
        data,
      },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      throw error;
    }

    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch file list" },
      { status: 500 }
    );
  }
}
