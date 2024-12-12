import Header from 'components/Header';
import './globals.css';
import ActionBanner from 'components/ActionBanner';
import Footer from 'components/Footer';
import LandingBanner from 'components/LandingBanner';

export default function Home() {
  console.log(process.env.BASE_URL);

  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      <LandingBanner />
      <ActionBanner />
      <Footer />
    </div>
  );
}
