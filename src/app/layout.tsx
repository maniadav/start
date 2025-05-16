import { Metadata } from "next";
import { BASE_URL } from "@constants/config.constant";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "state/provider/AuthProvider";
import GameWrapper from "components/GameWrapper";
import { SurveyProvider } from "state/provider/SurveytProvider";
import { LanguageProvider } from "state/provider/LanguageProvider";
import ServiceWorkerUpdater from "../components/ServiceWorkerUpdater";

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
            <GameWrapper>
              <AuthProvider>
                <ServiceWorkerUpdater />
                {children}
              </AuthProvider>
            </GameWrapper>
          </body>
        </html>
      </LanguageProvider>
    </SurveyProvider>
  );
}
