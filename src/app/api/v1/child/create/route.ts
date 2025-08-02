import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import "@models/user.model";
import { ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtils, TokenUtilsError } from "@utils/token.utils";
import ChildProfileModel from "@models/child.model";
import ObserverProfileModel from "@models/observer.profile.model";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { child_id, child_name, child_address, child_gender } = body;

    // Validate required fields
    if (!child_id || !child_name || !child_gender) {
      return NextResponse.json(
        { error: "Child ID, Name and Gender are required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { email } = await TokenUtils.verifyToken(authHeader || "", "access");
    const observerProfile = await ObserverProfileModel.findOne({
      email: email,
    });

    if (!observerProfile) {
      return NextResponse.json(
        { error: "Observer profile not found" },
        { status: 404 }
      );
    }

    const newUser = new ChildProfileModel({
      name: child_name.trim(),
      address: child_address?.trim() || "",
      gender: child_gender,
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
          child_id: child._id,
          child_name: child.name,
          child_gender: child.gender,
          child_address: child.address,
          survey_status: child.survey_status,
          survey_attempt: child.survey_attempt,
          survey_note: child.survey_note || "",
          survey_date: child.survey_date,
          date_joined: child.date_joined,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating child:", error);

    if (error instanceof TokenUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to create child" },
      { status: 500 }
    );
  }
}
