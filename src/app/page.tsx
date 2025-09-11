import HeroPremium from "../components/HeroPremium";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroPremium />
      <Testimonials />
      <FAQ />
    </main>
  );
}
