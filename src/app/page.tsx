import HomeBanner from "@/components/HomeBanner";
import Image from "next/image";
import Header from "@/components/Header";
import VideoBanner from "@/components/VideoBanner";
import "./globals.css";

export default function Home() {
  return (
    <main>
      <Header />
      <VideoBanner />
      <HomeBanner />
    </main>
  );
}
