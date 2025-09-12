import TokenUtils from "./token.utils";
import TokenModel from "../models/token.model";
import UserModel from "../models/user.model";

export const generateAndSaveToken = async (
  details: { role: string; email: string },
  type: "access" | "refresh" | "reset" | "activation",
  user_id: string
): Promise<string> => {
  // Generate the token
  const token: string = TokenUtils.generateToken(details, type);

  // Calculate expiration date based on token type
  let expiresAt: Date;
  const now = new Date();

  switch (type) {
    case "access":
    case "activation":
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      break;
    case "refresh":
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      break;
    case "reset":
      expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      break;
    default:
      expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
  }

  // Save token to database
  const tokenDoc = new TokenModel({
    userId: user_id,
    token: token, // Store the actual token (you might want to hash this for security)
    type: type === "refresh" ? "refresh" : "activation",
    expiresAt: expiresAt,
    revoked: false,
  });

  await tokenDoc.save();

  return token;
};
