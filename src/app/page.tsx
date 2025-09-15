import HeroPremium from "../components/HeroPremium";
import DonateUs from "../components/DonateUs";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroPremium />
      <DonateUs />
      <Testimonials />
      <FAQ />
    </main>
  );
}
