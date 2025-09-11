"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useMemo } from "react";
import Link from "next/link";
import productsData from "../../data/products";

// Enhanced Constants for filters
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

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity, restoreCart, addToCart, getItemQuantity } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    heights: [],
    searchQuery: "",
  });
  const [selectedTab, setSelectedTab] = useState("All");
  const [sort, setSort] = useState("Featured");
  
  // Debug: Log cart changes
  console.log('CartPage rendered with cart:', cart);
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      // Enhanced height matching logic
      const heightMatch = filters.heights.length === 0 || filters.heights.some(filterHeight => {
        if (filterHeight === "5 ft - 6 ft Trees") return product.height === "5' - 6'";
        if (filterHeight === "6 ft - 7 ft Trees") return product.height === "6' - 7'";
        if (filterHeight === "7 ft - 8 ft Trees") return product.height === "7' - 8'";
        return product.height && product.height.includes(filterHeight);
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

  const handleQuantityChange = async (itemId: number, newQuantity: number, itemName: string) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(itemId);
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 100));
    updateQuantity(itemId, newQuantity);
    setIsUpdating(null);
  };

  const handleRemoveItem = (itemId: number, itemName: string) => {
    console.log('handleRemoveItem called for itemId:', itemId, 'itemName:', itemName);
    console.log('Current cart before removal:', cart);
    setIsUpdating(itemId);
    console.log('About to call removeFromCart with id:', itemId);
    removeFromCart(itemId);
    console.log('removeFromCart called');
    // Small delay to ensure state update, then reset updating state
    setTimeout(() => {
      setIsUpdating(null);
    }, 100);
  };

  const handleClearCart = async () => {
    console.log('handleClearCart called');
    setIsClearing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('About to call clearCart()');
    clearCart();
    console.log('clearCart() called');
    setIsClearing(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20">
        {/* Empty Cart Section */}
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Empty Cart Icon */}
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any Christmas trees to your cart yet. Start shopping to find the perfect tree for your holiday season!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
                </svg>
                Browse & Filter Products
              </button>
              
              <button
                onClick={restoreCart}
                className="inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Restore Cart
              </button>
            </div>
          </div>
        </div>

        {/* Filter and Product Section */}
        {showFilters && (
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Filter Toggle Button */}
            <div className="mb-6">
              <button 
                onClick={() => setShowFilters(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Hide Filters
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Panel */}
              <aside className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
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

                  {/* Category Tabs */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Category</h3>
                    <div className="space-y-2">
                      {["All", "Best Sellers", "Staff Picks"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedTab === tab
                              ? "bg-green-100 text-green-800"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tab === "All" && "🌟"} {tab === "Best Sellers" && "🏆"} {tab === "Staff Picks" && "👑"} {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Product Grid */}
              <section className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
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
                    <p className="text-gray-500 mb-4">
                      {filters.heights.length > 0 && `No products found for selected height filters: ${filters.heights.join(', ')}`}
                      {filters.searchQuery && `No products found matching "${filters.searchQuery}"`}
                      {selectedTab !== "All" && `No products found in ${selectedTab} category`}
                    </p>
                    <div className="text-sm text-gray-400 mb-4">
                      Available heights: 5' - 6', 6' - 7', 7' - 8'
                    </div>
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
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} • Total: <span className="font-semibold text-green-600">${total.toFixed(2)}</span>
              </p>
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              {showFilters ? 'Hide' : 'Browse More'} Products
            </button>
          </div>
        </div>

        {/* Filter and Product Section */}
        {showFilters && (
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filter Panel */}
              <aside className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
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

                  {/* Category Tabs */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Category</h3>
                    <div className="space-y-2">
                      {["All", "Best Sellers", "Staff Picks"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedTab === tab
                              ? "bg-green-100 text-green-800"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {tab === "All" && "🌟"} {tab === "Best Sellers" && "🏆"} {tab === "Staff Picks" && "👑"} {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Product Grid */}
              <section className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
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
                    <p className="text-gray-500 mb-4">
                      {filters.heights.length > 0 && `No products found for selected height filters: ${filters.heights.join(', ')}`}
                      {filters.searchQuery && `No products found matching "${filters.searchQuery}"`}
                      {selectedTab !== "All" && `No products found in ${selectedTab} category`}
                    </p>
                    <div className="text-sm text-gray-400 mb-4">
                      Available heights: 5' - 6', 6' - 7', 7' - 8'
                    </div>
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
        )}

        {/* Cart Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items ({cart.length})</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">Unit Price: <span className="font-medium text-green-600">${item.price.toFixed(2)}</span></p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.name)}
                                disabled={isUpdating === item.id || item.quantity <= 1}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                </svg>
                              </button>
                              
                              <span className="px-4 py-1.5 bg-white text-gray-900 font-medium min-w-[3rem] text-center">
                                {isUpdating === item.id ? '...' : item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.name)}
                                disabled={isUpdating === item.id}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price and Actions */}
                        <div className="flex flex-col items-end space-y-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            disabled={isUpdating === item.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50"
                          >
                            {isUpdating === item.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Summary Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {session ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>
              
              {!session && (
                <Link 
                  href="/auth/signin?callbackUrl=/cart"
                  className="w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 text-center block"
                >
                  Sign In
                </Link>
              )}
              
              <button
                onClick={handleClearCart}
                disabled={isClearing || cart.length === 0}
                className="w-full py-2 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearing ? 'Clearing...' : 'Clear Cart'}
              </button>
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                href="/products"
                className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
