import jwt from "jsonwebtoken";

// Custom error classes for better error handling
export class TokenUtilsError extends Error {
  constructor(message = "Token missing required fields") {
    super(message);
    this.name = "TokenUtilsError";
  }
}

/**
 * Token utility class for generating and verifying JWT tokens.
 */
export class TokenUtils {
  private static readonly JWT_SECRET = "no@secretkey123@userstart";

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
        throw new TokenUtilsError("Token is required for verification");
      }
      console.log("Verifying token:");
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;

      if (decoded.type !== type)
        throw new TokenUtilsError(`Not a valid token type`);

      const { role, email } = decoded;
      if (!role || !email) {
        throw new TokenUtilsError("missing token credentials");
      }
      return { role, email };
    } catch (err) {
      throw new TokenUtilsError(`Invalid or expired ${type} token`);
    }
  }
}
