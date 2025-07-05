import { NextResponse } from "next/server";
import { files } from "@data/start.data";

export async function GET() {
  return NextResponse.json(files);
}
