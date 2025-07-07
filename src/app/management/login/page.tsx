"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@management/components/ui/button";
import { Input } from "@management/components/ui/input";
import { Label } from "@management/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@management/components/ui/card";
import Image from "next/image";
import { useToast } from "@management/hooks/use-toast";
import { APP_CONFIG } from "@constants/config.constant";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "@utils/localStorage";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { redirectToDashboard } from "@utils/auth.utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.data?.profile?.name || email}!`,
        });

        setLocalStorageValue(LOCALSTORAGE.START_MEMBER, data.data, true);
        redirectToDashboard(data.data.role, router);
      } else {
        // Improved error handling to catch different error message formats
        const errorMessage = data.message || data.error || "Invalid email or password";
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // On mount, check if already logged in and redirect
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
          {/* <CardTitle className="text-2xl">
            <strong className="text-primary">START</strong> Management
          </CardTitle> */}
          <CardDescription>
            Sign in to your <strong className="text-primary">START</strong>{" "}
            account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Admin:</strong> admin@example.com
              </p>
              <p>
                <strong>Org Admin:</strong> organisation@example.com
              </p>
              <p>
                <strong>Observer:</strong> observer@example.com
              </p>
              <p className="text-muted-foreground mt-2">Password: password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
