import jwt from "jsonwebtoken";

// Custom error classes for better error handling
export class TokenUtilsError extends Error {
  public statusCode: number;
  constructor(message = "Token error", statusCode: number = 498) {
    super(message);
    this.name = "TokenUtilsError";
    this.statusCode = statusCode;
  }
}

/**
 * Token utility class for generating and verifying JWT tokens.
 */
export class TokenUtils {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "no@secretkey123@userstart";

  static generateToken(
    details: { role: string; email: string },
    type: "access" | "refresh"
  ): string {
    const expiresIn = type === "access" ? "24h" : "30d";
    return jwt.sign({ ...details, type }, this.JWT_SECRET, { expiresIn });
  }

  static async verifyToken(
    authHeader: string | undefined | null,
    type: "access" | "refresh"
  ): Promise<{ role: string; email: string }> {
    try {
      const token = authHeader?.split(" ")[1];
      if (!token) {
        throw new TokenUtilsError("Token is required for verification", 401);
      }
      console.log("Verifying token:");
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: false,
      }) as any;

      if (decoded.type !== type) {
        throw new TokenUtilsError(`Not a valid token type`, 401);
      }

      const { role, email } = decoded;
      if (!role || !email) {
        throw new TokenUtilsError("Token missing required credentials", 401);
      }
      return { role, email };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // If access token expired, send 498 to trigger refresh on frontend
        if (type === "access") {
          throw new TokenUtilsError(`Expired access token`, 498);
        }
        // If refresh token expired, send 401 (invalid)
        if (type === "refresh") {
          throw new TokenUtilsError(`Expired refresh token`, 401);
        }
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new TokenUtilsError(`Invalid ${type} token: ${err.message}`, 401);
      }
      throw new TokenUtilsError(`Token verification failed`, 401);
    }
  }
}
