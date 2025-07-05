import { NextResponse } from 'next/server';

/**
 * Health check API endpoint
 * GET /api/health
 * Returns a simple health status response for monitoring system health
 */
export async function GET() {
  // Create response object with health status information
  const healthStatus = {
    status: 'ok',
    uptime: process.uptime(), // Server uptime in seconds
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  // Return health status with 200 OK status
  return NextResponse.json(healthStatus, { status: 200 });
}
