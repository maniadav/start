import TokenUtils from "./token.utils";
import TokenModel from "../models/token.model";
import UserModel from "../models/user.model";
import { sendGmail } from "./gmail.utils";
import { generateVerificationEmailTemplate } from "./email-templates.utils";
import { AppConfig } from "../config/app.config";

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

export interface CreateAndSendVerificationEmailParams {
  user: {
    _id: string;
    email: string;
  };
  profile: {
    name: string;
    role: "observer" | "organisation";
  };
  organisationName?: string;
}

export const createAndSendVerificationEmail = async ({
  user,
  profile,
  organisationName,
}: CreateAndSendVerificationEmailParams): Promise<{
  verificationEmailSent: boolean;
  error?: string;
}> => {
  try {
    // Generate and save verification token
    const verificationToken = await generateAndSaveToken(
      {
        role: profile.role,
        email: user.email,
      },
      "activation",
      user._id
    );

    // Generate email template
    const emailTemplate = generateVerificationEmailTemplate(
      {
        email: user.email,
        role: profile.role,
        name: profile.name,
        organisation: organisationName,
      },
      verificationToken
    );

    // Send verification email
    await sendGmail({
      fromEmail: AppConfig.GMAIL.EMAIL_ID,
      toEmail: user.email,
      subject: emailTemplate.subject,
      textContent: emailTemplate.textContent,
      htmlContent: emailTemplate.htmlContent,
    });

    console.log(
      `Verification email sent successfully to ${user.email} for ${profile.role} creation`
    );

    return { verificationEmailSent: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      verificationEmailSent: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
