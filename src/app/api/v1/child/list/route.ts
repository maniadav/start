import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { TokenUtilsError } from "@utils/token.utils";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import ChildProfileModel from "@models/child.model";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const organisationIdParam = url.searchParams.get("organisation_id");

    await connectDB();

    const authHeader = request.headers.get("authorization");
    const { role, user_id } = await ProfileUtils.verifyProfile(
      authHeader || "",
      ["admin", "organisation", "observer"]
    );

    let query: any = {};
    if (role === "organisation") {
      query = { organisation_id: user_id };
    }
    if (organisationIdParam) {
      query.organisation_id = organisationIdParam;
    }
    if (role === "observer") {
      query.observer_id = user_id;
    }

    const childProfile = await ChildProfileModel.find(query)
      .sort({ joined_on: -1 })
      .lean();

    const data: any[] = childProfile.map((profile: any) => ({
      child_id: profile.user_id || null,
      child_name: profile.name || null,
      child_address: profile.address || null,
      survey_date: profile.survey_date || null,
      survey_note: profile.survey_note || null,
      survey_status: profile.survey_status || null,
      joined_on: profile.joined_on || null,
      organisation_id: profile.organisation_id || null,
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
