import { NextResponse } from "next/server";
import { surveys } from "@data/start.data";

export async function GET() {
  return NextResponse.json(surveys);
}
