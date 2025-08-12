import { NextResponse } from "next/server";

/**
 * Health check API endpoint
 *
 * This endpoint returns a simple health status and version information
 * for monitoring and verification purposes.
 *
 * @returns {NextResponse} JSON response with health status and version information
 */
export async function GET() {
  return NextResponse.json({
    status: 200,
    version: process.env.APP_VERSION || "0.0.0",
    timestamp: new Date().toISOString(),
    appname: process.env.APP_NAME || "START",
    environment: process.env.NEXT_PUBLIC_NODE_ENV || "development",
  });
}
