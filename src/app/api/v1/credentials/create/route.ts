import { NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import CredentialModel from "@models/credential.model";
import { ProfileUtils, ProfileUtilsError } from "@utils/profile.utils";
import { TokenUtilsError } from "@utils/token.utils";
import { PasswordUtils } from "@utils/password.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { sendGmail } from "@utils/gmail.utils";
import { generateVerificationEmailTemplate } from "@utils/email-templates.utils";
import TokenUtils from "@utils/token.utils";
import { AppConfig } from "../../../../../config/app.config";
import { handleApiError } from "@utils/errorHandler";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      organisation_id,
      aws_access_key,
      aws_secret_access_key,
      aws_bucket_name,
      aws_bucket_region,
    } = body;

    // Validate required fields
    if (
      !organisation_id ||
      !aws_access_key ||
      !aws_secret_access_key ||
      !aws_bucket_name ||
      !aws_bucket_region
    ) {
      return NextResponse.json(
        { error: "All AWS credential fields are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Save credentials for the organisation
    const credential = new CredentialModel({
      organisation_id,
      aws_access_key,
      aws_secret_access_key,
      aws_bucket_name,
      aws_bucket_region,
      date_created: new Date(),
    });
    await credential.save();
    return NextResponse.json(
      { message: "AWS credentials saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
