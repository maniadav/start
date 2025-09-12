"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { ValidatorUtils } from "@helper/validator";
import { PAGE_ROUTES } from "@constants/route.constant";
import Image from "next/image";
import { Button } from "@components/button/button";

interface VerificationFormData {
  password: string;
  confirmPassword: string;
}

interface VerificationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default function AccountVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState<VerificationFormData>({
    password: "",
    confirmPassword: "",
  });

  const [state, setState] = useState<VerificationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const [passwordErrors, setPasswordErrors] = useState<{
    password: string | null;
    confirmPassword: string | null;
  }>({
    password: null,
    confirmPassword: null,
  });

  useEffect(() => {
    if (!token) {
      setState((prev) => ({
        ...prev,
        error:
          "Invalid verification link. Please check your email and try again.",
      }));
    }
  }, [token]);

  const validatePassword = (password: string): string | null => {
    return ValidatorUtils.validatePassword(password);
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleInputChange = (
    field: keyof VerificationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }

    // Validate password in real-time
    if (field === "password") {
      const error = validatePassword(value);
      setPasswordErrors((prev) => ({ ...prev, password: error }));
    } else if (field === "confirmPassword") {
      const error = validateConfirmPassword(formData.password, value);
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: error }));
    }
  };

  const validateForm = (): boolean => {
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    setPasswordErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !passwordError && !confirmPasswordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setState((prev) => ({ ...prev, error: "Invalid verification link" }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/v1/auth/account-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setState((prev) => ({ ...prev, success: true, isLoading: false }));

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push(PAGE_ROUTES.AUTH.LOGIN.path);
      }, 3000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        isLoading: false,
      }));
    }
  };

  if (state.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">
              Account Verified!
            </CardTitle>
            <CardDescription>
              Your account has been successfully verified and password set. You
              will be redirected to the login page shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/image/start-logo.png"
              alt="Start Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Set your password to complete the account verification process
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600">{state.error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter your new password"
                  className={`w-full ${
                    passwordErrors.password
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                  disabled={state.isLoading}
                />
                {passwordErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your new password"
                  className={`w-full ${
                    passwordErrors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                  disabled={state.isLoading}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                disabled={
                  state.isLoading ||
                  !formData.password ||
                  !formData.confirmPassword
                }
                className="w-full py-3 text-base font-medium text-center"
                onClick={(e) => handleSubmit(e)}
              >
                {state.isLoading ? "Verifying..." : "Verify Account"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => router.push(PAGE_ROUTES.AUTH.LOGIN.path)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
