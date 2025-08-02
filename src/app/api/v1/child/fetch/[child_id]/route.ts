import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import "@models/user.model"; // Import User model to register it with Mongoose
import { ProfileUtils } from "@utils/profile.utils";
import ChildPorfileModel from "@models/user.model";

export async function GET(
  request: Request,
  { params }: { params: { child_id: string } }
) {
  try {
    await connectDB();

    const { child_id } = params;
    const body = await request.json();
    const { details, files } = body;

    if (!child_id) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 }
      );
    }
    // Validate required fields
    if (!details && !files) {
      return NextResponse.json(
        { error: "missing requirements" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
    ]);

    const existingProfile = await ChildPorfileModel.findOne({
      user_id: child_id,
      oberser_id: user_id,
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const data = {
      child_id: existingProfile.user_id || null,
      child_name: existingProfile.name || null,
      child_address: existingProfile.address || null,
      child_gender: existingProfile.gender || null,
      observer_id: existingProfile.observer_id || null,
      organisation_id: existingProfile.organisation_id || null,
      survey_date: existingProfile.survey_date || null,
      survey_note: existingProfile.survey_note || null,
      survey_status: existingProfile.survey_status || null,
      survey_attempt: existingProfile.survey_attempt || null,
      date_joined: existingProfile.date_joined || null,
    };

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting organisation:", error);
    return NextResponse.json(
      { error: "Failed to delete organisation" },
      { status: 500 }
    );
  }
}
