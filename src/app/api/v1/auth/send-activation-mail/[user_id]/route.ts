import { NextRequest, NextResponse } from "next/server";
import connectDB from "@lib/mongodb";
import UserModel from "@models/user.model";
import ObserverProfileModel from "@models/observer.profile.model";
import OrganisationProfileModel from "@models/organisation.profile.model";
import TokenModel from "@models/token.model";
import { ProfileUtils } from "@utils/profile.utils";
import { createAndSendVerificationEmail } from "@utils/backend.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";
import { handleApiError } from "@utils/errorHandler";

/**
 * POST /api/v1/auth/send-activation-mail/[user_id]
 * Send verification email to user with role-based access control
 * - Admin can send for observer and organisation
 * - Organisation can send for observer
 * - Only sends for pending status profiles
 */

export async function POST(
  request: NextRequest,
  { params }: { params: { user_id: string } }
) {
  try {
    await connectDB();

    // 1. Get token from header
    const authHeader = request.headers.get("authorization");

    // 2. Verify token - allow only admin and organisation
    const { user_id: requesterUserId, role: requesterRole } =
      await ProfileUtils.verifyProfile(authHeader || "", [
        "admin",
        "organisation",
      ]);

    // 3. Use user_id from param as route changed
    const targetUserId = params.user_id;

    // 4. Find user again for given param, get email from user model and role as well
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: HttpStatusCode.NotFound }
      );
    }

    // Check permissions based on requester role
    if (
      requesterRole === "organisation" &&
      targetUser.role === "organisation"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organisations cannot send activation emails to other organisations",
        },
        { status: HttpStatusCode.Forbidden }
      );
    }

    // Find the profile and check status
    let profile;
    let organisationName;

    if (targetUser.role === "observer") {
      profile = await ObserverProfileModel.findOne({
        user_id: targetUser._id,
      });

      if (!profile) {
        return NextResponse.json(
          {
            success: false,
            message: "Observer profile not found",
          },
          { status: HttpStatusCode.NotFound }
        );
      }

      // Check if requester is organisation and has permission for this observer
      if (requesterRole === "organisation") {
        if (profile.organisation_id.toString() !== requesterUserId) {
          return NextResponse.json(
            {
              success: false,
              message:
                "You can only send activation emails to observers in your organisation",
            },
            { status: HttpStatusCode.Forbidden }
          );
        }
      }

      // Get organisation name for email
      const organisationProfile = await OrganisationProfileModel.findOne({
        user_id: profile.organisation_id,
      });
      organisationName = organisationProfile?.name || "Organisation";
    } else if (targetUser.role === "organisation") {
      profile = await OrganisationProfileModel.findOne({
        user_id: targetUser._id,
      });

      if (!profile) {
        return NextResponse.json(
          {
            success: false,
            message: "Organisation profile not found",
          },
          { status: HttpStatusCode.NotFound }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid user role: ${targetUser.role}. Only observers and organisations can receive activation emails.`,
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Check if profile status is pending
    if (profile.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: `Profile status is '${profile.status}'. Only pending profiles can receive activation emails.`,
        },
        { status: HttpStatusCode.BadRequest }
      );
    }

    // Revoke any existing activation tokens for this user
    await TokenModel.updateMany(
      {
        userId: targetUser._id,
        type: "activation",
        revoked: false,
      },
      {
        revoked: true,
      }
    );

    // Send verification email using unified function
    const emailResult = await createAndSendVerificationEmail({
      user: {
        _id: targetUser._id,
        email: targetUser.email,
      },
      profile: {
        name: profile.name,
        role: targetUser.role as "observer" | "organisation",
      },
      organisationName,
    });

    if (!emailResult.verificationEmailSent) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
          error: emailResult.error,
        },
        { status: HttpStatusCode.InternalServerError }
      );
    }

    console.log(
      `Verification email sent successfully to ${targetUser.email} for ${targetUser.role} by ${requesterRole}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Verification email sent successfully",
        data: {
          email: targetUser.email,
          role: targetUser.role,
          profileName: profile.name,
          tokenExpiry: "24 hours",
          sentBy: requesterRole,
        },
      },
      { status: HttpStatusCode.Ok }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/v1/auth/send-activation-mail/[user_id]
 * Health check for activation email service
 */
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Activation email service is running",
      endpoints: {
        POST: "Send activation email to specific user by user_id with role-based access control",
        GET: "Health check",
      },
      permissions: {
        admin: "Can send activation emails to observers and organisations",
        organisation:
          "Can send activation emails to observers in their organisation",
      },
      usage: {
        method: "POST",
        url: "/api/v1/auth/send-activation-mail/[user_id]",
        description:
          "Send activation email to user specified by user_id parameter",
        headers: {
          authorization: "Bearer token (admin or organisation role required)",
        },
      },
    },
    { status: HttpStatusCode.Ok }
  );
}
