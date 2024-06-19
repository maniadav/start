import HomeBanner from "components/HomeBanner";
import Image from "next/image";
import Header from "components/Header";
import VideoBanner from "components/VideoBanner";
import "./globals.css";
import HomeBanner2 from "components/HomeBanner2";
import Footer from "components/Footer";
import dotenv from "dotenv";
dotenv.config();

export default function Home() {
  console.log(process.env.BASE_URL);

  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      <VideoBanner />
      <HomeBanner2 />
      <Footer />
    </div>
  );
}
