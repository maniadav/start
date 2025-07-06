import { NextResponse } from "next/server";
import { organisationProfiles } from "@data/start.data";

export async function GET() {
  return NextResponse.json(organisationProfiles);
}
