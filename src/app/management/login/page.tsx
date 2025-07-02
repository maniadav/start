"use client";

import type React from "react";

import { useState } from "react";
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
import { login } from "@management/lib/auth";
import { APP_CONFIG } from "@constants/config.constant";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    alert(`${email}-${password}`);
    const user = login(email, password);

    if (user) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });

      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "organisation") {
        router.push("/org");
      } else {
        router.push("/surveyor");
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

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
                <strong>Org Admin:</strong> org1@example.com
              </p>
              <p>
                <strong>Observer:</strong> observer1@example.com
              </p>
              <p>
                <strong>Surveyor:</strong> surveyor1@example.com
              </p>
              <p className="text-muted-foreground mt-2">Password: password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
