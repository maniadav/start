"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import ProtectedRoute from "@hooks/ProtectedRoute";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "state/provider/SurveytProvider";
import {
  LanguageProvider,
  useLanguageProvider,
} from "state/provider/LanguageProvider";
// import { Metadata } from "next";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "START: Autism Screening",
//   description:
//     "It's a simple progressive web application for autism screening in low network areas.",
//   generator: "Next.js",
//   manifest: "/manifest.json",
//   keywords: ["nextjs", "next14", "pwa", "next-pwa"],
//   themeColor: [{ media: "black", color: "#fff" }],
//   authors: [
//     {
//       name: "Manish Yadav",
//       url: "https://www.linkedin.com/in/maniadav/",
//     },
//   ],
//   publisher: "Manish Yadav",
//   icons: [
//     { rel: "apple-touch-icon", url: "/icons/start-rounded-192.png" }, // macOS-specific icon
//     { rel: "icon", type: "image/png", url: "/icons/start.png" },
//     { rel: "icon", type: "image/x-icon", url: "/icons/start.png" },
//   ],
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
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

  return (
    <SurveyProvider>
      <LanguageProvider>
        <html lang={"en"}>
          <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <link
              rel="icon"
              type="image/png"
              href="/icons/icon-512.png"
              sizes="any"
            />
          </head>
          <body className={inter.className}>
            <AuthProvider>
              <ProtectedRoute>
                <GameWrapper>{children}</GameWrapper>
              </ProtectedRoute>
            </AuthProvider>
          </body>
        </html>
      </LanguageProvider>
    </SurveyProvider>
  );
}
