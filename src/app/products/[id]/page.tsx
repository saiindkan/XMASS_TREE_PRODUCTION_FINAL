"use client";
import { notFound, useRouter } from "next/navigation";
import products from "../../../data/products";
import { useCart } from "../../../context/CartContext";
import { useState, useEffect } from "react";
import ProductImages from "../../../components/ProductImages";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = products.find((p) => p.id.toString() === params.id);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  // Get the base product name (without height suffix)
  const baseProductName = product?.name.replace(/\s*\([^)]*\)$/, '') || product?.name || '';
  
  // Find all products with the same base name but different heights
  const relatedProducts = products.filter(p => {
    const pBaseName = p.name.replace(/\s*\([^)]*\)$/, '');
    return pBaseName === baseProductName;
  });
  
  // Available heights with pricing from related products
  const availableHeights = relatedProducts.map(p => ({
    height: p.height || "5' - 6'",
    price: p.price,
    id: p.id
  }));
  
  // Get current product details
  const currentHeight = product?.height || "5' - 6'";
  const currentPrice = product?.price || 170;
  
  console.log('Current product:', product?.name);
  console.log('Current height:', currentHeight);
  console.log('Current price:', currentPrice);
  console.log('Available heights:', availableHeights);

  if (!product) return notFound();
  
  // Handle height selection - navigate to the correct product
  const handleHeightChange = (height: string) => {
    console.log('Height selection changed to:', height);
    const targetProduct = relatedProducts.find(p => p.height === height);
    if (targetProduct) {
      router.push(`/products/${targetProduct.id}`);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: product.images[0],
    }, quantity);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Premium Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-gray-600 hover:text-emerald-700 font-medium transition-all duration-300"
          >
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-emerald-50 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm">Back to Products</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column: Product Images */}
          <div className="space-y-6">
            <ProductImages images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-8">
            {/* Badge */}
            {product.badge && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                <span className="text-yellow-300">⭐</span>
                {product.badge}
              </div>
            )}

            {/* Product Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-800 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
            </div>

            {/* Product Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* Height Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Select Height
              </label>
              <div className="relative">
                <select
                  value={currentHeight}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full max-w-xs px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {availableHeights.map((heightOption) => (
                    <option key={heightOption.height} value={heightOption.height}>
                      {heightOption.height} Trees - ${heightOption.price}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>


            {/* Price Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {currentHeight} Premium Christmas Tree
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent transition-all duration-300">
                      ${currentPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm">USD</span>
                  </div>
                  {/* Price comparison */}
                  <div className="mt-2 text-sm text-gray-600">
                    {availableHeights.map((heightOption) => (
                      <div key={heightOption.height} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          currentHeight === heightOption.height ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}></span>
                        <span className={currentHeight === heightOption.height ? 'font-medium text-emerald-700' : 'text-gray-500'}>
                          {heightOption.height}: ${heightOption.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-600 mb-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">Premium Quality</span>
                  </div>
                  <p className="text-xs text-gray-500">Free Shipping Included</p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-4 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-6 py-4 text-xl font-semibold text-gray-900 bg-gray-50">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-4 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`group flex-1 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg btn-premium ${
                    isAdding 
                      ? 'bg-emerald-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-emerald-200 hover:shadow-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 text-white">
                    {isAdding ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🎄</span>
                        <span>Add to Cart</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0a2 2 0 11-4 0" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <span className="font-medium">Easy Setup</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-medium">Made with Love</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
