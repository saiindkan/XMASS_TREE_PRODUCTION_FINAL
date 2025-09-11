"use client";
import { useState, useMemo } from "react";
import Link from 'next/link';
import productsData from "../../data/products";
import { useCart } from "../../context/CartContext";

// Enhanced Constants for filters (inspired by Treetime.com)
const treeHeights = [
  "5 ft - 6 ft Trees",
  "6 ft - 7 ft Trees", 
  "7 ft - 8 ft Trees"
];


// Enhanced Type for product filters
interface ProductFilters {
  heights: string[];
  searchQuery: string;
}

// Product Item Component
function ProductItem({ 
  product, 
  onAddToCart, 
  cartQuantity 
}: {
  product: typeof productsData[0];
  onAddToCart: () => void;
  cartQuantity: number;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-play slideshow functionality removed - images only change on manual interaction

  const handleAddToCartWithFeedback = () => {
    setIsAdding(true);
    onAddToCart();
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="group relative">
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full border border-white/60 backdrop-blur-sm group-hover:-translate-y-2 group-hover:scale-[1.02]">
          {/* Product Image Section - Clickable for navigation */}
          <Link href={`/products/${product.id}`} className="block">
            <div className="relative h-64 rounded-t-2xl bg-white flex items-center justify-center p-4">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain cursor-pointer transition-all duration-700 group-hover:scale-105 filter group-hover:brightness-110"
              />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-full z-10 shadow-lg backdrop-blur-sm border border-white/20">
                ⭐ {product.badge}
              </span>
            )}
            {cartQuantity > 0 && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-lg animate-pulse border-2 border-white">
                {cartQuantity}
              </span>
            )}
            
            {/* Image Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === product.images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'bg-white shadow-lg' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Luxury Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>
        
        {/* Product Info Section - Clickable for navigation */}
        <Link href={`/products/${product.id}`} className="block flex-1">
          <div className="p-6 flex flex-col h-full bg-gradient-to-b from-transparent to-white/50">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 flex-1 leading-relaxed">{product.description}</p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">${product.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-medium">Premium Quality</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Interactive Controls Section - Not clickable for navigation */}
        <div className="px-6 pb-6 bg-gradient-to-t from-gray-50/50 to-transparent">
          <div className="mt-4">
            {/* Simple Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCartWithFeedback();
              }}
              className="w-full px-6 py-2 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              🎄 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { addToCart, getItemQuantity } = useCart();

  const [selectedTab, setSelectedTab] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [filters, setFilters] = useState<ProductFilters>({
    heights: ["5 ft - 6 ft Trees"],
    searchQuery: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);





  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      // Enhanced height matching logic
      const heightMatch = filters.heights.length === 0 || filters.heights.some(filterHeight => {
        if (filterHeight === "5 ft - 6 ft Trees") return product.height === "5' - 6'";
        if (filterHeight === "6 ft - 7 ft Trees") return product.height === "6' - 7'";
        if (filterHeight === "7 ft - 8 ft Trees") return product.height === "7' - 8'";
        return product.height.includes(filterHeight);
      });
      
      
      const searchMatch = !filters.searchQuery || 
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      let tabMatch = true;
      if (selectedTab === "Best Sellers") tabMatch = product.badge === "Best Seller";
      if (selectedTab === "Staff Picks") tabMatch = product.id === 2;
      
      return heightMatch && tabMatch && searchMatch;
    });
  }, [filters, selectedTab]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sort) {
      case "Price: Low to High":
        return products.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return products.sort((a, b) => b.price - a.price);
      case "Alphabetically, A-Z":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "Alphabetically, Z-A":
        return products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  }, [filteredProducts, sort]);

  const handleFilterChange = (filterType: keyof Omit<ProductFilters, 'searchQuery'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ heights: [], searchQuery: "" });
    setSelectedTab("All");
    setSort("Featured");
  };

  const FilterPanel = (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 lg:sticky lg:top-24">
      {/* Search Section */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Search</h2>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search trees..."
            value={filters.searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
        <button 
          onClick={clearFilters} 
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Clear all filters
        </button>
      </div>

      {/* Shop by Height */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Shop by Height</h3>
        <div className="space-y-2">
          {treeHeights.map((height) => (
            <label key={height} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input 
                type="checkbox" 
                checked={filters.heights.includes(height)} 
                onChange={() => handleFilterChange('heights', height)} 
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" 
              />
              <span className="ml-3 text-sm text-gray-700">{height}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20">
      {/* Luxury Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent">
              🎄 Premium Christmas Trees
            </h1>
            <p className="text-xl sm:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Handpicked luxury trees from the finest forests, delivered with white-glove service
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                Free Premium Delivery
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-3 animate-pulse"></span>
                Freshness Guarantee
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                Expert Curation
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="lg:hidden mb-6">
        <button onClick={() => setIsFilterOpen(true)} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-6.586L4.293 6.707A1 1 0 014 6V3z" clipRule="evenodd" /></svg>
          🎯 Luxury Filters
        </button>
      </div>

      {/* Mobile Filter Panel */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      >
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>
        <div
          className={`absolute inset-y-0 left-0 w-72 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isFilterOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setIsFilterOpen(false)} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="mt-8">{FilterPanel}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-full lg:w-72 flex-shrink-0">
          {FilterPanel}
        </aside>
        <section className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
            <div className="flex flex-wrap gap-3">
              {["All", "Best Sellers", "Staff Picks"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap transform hover:scale-105 text-sm ${
                    selectedTab === tab
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-white/80 backdrop-blur-sm text-emerald-800 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab === "All" && "🌟"} {tab === "Best Sellers" && "🏆"} {tab === "Staff Picks" && "👑"} {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border-2 border-emerald-200 shadow-lg">
              <span className="text-xs text-emerald-800 font-bold">🎯 Sort:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-xs font-semibold text-emerald-700 focus:outline-none cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Alphabetically, A-Z</option>
                <option>Alphabetically, Z-A</option>
              </select>
            </div>
          </div>
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedProducts.map((product) => {
                const cartQuantity = getItemQuantity(product.id);

                const handleAddToCart = () => {
                  addToCart({ id: product.id, name: product.name, price: product.price, img: product.images[0] }, 1);
                };

                return (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    cartQuantity={cartQuantity}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
      </div>
    </main>
  );
}
