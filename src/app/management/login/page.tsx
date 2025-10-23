"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/button/button";
import { Input } from "components/ui/input";
import { Label } from "@components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "components/ui/card";
import Image from "next/image";
import { APP_CONFIG } from "@constants/config.constant";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { redirectToDashboard } from "@utils/auth.utils";
import toast from "react-hot-toast";
import startUtilityAPI from "@services/start.utility";

import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await startUtilityAPI.auth.login({ email, password });

      console.log({ response });
      toast.success("Login successful");

      setLocalStorageValue(LOCALSTORAGE.START_MEMBER, response.data, true);
      redirectToDashboard(response.data.role, router);
    } catch (err: any) {
      const errorMessage =
        err.message || err.data?.error || "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
    if (member && member.userId && member.role) {
      redirectToDashboard(member.role, router);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <div className="flex h-52 w-52 items-center justify-center rounded-lg text-primary-foreground">
              <Image
                width={200}
                height={200}
                src={APP_CONFIG.appLogo}
                alt={"logo"}
              />
            </div>
          </div>
          <CardDescription>
            Sign in to your <strong className="text-primary">START</strong>{" "}
            account to continue or request{" "}
            <span className="text-primary">startweb@bhismalab.org</span> for
            access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button
              className="w-full cursor-pointer"
              disabled={isLoading}
              onClick={(e) => handleSubmit(e)}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
