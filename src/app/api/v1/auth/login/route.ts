import { NextResponse } from "next/server";
import {
  users,
  MemberProfile,
  adminProfiles,
  organisationProfiles,
  observerProfiles,
} from "@data/start.data";
import {
  AdminProfile,
  ObserverProfile,
  OrganisationProfile,
} from "@type/management.types";
import { MemberWithProfile, MemberWithProfileFE } from "@type/member.types";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { id, role } = user;
    console.log("User found:", id, role);
    let profile:
      | AdminProfile
      | OrganisationProfile
      | ObserverProfile
      | undefined;

    switch (role) {
      case MemberProfile.admin:
        profile = adminProfiles.find((p) => p.userId === id);
        break;
      case MemberProfile.organisation:
        profile = organisationProfiles.find((p) => p.userId === id);
        break;
      case MemberProfile.observer:
        profile = observerProfiles.find((p) => p.userId === id);
        break;
      default:
        profile = undefined;
    }

    function getPublicProfile(
      profile:
        | AdminProfile
        | OrganisationProfile
        | ObserverProfile
        | null
        | undefined,
      role: string
    ) {
      if (!profile || Object.keys(profile).length === 0) {
        return null;
      }
      switch (role) {
        case MemberProfile.admin:
          const { id, name, address, permissions, createdAt } =
            profile as AdminProfile;
          return { id, name, address, permissions, createdAt };
        case MemberProfile.organisation:
          const {
            id: orgId,
            name: orgName,
            organizationName,
            email,
            address: orgAddress,
            status,
            allowedStorage,
            createdAt: orgCreatedAt,
            contactPhone,
            website,
          } = profile as OrganisationProfile;
          return {
            id: orgId,
            name: orgName,
            organizationName,
            email,
            address: orgAddress,
            status,
            allowedStorage,
            createdAt: orgCreatedAt,
            contactPhone,
            website,
          };
        case MemberProfile.observer:
          const {
            id: obsId,
            name: obsName,
            email: obsEmail,
            address: obsAddress,
            status: obsStatus,
            organizationId,
            createdAt: obsCreatedAt,
            specialization,
            certifications,
          } = profile as ObserverProfile;
          return {
            id: obsId,
            name: obsName,
            email: obsEmail,
            address: obsAddress,
            status: obsStatus,
            organizationId,
            createdAt: obsCreatedAt,
            specialization,
            certifications,
          };
        default:
          return null;
      }
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const publicProfile = getPublicProfile(profile, role);
    if (!publicProfile) {
      return NextResponse.json(
        { error: "Profile data is missing or empty" },
        { status: 404 }
      );
    }
    const profileData: MemberWithProfileFE = {
      userId: id,
      email,
      role,
      profile: publicProfile,
    };
    return NextResponse.json({ data: profileData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
