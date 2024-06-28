import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "context/ProtectedRoute";
import { useEffect, useState } from "react";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "context/SurveyContext";
// require('dotenv').config()
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SurveyProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <link rel="manifest" href="../manifest.json"></link> */}
          <AuthProvider>
            <ProtectedRoute>
              <GameWrapper>{children}</GameWrapper>
            </ProtectedRoute>
          </AuthProvider>
        </body>
      </html>
    </SurveyProvider>
  );
}
