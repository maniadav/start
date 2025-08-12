import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import connectDB from "@lib/mongodb";
import FilesModel from "@models/file.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Verify authentication - allow observers to upload files
    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "observer",
      "admin", // Allow admin for testing
    ]);

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const taskType = formData.get("taskType") as string;

    // Optional parameters for database record
    const organisationId = formData.get("organisationId") as string;
    const observerId = formData.get("observerId") as string;
    const childId = formData.get("childId") as string;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!taskType) {
      return NextResponse.json(
        { error: "No task type provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Create the files directory path in public
    const filesDir = path.join(process.cwd(), "public", "files", taskType);

    // Create directory if it doesn't exist
    if (!existsSync(filesDir)) {
      await mkdir(filesDir, { recursive: true });
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const baseName = path.basename(file.name, fileExtension);
    const uniqueFileName = `${baseName}_${timestamp}${fileExtension}`;

    // Full path for the file
    const filePath = path.join(filesDir, uniqueFileName);

    // Write the file to public directory
    await writeFile(filePath, buffer);

    // Create file URL for database
    const fileUrl = `/files/${taskType}/${uniqueFileName}`;

    // Create database record
    const newFile = new FilesModel({
      title: title || file.name,
      task_id: taskType,
      file_size: file.size,
      organisation_id: organisationId, // Use provided org ID or default to user_id
      observer_id: observerId, // Use provided observer ID or default to user_id
      child_id: childId || null,
      file_url: fileUrl,
      date_created: new Date(),
      last_updated: new Date(),
    });

    const savedFile = await newFile.save();

    // Return success response with file info and database record
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        // File system info
        originalName: file.name,
        fileName: uniqueFileName,
        taskType,
        size: file.size,
        path: fileUrl,
        uploadedAt: new Date().toISOString(),
        // Database record info
        fileId: savedFile._id,
        databaseRecord: {
          title: savedFile.title,
          task_id: savedFile.task_id,
          file_size: savedFile.file_size,
          organisation_id: savedFile.organisation_id,
          observer_id: savedFile.observer_id,
          child_id: savedFile.child_id,
          file_url: savedFile.file_url,
          date_created: savedFile.date_created,
        },
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    if (error instanceof TokenUtilsError) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
