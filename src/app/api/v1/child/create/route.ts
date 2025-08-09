import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import ChildProfileModel from "@models/child.model";
import ObserverProfileModel from "@models/observer.profile.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
  let session = null;

  try {
    await connectDB();

    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { childID, childName, childAddress, childGender, childDOB } = body;

    // validation with specific error messages
    const validationErrors = [];
    if (!childID || typeof childID !== "string" || !childID.trim()) {
      validationErrors.push(
        "Child ID is required and must be a non-empty string"
      );
    }
    if (!childName || typeof childName !== "string" || !childName.trim()) {
      validationErrors.push(
        "Child name is required and must be a non-empty string"
      );
    }
    if (
      !childGender ||
      !["male", "female", "other"].includes(childGender.toLowerCase())
    ) {
      validationErrors.push(
        "Child gender is required and must be one of: male, female, other"
      );
    }
    if (childDOB && isNaN(new Date(childDOB).getTime())) {
      validationErrors.push("Child date of birth must be a valid date format");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Authenticate and verify observer
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    const { user_id } = await ProfileUtils.verifyProfile(authHeader, [
      "observer",
    ]);

    // Check if child ID already exists
    const existingChild = await ChildProfileModel.findOne({
      user_id: childID.trim(),
    });

    if (existingChild) {
      return NextResponse.json(
        { error: "Child ID already exists" },
        { status: 409 }
      );
    }

    const observerProfile = await ObserverProfileModel.findOne({
      user_id: user_id,
    });

    if (!observerProfile) {
      return NextResponse.json(
        { error: "Observer profile not found" },
        { status: 404 }
      );
    }

    // Start a session for transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const newUser = new ChildProfileModel({
      name: childName.trim(),
      address: childAddress?.trim() || "",
      gender: childGender.toLowerCase(),
      dob: childDOB ? new Date(childDOB) : null,
      user_id: childID.trim(),
      observer_id: observerProfile._id,
      organisation_id: observerProfile.organisation_id,
      survey_note: "",
      date_joined: new Date(),
      survey_attempt: 0,
      survey_status: "pending",
    });

    const child = await newUser.save();

    // Log success
    console.log(
      `[child/create] Child profile created successfully: ${child.user_id}`
    );

    return NextResponse.json(
      {
        message: "Profile created successfully",
        profile: {
          id: child._id.toString(),
          childID: child.user_id,
          childDOB: child.dob,
          childName: child.name,
          childAddress: child.address,
          childGender: child.gender,
          observerID: child.observer_id.toString(),
          organisationId: child.organisation_id.toString(),
          surveyDate: child.survey_date,
          surveyNote: child.survey_note,
          surveyStatus: child.survey_status,
          surveyAttempt: child.survey_attempt,
          dateJoined: child.date_joined,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {

    console.error(
      "[child/create] Error creating child profile:",
      error.statusCode || 500,
      error.message || error
    );

    if (error instanceof TokenUtilsError) {
      return NextResponse.json(
        { error: "Authentication error", message: error.message },
        { status: error.statusCode || 401 }
      );
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json(
        { error: "Profile error", message: error.message },
        { status: error.statusCode || 400 }
      );
    }

    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Failed to create child profile",
        requestId: Date.now().toString(36),
      },
      { status: 500 }
    );
  }
}
