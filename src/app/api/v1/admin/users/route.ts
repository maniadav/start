import { NextResponse } from "next/server";
import { users } from "@data/start.data";

export async function GET() {
  return NextResponse.json(users);
}
