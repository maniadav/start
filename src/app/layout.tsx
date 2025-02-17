"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import ProtectedRoute from "@hooks/ProtectedRoute";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "state/provider/SurveytProvider";
import { LanguageProvider } from "state/provider/LanguageProvider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SurveyProvider>
      <LanguageProvider>
        <html lang={"en"}>
          <Head>
            <title>START App</title>
            <link rel="icon" type="image/png" href="/icons/icon-512.png" />
            <link rel="apple-touch-icon" href="/icons/icon-masked-512.png" />
            <link rel="manifest" href="/manifest.json" />
          </Head>

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
