import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import { ProfileUtils } from "@utils/profile.utils";
import ObserverProfileModel from "@models/observer.profile.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";
import { MemberProfile } from "@constants/management.constant";
import { MemberRole } from "@type/member.types";

export async function DELETE(
  request: Request,
  { params }: { params: { observer_id: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { observer_id } = params;

    // Validate required fields
    if (!observer_id || observer_id.trim() === "") {
      return NextResponse.json(
        { error: "Observer ID is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");

    const { role, user_id } = await ProfileUtils.verifyProfile(authHeader, [
      MemberProfile.organisation as MemberRole,
      MemberProfile.admin as MemberRole,
    ]);

    let query = {};

    if (role === MemberProfile.admin) {
      query = { user_id: observer_id };
    } else if (role === MemberProfile.organisation) {
      query = { user_id: observer_id, organisation_id: user_id };
    } else {
      return NextResponse.json(
        { error: "Invalid role for this operation" },
        { status: 403 }
      );
    }

    // Delete observer profile
    const existingOrgProfile = await ObserverProfileModel.findOneAndDelete(
      query
    );

    if (!existingOrgProfile) {
      return NextResponse.json(
        {
          error:
            "Observer Profile not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Delete the user account associated with this observer
    const existingOrgUser = await UserModel.findOneAndDelete({
      _id: observer_id,
    });

    if (!existingOrgUser) {
      return NextResponse.json(
        {
          message:
            "Observer profile deleted but user account not found. Data may be inconsistent.",
          partialSuccess: true,
        },
        { status: 207 }
      );
    }

    // TODO: Handle deletion of associated children data
    // If we need to delete child data associated with this observer,
    // we should implement that logic here.
    // Example:
    // await ChildModel.deleteMany({ observer_id: user_id });

    return NextResponse.json(
      {
        message: "Observer and associated data deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
