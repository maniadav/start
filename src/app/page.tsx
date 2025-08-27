import "./globals.css";
import ActionBanner from "@components/section/action-section";
import LandingBanner from "@components/section/hero-section";

export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <LandingBanner />
      <ActionBanner />
    </div>
  );
}
