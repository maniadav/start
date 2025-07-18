import { NextRequest } from "next/server";
import { verifyToken } from "@utils/token.utils";

/**
 * Middleware to extract Bearer token from Authorization header and verify it.
 * Returns the decoded token data (role, userID, secretekey) or throws error if invalid.
 */
export async function authVerifier(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new Error("Token not found in Authorization header");
  }
  // verifyToken should return { role, userID, secretekey } or throw error
  const decoded = await verifyToken(token);
  return decoded;
}
