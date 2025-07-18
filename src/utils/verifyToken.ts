import jwt from "jsonwebtoken";

/**
 * Verifies a JWT token and extracts role, userID, secretekey.
 * @param token JWT token string
 * @returns { role, userID, secretekey }
 * @throws Error if token is invalid
 */
export async function verifyToken(token: string): Promise<{ role: string; userID: string; secretekey: string }> {
  try {
    // Replace 'your-secret-key' with your actual secret or use env variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
    const { role, userID, secretekey } = decoded;
    if (!role || !userID || !secretekey) {
      throw new Error("Token missing required fields");
    }
    return { role, userID, secretekey };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
