import { Metadata } from "next";
import { BASE_URL } from "@constants/config.constant";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import { SurveyProvider } from "state/provider/SurveytProvider";
import { LanguageProvider } from "state/provider/LanguageProvider";
import ServiceWorkerUpdater from "../pwa/ServiceWorkerUpdater";
import { Toaster } from "react-hot-toast";
import GameWrapper from "@components/wrapper/GameWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "START Project",
  description:
    "A Progressive Web Application designed to facilitate early-stage autism screening through structured surveys and observational assessments.",
  manifest: `${BASE_URL}/manifest.json`,
  icons: [
    { rel: "icon", type: "image/png", url: `${BASE_URL}/icons/icon-512.png` },
    { rel: "apple-touch-icon", url: `${BASE_URL}/icons/icon-masked-512.png` },
  ],
  keywords: [
    "autism screening",
    "early intervention",
    "child development",
    "survey",
    "assessment",
    "START Project",
    "progressive web app",
    "observer",
    "organisation",
    "health",
    "psychology",
    "neurodevelopmental",
    "diagnosis",
  ],
  alternates: {
    canonical: "https://startweb.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "maniadav", url: "https://github.com/maniadav" }],
  publisher: "maniadav",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"}>
      <SurveyProvider>
        <LanguageProvider>
          <body className={inter.className}>
            <GameWrapper>
              <AuthProvider>
                <ServiceWorkerUpdater />
                {children}
                <Toaster />
              </AuthProvider>
            </GameWrapper>
          </body>
        </LanguageProvider>
      </SurveyProvider>
    </html>
  );
}
