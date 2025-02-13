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
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "START: Autism Screening",
  description:
    "It's a simple progressive web application for autism screening in low network areas.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "black", color: "#fff" }],
  authors: [
    {
      name: "Manish Yadav",
      url: "https://www.linkedin.com/in/maniadav/",
    },
  ],
  publisher: "Manish Yadav",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/start-rounded-192.png" }, // macOS-specific icon
    { rel: "icon", type: "image/png", url: "/icons/start.png" },
    { rel: "icon", type: "image/x-icon", url: "/icons/start.png" },
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
            <link rel="icon" href="/icons/start-rounded.png" sizes="any" />
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
