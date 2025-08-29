import nodemailer from "nodemailer";
import { google } from "googleapis";
import { error } from "console";
import { AppConfig } from "../config/app.config";

const smtp_client_id: string = AppConfig.GMAIL.SMTP_CLIENT_ID;
const smtp_client_secret: string = AppConfig.GMAIL.SMTP_CLIENT_SECRET;
const smtp_redirect_url: string = AppConfig.GMAIL.SMTP_REDIRECT_URL;
const smtp_refresh_token: string = AppConfig.GMAIL.SMTP_REFRESH_TOKEN;
const EMAIL_ID = AppConfig.GMAIL.EMAIL_ID;

const oauth2Client = new google.auth.OAuth2(
  smtp_client_id,
  smtp_client_secret,
  smtp_redirect_url
);

oauth2Client.setCredentials({ refresh_token: smtp_refresh_token });

interface EmailOptions {
  fromEmail: string;
  toEmail: string;
  subject: string;
  textContent?: string;
  htmlContent?: string;
}

// Send email function
export async function sendGmail(options: EmailOptions) {
  const { toEmail, fromEmail, subject, textContent, htmlContent } = options;
  // console.log({ toEmail, subject, textContent, htmlContent, fromEmail })
  try {
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw error("couldn't get an access token");
    }

    let node_mailer = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: EMAIL_ID,
        clientId: smtp_client_id,
        clientSecret: smtp_client_secret,
        refreshToken: smtp_refresh_token,
        accessToken: `${accessToken.token}`,
        expires: 1484314697598,
      },
    });

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const result = await node_mailer.sendMail(mailOptions);
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
