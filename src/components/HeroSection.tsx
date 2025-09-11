import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full text-center py-16 flex flex-col items-center gap-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 drop-shadow-lg mb-4">
        🎄 Find Your Perfect Christmas Tree!
      </h1>
      <p className="text-lg md:text-xl text-green-700 mb-4 max-w-2xl mx-auto">
        Premium, fresh-cut trees delivered to your door. Decor, gifts, and more for a magical holiday season.
      </p>
      <Link href="/products" className="inline-block bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-800 transition">
        Shop Trees
      </Link>
    </section>
  );
}
