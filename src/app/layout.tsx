import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import ProtectedRoute from "@hooks/ProtectedRoute";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "state/provider/SurveytProvider";
import { LanguageProvider } from "state/provider/LanguageProvider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "START Project",
  description: "A progressive web application for autism screening.",
  manifest: "/manifest.json",
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
                <GameWrapper>{children}</GameWrapper>
              </ProtectedRoute>
            </AuthProvider>
          </body>
        </html>
      </LanguageProvider>
    </SurveyProvider>
  );
}
