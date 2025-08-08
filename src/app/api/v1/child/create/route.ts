import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import ChildProfileModel from "@models/child.model";
import ObserverProfileModel from "@models/observer.profile.model";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { childID, childName, childAddress, childGender, childDOB } = body;

    // Validate required fieldsi
    if (!childID || !childName || !childGender) {
      return NextResponse.json(
        { error: "Child ID, Name and Gender are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "observer",
    ]);

    const observerProfile = await ObserverProfileModel.findOne({
      user_id: user_id,
    });

    if (!observerProfile) {
      return NextResponse.json(
        { error: "Observer profile not found" },
        { status: 404 }
      );
    }

    const newUser = new ChildProfileModel({
      name: childName.trim(),
      address: childAddress?.trim() || "",
      gender: childGender,
      dob: childDOB,
      user_id: childID.trim(),
      observer_id: observerProfile._id,
      organisation_id: observerProfile.organisation_id,
      survey_note: "",
      date_joined: new Date(),
      survey_attempt: 0,
      survey_status: "pending",
    });

    const child = await newUser.save();

    return NextResponse.json(
      {
        message: "Profile created successfully",
        profile: {
          childID: child.user_id || null,
          childDOB: child.dob || null,
          childName: child.name || null,
          childAddress: child.address || null,
          childGender: child.gender || null,
          observerID: child.observer_id || null,
          organisationID: child.organisation_id || null,
          surveyDate: child.survey_date || null,
          surveyNote: child.survey_note || null,
          surveyStatus: child.survey_status || null,
          surveyAttempt: child.survey_attempt || null,
          dateJoined: child.date_joined || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[child/create] Error creating child profile:", error);
    if (error instanceof TokenUtilsError) {
      throw error;
    }

    if (error instanceof ProfileUtilsError) {
      throw error;
    }

    return NextResponse.json(
      { error: "Failed to create child" },
      { status: 500 }
    );
  }
}
