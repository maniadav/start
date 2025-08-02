import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import OrganisationProfileModel from "@models/organisation.profile.model";
import { TokenUtils, TokenUtilsError } from "@utils/token.utils";
import AdminProfileModel from "@models/admin.profle.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";

export async function GET(request: Request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { user_id } = await ProfileUtils.verifyProfile(authHeader || "", [
      "admin",
      "organisation",
    ]);

    if (!user_id) {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      );
    }

    const organisationProfiles = await OrganisationProfileModel.find({})
      .sort({ joined_on: -1 })
      .lean();

    const data: any[] = organisationProfiles.map((profile: any) => ({
      user_id: profile.user_id || null,
      name: profile.name || null,
      email: profile.email || null,
      address: profile.address || null,
      status: profile.status || null,
      joined_on: profile.joined_on || null,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (error instanceof TokenUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof ProfileUtilsError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch organisation profiles" },
      { status: 500 }
    );
  }
}
