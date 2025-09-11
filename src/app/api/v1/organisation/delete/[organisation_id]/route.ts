import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import "@models/user.model"; // Import User model to register it with Mongoose
import { ProfileUtils } from "@utils/profile.utils";
import UserModel from "@models/user.model";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

export async function DELETE(
  request: Request,
  { params }: { params: { organisation_id: string } }
) {
  try {
    await connectDB();

    const { organisation_id } = params;

    // Validate required fields
    if (!organisation_id) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const authHeader = request.headers.get("authorization");
    const { role } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
    ]);

    const existingOrgUser = await UserModel.findOneAndDelete({
      _id: organisation_id,
    });

    if (!existingOrgUser) {
      return NextResponse.json(
        { error: "Organisation User not found in User" },
        { status: 404 }
      );
    }

    const existingOrgProfile = await OrganisationProfileModel.findOneAndDelete({
      user_id: organisation_id,
    });

    if (!existingOrgProfile) {
      return NextResponse.json(
        { error: "Organisation User not found in User" },
        { status: 404 }
      );
    }
    // Delete associated observers and files and child?
    // const observer = await ObserverProfileModel.findAllAndDelete({
    //   organisation_id: existingOrgProfile._id,
    // });

    return NextResponse.json(
      {
        message:
          "Organisation & its respective observers are deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
