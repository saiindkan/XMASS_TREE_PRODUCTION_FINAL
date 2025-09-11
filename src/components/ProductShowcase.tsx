import Link from "next/link";

const featuredTrees = [
  {
    id: 1,
    name: "Classic Fir",
    desc: "6-8 ft, Fresh, Fragrant",
    price: "$89.99",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "Blue Spruce",
    desc: "7-9 ft, Silvery Needles",
    price: "$109.99",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Decorated Pine",
    desc: "5-7 ft, Pre-Decorated",
    price: "$129.99",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProductShowcase() {
  return (
    <section className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Featured Trees</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredTrees.map((tree) => (
          <div key={tree.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img src={tree.img} alt={tree.name} className="w-full h-40 object-cover rounded mb-2" />
            <div className="font-semibold text-green-900">{tree.name}</div>
            <div className="text-green-700 mb-2">{tree.desc}</div>
            <div className="font-bold text-lg mb-2">{tree.price}</div>
            <Link href={`/products/${tree.id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              View
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
