import { NextResponse } from "next/server";
import { observerProfiles } from "@data/start.data";

export async function GET() {
  return NextResponse.json(observerProfiles);
}
