import { NextResponse } from "next/server";
import TokenUtils, { TokenUtilsError } from "@utils/token.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

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
  } catch (error) {
    return handleApiError(error);
  }
}
