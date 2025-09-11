"use client";
import { useState, useMemo, useEffect } from "react";
import Link from 'next/link';
import decorsData from "@/data/decors";
import { useCart } from "@/context/CartContext";

// Filter interface
interface DecorFilters {
  categories: string[];
  materials: string[];
  priceRange: [number, number];
  searchQuery: string;
}

export default function DecorsPage() {
  const { addToCart, getItemQuantity } = useCart();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DecorFilters>({
    categories: [],
    materials: [],
    priceRange: [0, 1000],
    searchQuery: "",
  });
  const [sort, setSort] = useState("Featured");
  
  // Get unique categories and materials for filter options
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(decorsData.map(decor => decor.category)));
    return uniqueCategories.sort();
  }, []);

  const materials = useMemo(() => {
    const uniqueMaterials = Array.from(new Set(decorsData.map(decor => decor.material)));
    return uniqueMaterials.sort();
  }, []);

  // Get price range
  const priceRange = useMemo(() => {
    const prices = decorsData.map(decor => decor.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, []);
  
  // Count total number of products
  const totalProducts = decorsData.length;
  

  useEffect(() => {
    const initialQuantities = decorsData.reduce((acc, decor) => {
      acc[decor.id] = 1;
      return acc;
    }, {} as Record<number, number>);
    setQuantities(initialQuantities);
  }, []);

  // Filter products based on current filters
  const filteredDecors = useMemo(() => {
    return decorsData.filter((decor) => {
      // Category filter
      const categoryMatch = filters.categories.length === 0 || filters.categories.includes(decor.category);
      
      // Material filter
      const materialMatch = filters.materials.length === 0 || filters.materials.includes(decor.material);
      
      // Price range filter
      const priceMatch = decor.price >= filters.priceRange[0] && decor.price <= filters.priceRange[1];
      
      // Search filter
      const searchMatch = !filters.searchQuery || 
        decor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        decor.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        decor.category.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      return categoryMatch && materialMatch && priceMatch && searchMatch;
    });
  }, [filters]);

  // Sort products
  const sortedDecors = useMemo(() => {
    const decors = [...filteredDecors];
    switch (sort) {
      case "Price: Low to High":
        return decors.sort((a, b) => a.price - b.price);
      case "Price: High to Low":
        return decors.sort((a, b) => b.price - a.price);
      case "Name: A-Z":
        return decors.sort((a, b) => a.name.localeCompare(b.name));
      case "Name: Z-A":
        return decors.sort((a, b) => b.name.localeCompare(a.name));
      case "Category":
        return decors.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return decors;
    }
  }, [filteredDecors, sort]);

  // Filter handlers
  const handleFilterChange = (filterType: keyof Omit<DecorFilters, 'searchQuery' | 'priceRange'>, value: string) => {
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

  const handlePriceRangeChange = (index: number, value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: index === 0 
        ? [value, prev.priceRange[1]] 
        : [prev.priceRange[0], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      materials: [],
      priceRange: [0, 1000],
      searchQuery: "",
    });
    setSort("Featured");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-green-50/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🎄 Christmas Decorations</h1>
              <p className="text-gray-600">
                Showing {sortedDecors.length} of {totalProducts} products
              </p>
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              {showFilters ? 'Hide' : 'Show'} Filters
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
                        placeholder="Search decorations..."
                        value={filters.searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                    <button 
                      onClick={clearFilters} 
                      className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>

                  {/* Category Filters */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Category</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input 
                            type="checkbox" 
                            checked={filters.categories.includes(category)} 
                            onChange={() => handleFilterChange('categories', category)} 
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                          />
                          <span className="ml-3 text-sm text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Material Filters */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Material</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {materials.map((material) => (
                        <label key={material} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input 
                            type="checkbox" 
                            checked={filters.materials.includes(material)} 
                            onChange={() => handleFilterChange('materials', material)} 
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                          />
                          <span className="ml-3 text-sm text-gray-700">{material}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={priceRange[1]}
                          value={filters.priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Min"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={priceRange[1]}
                          value={filters.priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Max"
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        Range: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Product Grid */}
              <section className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2.5 border-2 border-red-200 shadow-lg">
                    <span className="text-xs text-red-800 font-bold">🎯 Sort:</span>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-xs font-semibold text-red-700 focus:outline-none cursor-pointer">
                      <option>Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Name: A-Z</option>
                      <option>Name: Z-A</option>
                      <option>Category</option>
                    </select>
                  </div>
                </div>
                
                {sortedDecors.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No decorations found</h3>
                    <p className="text-gray-500 mb-4">
                      {filters.categories.length > 0 && `No products found for selected categories: ${filters.categories.join(', ')}`}
                      {filters.materials.length > 0 && `No products found for selected materials: ${filters.materials.join(', ')}`}
                      {filters.searchQuery && `No products found matching "${filters.searchQuery}"`}
                    </p>
                    <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedDecors.map((decor) => {
          const cartQuantity = getItemQuantity(decor.id);
          const quantity = quantities[decor.id] || 1;

          const handleAddToCart = () => {
            const defaultColor = decor.colorOptions.find(option => option.code === decor.defaultColor) || decor.colorOptions[0];
            addToCart({ 
              id: decor.id, 
              name: decor.name, 
              price: decor.price, 
              img: defaultColor.images[0] 
            }, quantity);
          };

          const handleQuantityChange = (newQuantity: number) => {
            if (newQuantity >= 1) {
              setQuantities((prev) => ({ ...prev, [decor.id]: newQuantity }));
            }
          };

          return (
            <div key={decor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              {/* Decor Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={decor.colorOptions.find(option => option.code === decor.defaultColor)?.images[0] || decor.colorOptions[0].images[0]}
                  alt={decor.name}
                  className="w-full h-full object-cover"
                />
                {decor.badge && (
                  <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {decor.badge}
                  </span>
                )}
                {cartQuantity > 0 && (
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {cartQuantity}
                  </span>
                )}
              </div>
              
              {/* Decor Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{decor.name}</h3>
                <p className="text-gray-600 text-sm mb-3 flex-1">{decor.description}</p>
                
                <div className="flex items-center justify-between mt-2 mb-4">
                  <span className="text-lg font-bold text-red-700">${decor.price.toFixed(2)}</span>
                  <div className="text-sm text-gray-500">
                    {decor.category}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-white">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* Default Product Grid (when filters are hidden) */}
        {!showFilters && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedDecors.map((decor) => {
              const cartQuantity = getItemQuantity(decor.id);
              const quantity = quantities[decor.id] || 1;

              const handleAddToCart = () => {
                const defaultColor = decor.colorOptions.find(option => option.code === decor.defaultColor) || decor.colorOptions[0];
                addToCart({ 
                  id: decor.id, 
                  name: decor.name, 
                  price: decor.price, 
                  img: defaultColor.images[0] 
                }, quantity);
              };

              const handleQuantityChange = (newQuantity: number) => {
                if (newQuantity >= 1) {
                  setQuantities((prev) => ({ ...prev, [decor.id]: newQuantity }));
                }
              };

              return (
                <div key={decor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {/* Decor Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={decor.colorOptions.find(option => option.code === decor.defaultColor)?.images[0] || decor.colorOptions[0].images[0]}
                      alt={decor.name}
                      className="w-full h-full object-cover"
                    />
                    {decor.badge && (
                      <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {decor.badge}
                      </span>
                    )}
                    {cartQuantity > 0 && (
                      <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                        {cartQuantity}
                      </span>
                    )}
                  </div>
                  
                  {/* Decor Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{decor.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex-1">{decor.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <span className="text-lg font-bold text-red-700">${decor.price.toFixed(2)}</span>
                      <div className="text-sm text-gray-500">
                        {decor.category}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button 
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-white">{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={handleAddToCart}
                        className="px-4 py-2 rounded-md font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
