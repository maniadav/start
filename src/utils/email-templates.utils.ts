import { PAGE_ROUTES } from "@constants/route.constant";
import { AppConfig } from "../config/app.config";

export interface VerificationEmailRequest {
  email: string;
  role: string;
  name: string;
  organisation?: string;
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * Generate email template based on verification type
 */
export function generateVerificationEmailTemplate(
  data: VerificationEmailRequest,
  verificationToken: string
): EmailTemplate {
  const baseUrl = AppConfig.SERVER.API_BASE_URL;
  const verificationUrl = `${baseUrl}${PAGE_ROUTES.AUTH.VERIFY_ACCOUNT.path}?token=${verificationToken}`;

  // Dynamic content based on role
  const isObserver = data.role.toLowerCase() === "observer";
  const accountType = isObserver ? "observer" : "organisation";
  const createdBy = isObserver
    ? data.organisation || "an organisation"
    : "an administrator";

  const nameText = `<p style="color: #555; margin-bottom: 8px;"><strong>${
    isObserver ? "Observer Name" : "Organisation Name"
  }:</strong> ${data.name}</p>`;

  const organisationText = data.organisation
    ? `<p style="color: #555; margin-bottom: 8px;"><strong>Organisation:</strong> ${data.organisation}</p>`
    : "";

  const additionalInfoText =
    isObserver && data.name
      ? `- Observer Name: ${data.name}`
      : data.organisation
      ? `- Organisation: ${data.organisation}`
      : "";

  return {
    subject: `Verify Your ${
      accountType.charAt(0).toUpperCase() + accountType.slice(1)
    } Account - START Project`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">Welcome to START Project!</h1>
          <p style="color: #666; font-size: 16px;">Your ${accountType} account has been created by ${createdBy}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #333; margin-bottom: 15px;">Account Details</h2>
          <p style="color: #555; margin-bottom: 8px;"><strong>Email:</strong> ${data.email}</p>
          <p style="color: #555; margin-bottom: 8px;"><strong>Role:</strong> ${data.role}</p>
          ${nameText}
          ${organisationText}
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <p style="color: #666; margin-bottom: 20px;">Please click the button below to verify your account:</p>
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Account</a>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your account within this time, you'll need to request a new verification email.
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this account or have any questions, please contact our support team.
          </p>
        </div>
      </div>
    `,
    textContent: `
      Welcome to START Project!

      Your ${accountType} account has been created by ${createdBy}.

      Account Details:
      - Email: ${data.email}
      - Role: ${data.role}
      ${additionalInfoText}

      Please verify your account by clicking the following link:
      ${verificationUrl}

      Important: This verification link will expire in 24 hours.

      If you didn't request this account or have any questions, please contact our support team.
    `,
  };
}
