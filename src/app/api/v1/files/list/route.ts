import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import FilesModel from "@models/file.model";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { verified } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
      "organisation",
    ]);

    if (!verified) {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    
    // Build filter object based on provided query parameters
    const filter: Record<string, any> = {};
    
    if (queryParams.has('task_id')) {
      filter.task_id = queryParams.get('task_id');
    }
    
    if (queryParams.has('organisation_id')) {
      filter.organisation_id = queryParams.get('organisation_id');
    }
    
    if (queryParams.has('observer_id')) {
      filter.observer_id = queryParams.get('observer_id');
    }
    
    if (queryParams.has('child_id')) {
      filter.child_id = queryParams.get('child_id');
    }
    
    if (queryParams.has('date_created')) {
      filter.date_created = queryParams.get('date_created');
    }

    const files = await FilesModel.find(filter);

    const data: any[] = files.map((profile: any) => ({
      task_id: profile.task_id,
      file_size: profile.file_size,
      organisation_id: profile.organisation_id,
      observer_id: profile.observer_id,
      child_id: profile.child_id,
      date_created: profile.date_created,
      file_url: profile.file_url,
      created_at: profile.created_at,
      last_updated: profile.last_updated,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof TokenUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch organisation profiles" },
      { status: 500 }
    );
  }
}
