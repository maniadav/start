import { NextResponse } from "next/server";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";

export async function POST(request: Request) {
  try {
    const refreshHeader = request.headers.get("authorization");
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
      return NextResponse.json(
        {
          error: err.message,
          code: err.name,
        },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
