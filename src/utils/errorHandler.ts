import { NextResponse } from "next/server";
import { TokenUtilsError } from "./token.utils";
import { ProfileUtilsError } from "./profile.utils";
import { HttpStatusCode } from "enums/HttpStatusCode";

/**
 * Global API Error Handler
 *
 * This utility provides consistent error handling across all API routes.
 * It automatically converts custom error classes to proper HTTP responses
 * with appropriate status codes and error structures.
 *
 * Usage:
 * ```typescript
 * try {
 *   // ... your API logic
 * } catch (error) {
 *   return handleApiError(error);
 * }
 * ```
 */
export function handleApiError(error: unknown): NextResponse {
  // Log the error for debugging (in production, you might want to use a proper logger)
  console.error("API Error caught:", {
    name: error instanceof Error ? error.name : "Unknown",
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : "No stack trace",
    timestamp: new Date().toISOString(),
  });

  // Handle TokenUtilsError (authentication/authorization issues)
  if (error instanceof TokenUtilsError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOKEN_ERROR",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle ProfileUtilsError (profile verification issues)
  if (error instanceof ProfileUtilsError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AUTHENTICATION_ERROR",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors (you can extend this pattern)
  if (error instanceof Error && error.name === "ValidationError") {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatusCode.BadRequest }
    );
  }

  // Handle database connection errors
  if (error instanceof Error && error.message.includes("MongoNetworkError")) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_CONNECTION_ERROR",
          message: "Database connection failed. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatusCode.ServiceUnavailable }
    );
  }

  // Handle S3/AWS errors
  if (error instanceof Error && error.message.includes("S3")) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "STORAGE_ERROR",
          message:
            "File storage service temporarily unavailable. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      },
      { status: HttpStatusCode.ServiceUnavailable }
    );
  }

  // Default case: unknown or unexpected errors
  // In production, you might want to hide internal error details
  const isDevelopment = process.env.NODE_ENV === "development";

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: isDevelopment
          ? error instanceof Error
            ? error.message
            : "An unexpected error occurred"
          : "Something went wrong. Please try again later.",
        ...(isDevelopment && {
          details:
            error instanceof Error
              ? error.stack
              : "No additional details available",
        }),
        timestamp: new Date().toISOString(),
      },
    },
    { status: HttpStatusCode.InternalServerError }
  );
}

/**
 * Type-safe error response interface
 * Use this to ensure consistent error structure across your API
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
    details?: string;
  };
}

/**
 * Type-safe success response interface
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
  timestamp: string;
}

/**
 * Helper to create consistent success responses
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = HttpStatusCode.Ok,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message: message || "Operation completed successfully",
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Helper to create consistent error responses for known error types
 */
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = HttpStatusCode.BadRequest
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    },
    { status: statusCode }
  );
}
