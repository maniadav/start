import { AppConfig } from "../config/app.config";

export interface VerificationEmailRequest {
  email: string;
  role: string;
  action: "organisation_creation" | "observer_creation" | "user_verification";
  organisationName?: string;
  observerName?: string;
  adminName?: string;
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
  const verificationUrl = `${baseUrl}/api/v1/auth/verify?token=${verificationToken}`;

  switch (data.action) {
    case "organisation_creation":
      return {
        subject: "Verify Your Organisation Account - START Project",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Welcome to START Project!</h1>
              <p style="color: #666; font-size: 16px;">Your organisation account has been created by ${
                data.adminName || "an administrator"
              }</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin-bottom: 15px;">Account Details</h2>
              <p style="color: #555; margin-bottom: 8px;"><strong>Email:</strong> ${
                data.email
              }</p>
              <p style="color: #555; margin-bottom: 8px;"><strong>Role:</strong> ${
                data.role
              }</p>
              ${
                data.organisationName
                  ? `<p style="color: #555; margin-bottom: 8px;"><strong>Organisation:</strong> ${data.organisationName}</p>`
                  : ""
              }
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

Your organisation account has been created by ${
          data.adminName || "an administrator"
        }.

Account Details:
- Email: ${data.email}
- Role: ${data.role}
${data.organisationName ? `- Organisation: ${data.organisationName}` : ""}

Please verify your account by clicking the following link:
${verificationUrl}

Important: This verification link will expire in 24 hours.

If you didn't request this account or have any questions, please contact our support team.
        `,
      };

    case "observer_creation":
      return {
        subject: "Verify Your Observer Account - START Project",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Welcome to START Project!</h1>
              <p style="color: #666; font-size: 16px;">Your observer account has been created by ${
                data.organisationName || "an organisation"
              }</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin-bottom: 15px;">Account Details</h2>
              <p style="color: #555; margin-bottom: 8px;"><strong>Email:</strong> ${
                data.email
              }</p>
              <p style="color: #555; margin-bottom: 8px;"><strong>Role:</strong> ${
                data.role
              }</p>
              ${
                data.observerName
                  ? `<p style="color: #555; margin-bottom: 8px;"><strong>Observer Name:</strong> ${data.observerName}</p>`
                  : ""
              }
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

Your observer account has been created by ${
          data.organisationName || "an organisation"
        }.

Account Details:
- Email: ${data.email}
- Role: ${data.role}
${data.observerName ? `- Observer Name: ${data.observerName}` : ""}

Please verify your account by clicking the following link:
${verificationUrl}

Important: This verification link will expire in 24 hours.

If you didn't request this account or have any questions, please contact our support team.
        `,
      };

    case "user_verification":
    default:
      return {
        subject: "Verify Your Account - START Project",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Welcome to START Project!</h1>
              <p style="color: #666; font-size: 16px;">Please verify your account to get started</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #333; margin-bottom: 15px;">Account Details</h2>
              <p style="color: #555; margin-bottom: 8px;"><strong>Email:</strong> ${data.email}</p>
              <p style="color: #555; margin-bottom: 8px;"><strong>Role:</strong> ${data.role}</p>
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

        Please verify your account to get started.

        Account Details:
        - Email: ${data.email}
        - Role: ${data.role}

        Please verify your account by clicking the following link:
        ${verificationUrl}

        Important: This verification link will expire in 24 hours.

        If you didn't request this account or have any questions, please contact our support team.
        `,
      };
  }
}
