import HeroPremium from "../components/HeroPremium";
import DonateUs from "../components/DonateUs";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroPremium />
      <DonateUs />
      <FAQ />
    </main>
  );
}
