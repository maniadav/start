import { HttpStatusCode } from "enums/HttpStatusCode";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import AppConfig from "config/app.config";
// Custom error classes for better error handling
class TokenUtilsError extends Error {
  public statusCode: number;
  constructor(
    message = "Token error",
    statusCode: number = HttpStatusCode.Forbidden
  ) {
    super(message);
    this.name = "TokenUtilsError";
    this.statusCode = statusCode;
  }
}

/**
 * Token utility class for generating and verifying JWT tokens.
 */
class TokenUtils {
  private static readonly JWT_SECRET: Secret = AppConfig.JWT_SECRET; // Use Secret for type safety

  static generateToken(
    details: { role: string; email: string },
    type: "access" | "refresh" | "reset" | "activation"
  ): string {
    let expire_in: StringValue; // Define expire_in type to StringValue or string
    switch (type) {
      case "access":
      case "activation":
        expire_in = "24h";
        break;
      case "refresh":
        expire_in = "30d";
        break;
      case "reset":
        expire_in = "1h";
        break;
      default:
        expire_in = "1h";
    }
    return jwt.sign({ ...details, type }, this.JWT_SECRET, {
      expiresIn: expire_in,
    });
  }

  static async verifyToken(
    tokenOrHeader: string | undefined | null,
    type: "access" | "refresh" | "reset" | "activation"
  ): Promise<{ role: string; email: string }> {
    try {
      // For bearer token format
      const token =
        type === "access" || type === "refresh"
          ? tokenOrHeader?.split(" ")[1]
          : tokenOrHeader;

      if (!token) {
        throw new TokenUtilsError(
          "Token is required for verification",
          HttpStatusCode.Unauthorized
        );
      }
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: false,
      }) as JwtPayload & {
        role: string;
        email: string;
        type: "access" | "refresh" | "reset" | "activation";
      }; // Use JwtPayload and extend with custom payload

      if (decoded.type !== type) {
        throw new TokenUtilsError(
          `Not a valid token type`,
          HttpStatusCode.Forbidden
        );
      }

      const { role, email } = decoded;
      if (!role || !email) {
        throw new TokenUtilsError(
          "Token missing required credentials",
          HttpStatusCode.Forbidden
        );
      }
      return { role, email };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // If access token expired, send HttpStatusCode.Unauthorized
        if (type === "access") {
          throw new TokenUtilsError(
            `Expired access token`,
            HttpStatusCode.Forbidden
          );
        }
        // If refresh token expired, send HttpStatusCode.Forbidden
        if (type === "refresh") {
          throw new TokenUtilsError(
            `Expired refresh token`,
            HttpStatusCode.Unauthorized
          );
        }
      }
      if (err instanceof jwt.JsonWebTokenError) {
        // For refresh tokens, return UNA on invalid token
        if (type === "refresh") {
          throw new TokenUtilsError(
            `Invalid refresh token: ${err.message}`,
            HttpStatusCode.Unauthorized
          );
        }
        // For other token types, return Unauthorized
        throw new TokenUtilsError(
          `Invalid ${type} token: ${err.message}`,
          HttpStatusCode.Forbidden
        );
      }
      throw new TokenUtilsError(
        `Token verification failed`,
        HttpStatusCode.Forbidden
      );
    }
  }
}

export default TokenUtils;
export { TokenUtilsError };
