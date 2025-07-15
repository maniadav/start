import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import { OrganisationProfile } from "@models/OrganisationProfile";
import "@models/User";

export async function GET() {
  try {
    await connectDB();

    const organisationProfiles = await OrganisationProfile.find({})
      .sort({ joined_on: -1 })
      .lean();

    const cleanedProfiles: any[] = organisationProfiles.map((profile: any) => ({
      user_id: profile.user_id || null,
      name: profile.name || null,
      email: profile.email || null,
      address: profile.address || null,
      status: profile.status || null,
      joined_on: profile.joined_on || null,
    }));

    return NextResponse.json(cleanedProfiles);
  } catch (error) {
    console.error("Error fetching organisation profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch organisation profiles" },
      { status: 500 }
    );
  }
}
