import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils } from "@utils/profile.utils";
import ChildModel from "@models/child.model";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function GET(
  request: Request,
  { params }: { params: { child_id: string } }
) {
  try {
    await connectDB();

    const { child_id } = params;
    const body = await request.json();
    // implement the logic to extract file details
    const { files } = body;

    if (!child_id) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(
      authHeader || "",
      ["admin", "observer"]
    );

    // Create a query that filters by observer_id only if role is not admin
    const query = {
      user_id: child_id,
      ...(role !== "admin" && { observer_id: user_id }),
    };

    const existingProfile = await ChildModel.findOne(query);

    if (!existingProfile) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const data = {
      profile: {
        childID: existingProfile.user_id || null,
        childDob: existingProfile.dob || null,
        childName: existingProfile.name || null,
        childAddress: existingProfile.address || null,
        childGender: existingProfile.gender || null,
        observerID: existingProfile.observer_id || null,
        organisationId: existingProfile.organisation_id || null,
        surveyDate: existingProfile.survey_date || null,
        surveyNote: existingProfile.survey_note || null,
        surveyStatus: existingProfile.survey_status || null,
        surveyAttempt: existingProfile.survey_attempt || null,
        dateJoined: existingProfile.date_joined || null,
      },
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
