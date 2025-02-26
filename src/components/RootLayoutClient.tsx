"use client";
import React, { useEffect } from "react";

export default function RootLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/pwa-script/service-wroker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return <div className="w-full flex flex-col">{children}</div>;
}
