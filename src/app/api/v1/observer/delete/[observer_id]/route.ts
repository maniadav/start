import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import UserModel from "@models/user.model";
import { ProfileUtils } from "@utils/profile.utils";
import ObserverProfileModel from "@models/observer.profile.model";

/**
 * Deletes an observer and associated data
 *
 * @param request - The incoming request object
 * @param params - URL parameters containing user_id
 * @returns NextResponse with appropriate status and message
 */
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
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");

    const { role, user_id } = await ProfileUtils.verifyProfile(authHeader, [
      "organisation",
      "admin",
    ]);

    let query = {};

    if (role === "admin") {
      query = { user_id: observer_id };
    } else if (role === "organisation") {
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
      _id: user_id,
    });

    if (!existingOrgUser) {
      // Observer profile was deleted but user record wasn't found
      // This indicates data inconsistency but we can still return partial success
      return NextResponse.json(
        {
          message:
            "Observer profile deleted but user account not found. Data may be inconsistent.",
          partialSuccess: true,
        },
        { status: 207 } // Multi-Status response
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
    console.error("Error deleting observer:", error);

    // Provide more specific error information in development
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Failed to delete observer: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        : "Failed to delete observer";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
