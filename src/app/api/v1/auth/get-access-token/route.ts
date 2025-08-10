import { NextResponse } from "next/server";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const refreshHeader =
      request.headers.get("authorization") || body.refreshToken;
    if (!refreshHeader) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Verify refresh token
    const { role, email } = await TokenUtils.verifyToken(
      refreshHeader,
      "refresh"
    );

    // Generate new access token
    const accessToken = TokenUtils.generateToken({ role, email }, "access");

    return NextResponse.json({ accessToken }, { status: 200 });
  } catch (err) {
    if (err instanceof TokenUtilsError) {
      throw err;
    }
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
