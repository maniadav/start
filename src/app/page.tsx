import "./globals.css";
import ActionBanner from "components/ActionBanner";
import LandingBanner from "components/LandingBanner";

export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <LandingBanner />
      <ActionBanner />
    </div>
  );
}
