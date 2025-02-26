import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import ProtectedRoute from "@hooks/ProtectedRoute";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "state/provider/SurveytProvider";
import { LanguageProvider } from "state/provider/LanguageProvider";
import { Metadata } from "next";
import RootLayoutClient from "components/RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "START Project",
  description: "A progressive web application for autism screening.",
  manifest: "/pwa-script/manifest.json",
  icons: [
    { rel: "icon", type: "image/png", url: "/icons/icon-512.png" },
    { rel: "apple-touch-icon", url: "/icons/icon-masked-512.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SurveyProvider>
      <LanguageProvider>
        <html lang={"en"}>
          <body className={inter.className}>
            <AuthProvider>
              <ProtectedRoute>
                <GameWrapper>
                  <RootLayoutClient>{children}</RootLayoutClient>
                </GameWrapper>
              </ProtectedRoute>
            </AuthProvider>
          </body>
        </html>
      </LanguageProvider>
    </SurveyProvider>
  );
}
