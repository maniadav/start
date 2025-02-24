import Header from "components/Header";
import "./globals.css";
import ActionBanner from "components/ActionBanner";
import Footer from "components/Footer";
import LandingBanner from "components/LandingBanner";

export default function Home() {
  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      <LandingBanner />
      <ActionBanner />
      <Footer />
    </div>
  );
}
