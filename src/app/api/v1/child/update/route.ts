import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import ChildProfileModel from "@models/child.model";
import ObserverProfileModel from "@models/observer.profile.model";
import mongoose from "mongoose";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

export async function PATCH(
  request: Request,
  { params }: { params: { childId: string } }
) {
  let session = null;
  try {
    await connectDB();

    const { childId } = params;

    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const { childName, childAddress, childGender, childDob } = body;

    // Validation
    const validationErrors = [];

    if (
      childGender &&
      !["male", "female", "other"].includes(childGender.toLowerCase())
    ) {
      validationErrors.push("Child gender must be one of: male, female, other");
    }
    if (childDob && isNaN(new Date(childDob).getTime())) {
      validationErrors.push("Child date of birth must be a valid date format");
    }
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Authenticate observer
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const { user_id } = await ProfileUtils.verifyProfile(authHeader, [
      "observer",
    ]);

    const observerProfile = await ObserverProfileModel.findOne({ user_id });
    if (!observerProfile) {
      return NextResponse.json(
        { error: "Observer profile not found" },
        { status: 404 }
      );
    }

    // Find the child and ensure the observer owns it
    const existingChild = await ChildProfileModel.findOne({
      user_id: childId.trim(),
      observer_id: observerProfile.user_id,
    });

    if (!existingChild) {
      return NextResponse.json(
        { error: "Child profile not found" },
        { status: 404 }
      );
    }

    // Start session
    session = await mongoose.startSession();
    session.startTransaction();

    // Build update object
    const updateData: any = {};
    if (childName) updateData.name = childName.trim();
    if (childAddress) updateData.address = childAddress.trim();
    if (childGender) updateData.gender = childGender.toLowerCase();
    if (childDob) updateData.dob = new Date(childDob);

    const updatedChild = await ChildProfileModel.findOneAndUpdate(
      { _id: existingChild._id },
      { $set: updateData },
      { new: true, session }
    );

    await session.commitTransaction();

    console.log(
      `[child/update] Child profile updated: ${updatedChild?.user_id}`
    );

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: {
          id: updatedChild._id.toString(),
          childId: updatedChild.user_id,
          childDob: updatedChild.dob,
          childName: updatedChild.name,
          childAddress: updatedChild.address,
          childGender: updatedChild.gender,
          observerId: updatedChild.observer_id.toString(),
          organisationId: updatedChild.organisation_id.toString(),
          surveyDate: updatedChild.survey_date,
          surveyNote: updatedChild.survey_note,
          surveyStatus: updatedChild.survey_status,
          surveyAttempt: updatedChild.survey_attempt,
          dateJoined: updatedChild.date_joined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  } finally {
    if (session) session.endSession();
  }
}
