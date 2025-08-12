import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import ChildModel from "@models/child.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { TokenUtilsError } from "@utils/token.utils";

export async function GET(
  request: Request,
  { params }: { params: { child_id: string } }
) {
  try {
    await connectDB();

    const { child_id } = params;

    console.log("Fetching child with ID:", child_id);
    if (!child_id) {
      return NextResponse.json(
        { message: "Child ID is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id, role } = await ProfileUtils.verifyProfile(
      authHeader || "",
      ["admin", "observer"]
    );

    console.log("user_id:", user_id);
    // Create a query that filters by observer_id only if role is not admin
    const query = {
      user_id: child_id,
    };

    console.log("Querying ChildModel with:", query);

    const existingProfile = await ChildModel.findOne(query);

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Child not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const data = {
      childId: existingProfile.user_id || null,
      childDob: existingProfile.dob || null,
      childName: existingProfile.name || null,
      childAddress: existingProfile.address || null,
      childGender: existingProfile.gender || null,
      observerId: existingProfile.observer_id || null,
      organisationId: existingProfile.organisation_id || null,
      surveyDate: existingProfile.survey_date || null,
      surveyNote: existingProfile.survey_note || null,
      surveyStatus: existingProfile.survey_status || null,
      surveyAttempt: existingProfile.survey_attempt || null,
      dateJoined: existingProfile.date_joined || null,
    };

    return NextResponse.json(
      { message: "Child profile fetched successfully", data },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    console.error("Error fetching child:", error);

    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      throw error;
    }

    return NextResponse.json(
      { message: "Failed to fetch child" },
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
