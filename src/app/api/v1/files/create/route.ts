import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import FilesModel from "@models/file.model";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
      "organisation",
    ]);

    const body = await request.json();
    const {
      title,
      task_id,
      file_size,
      organisation_id,
      observer_id,
      child_id,
      file_url,
    } = body;

    // Validate required fields
    if (!task_id || !file_url || !file_size) {
      return NextResponse.json(
        { error: "Task ID, file URL, and file size are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Create new file record
    const newFile = new FilesModel({
      title: title || null,
      task_id,
      file_size,
      organisation_id: organisation_id || user_id, // Use provided org ID or default to user_id
      observer_id: observer_id || null,
      child_id: child_id || null,
      file_url,
      date_created: new Date(),
      last_updated: new Date(),
    });

    const savedFile = await newFile.save();

    return NextResponse.json(
      {
        message: "File record created successfully",
        data: {
          task_id: savedFile.task_id,
          file_size: savedFile.file_size,
          organisation_id: savedFile.organisation_id,
          observer_id: savedFile.observer_id,
          child_id: savedFile.child_id,
          date_created: savedFile.date_created,
          file_url: savedFile.file_url,
          last_updated: savedFile.last_updated,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating file record:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to create file record" },
      { status: 500 }
    );
  }
}
