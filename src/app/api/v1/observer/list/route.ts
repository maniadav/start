import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import ObserverProfileModel from "@models/observer.profile.model";

export async function GET(request: Request) {
  try {
    // Get query params at the top
    const url = new URL(request.url);
    const organisationIdParam = url.searchParams.get("organisation_id");
    const statusParam = url.searchParams.get("status");
    const joinedOnParam = url.searchParams.get("joined_on");

    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { role, user_id } = await ProfileUtils.verifyProfile(
      authHeader || "",
      ["admin", "organisation"]
    );

    let query: any = {};
    if (role === "organisation") {
      query = { organisation_id: user_id };
    }
    if (organisationIdParam) {
      query.organisation_id = organisationIdParam;
    }
    if (statusParam) {
      query.status = statusParam;
    }
    if (joinedOnParam) {
      query.joined_on = joinedOnParam;
    }

    const observerprofile = await ObserverProfileModel.find(query)
      .sort({ joined_on: -1 })
      .lean();

    const data: any[] = observerprofile.map((profile: any) => ({
      user_id: profile.user_id || null,
      name: profile.name || null,
      email: profile.email || null,
      address: profile.address || null,
      status: profile.status || null,
      joined_on: profile.joined_on || null,
      organisation_id: profile.organisation_id || null,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
      if (error instanceof TokenUtilsError) {
        throw error;
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
