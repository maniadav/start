"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, hasRole } from "@management/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Redirect based on role
    if (hasRole(user, ["admin"])) {
      router.push("/admin");
    } else if (hasRole(user, ["organisation"])) {
      router.push("/org");
    } else if (hasRole(user, ["observer"])) {
      router.push("/observer");
    } else if (hasRole(user, ["surveyor"])) {
      router.push("/surveyor");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Loading...</h1>
        <p className="text-primary">Redirecting to your dashboard</p>
      </div>
    </div>
  );
}
