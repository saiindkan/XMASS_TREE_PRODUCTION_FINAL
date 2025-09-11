"use client";
import Link from "next/link";
import { useState } from "react";

const trees = [
  {
    id: 1,
    name: "Classic Noble Fir",
    desc: "6-8 ft • Fresh Cut • Signature Fragrance",
    price: "$89.99",
    originalPrice: "$119.99",
    badge: "Popular",
    rating: 4.9,
    reviews: 127,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    features: ["Fresh Cut", "Long Lasting", "Premium Grade"]
  },
  {
    id: 2,
    name: "Premium Blue Spruce",
    desc: "7-9 ft • Silvery Blue Needles • Majestic",
    price: "$109.99",
    originalPrice: "$139.99",
    badge: "Premium",
    rating: 4.8,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    features: ["Silvery Needles", "Strong Branches", "Elegant Shape"]
  },
  {
    id: 3,
    name: "Designer Decorated Pine",
    desc: "5-7 ft • Professional Styling • Ready to Display",
    price: "$129.99",
    originalPrice: "$169.99",
    badge: "Designer",
    rating: 5.0,
    reviews: 203,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    features: ["Pre-Decorated", "Designer Style", "Premium Ornaments"]
  },
  {
    id: 4,
    name: "Boutique Tabletop Collection",
    desc: "2 ft • Perfect for Small Spaces • Artisan Crafted",
    price: "$39.99",
    originalPrice: "$59.99",
    badge: "Boutique",
    rating: 4.7,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    features: ["Compact Size", "Artisan Quality", "Space Efficient"]
  },
  {
    id: 5,
    name: "Luxury Heritage Fir",
    desc: "8-10 ft • Estate Grade • White Glove Service",
    price: "$189.99",
    originalPrice: "$249.99",
    badge: "Luxury",
    rating: 4.9,
    reviews: 67,
    img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80",
    features: ["Estate Grade", "White Glove", "Premium Service"]
  },
];

export default function ProductList() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Popular": return "bg-emerald-500";
      case "Premium": return "bg-blue-500";
      case "Designer": return "bg-purple-500";
      case "Boutique": return "bg-pink-500";
      case "Luxury": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-12">
      {trees.map((tree) => (
        <div 
          key={tree.id} 
          className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 ${
            hoveredCard === tree.id ? 'transform -translate-y-2 shadow-2xl' : ''
          }`}
          onMouseEnter={() => setHoveredCard(tree.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Badge */}
          <div className={`absolute top-4 left-4 z-10 px-3 py-1 ${getBadgeColor(tree.badge)} text-white text-xs font-bold rounded-full shadow-lg`}>
            {tree.badge}
          </div>

          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img 
              src={tree.img} 
              alt={tree.name} 
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Quick View Overlay */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
              hoveredCard === tree.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <Link 
                href={`/products/${tree.id}`}
                className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Quick View
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(tree.rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">{tree.rating} ({tree.reviews})</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors duration-200">
              {tree.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {tree.desc}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tree.features.map((feature, index) => (
                <span key={index} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  {feature}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-slate-900">{tree.price}</span>
                <span className="text-sm text-gray-500 line-through">{tree.originalPrice}</span>
              </div>
              <div className="text-sm text-emerald-600 font-semibold">
                Save {Math.round(((parseFloat(tree.originalPrice.slice(1)) - parseFloat(tree.price.slice(1))) / parseFloat(tree.originalPrice.slice(1))) * 100)}%
              </div>
            </div>

            {/* CTA Button */}
            <Link 
              href={`/products/${tree.id}`}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 flex items-center justify-center group"
            >
              <span>View Details</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>
      ))}
    </section>
  );
}
