"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HeroPremium() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Array<{
    id: number;
    width: number;
    height: number;
    left: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsLoaded(true);
    
    // Generate snowflakes only on client side to avoid hydration mismatch
    const generateSnowflakes = () => {
      const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        width: 2 + Math.random() * 4,
        height: 2 + Math.random() * 4,
        left: Math.random() * 100,
        animationDelay: Math.random() * 3,
        animationDuration: 8 + Math.random() * 4,
      }));
      setSnowflakes(flakes);
    };
    
    generateSnowflakes();
  }, []);

  // Choose background based on login status
  const getBackgroundImage = () => {
    if (status === 'authenticated') {
      // Christmas trees wallpaper for logged-in users
      return 'url(https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=2000&q=80)';
    } else {
      // Contact page Christmas decorations wallpaper for visitors
      return 'url(https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&w=2000&q=80)';
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image with Parallax Effect */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-110 transition-transform duration-[10s] ease-out"
          style={{
            backgroundImage: getBackgroundImage(),
          }}
        />
        {/* Enhanced Gradient Overlays for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-emerald-900/20" />
      </div>

      {/* Christmas Snowfall Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className={`absolute bg-white/40 rounded-full`}
            style={{
              width: `${flake.width}px`,
              height: `${flake.height}px`,
              left: `${flake.left}%`,
              animationDelay: `${flake.animationDelay}s`,
              animationDuration: `${flake.animationDuration}s`,
              animation: `snowfall ${flake.animationDuration}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* CSS Animation for Snowfall */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center">
        <div 
          className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Christmas Premium Badge with Enhanced Visibility */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-red-900/40 backdrop-blur-md border border-red-300/30 text-white text-sm font-semibold mb-6 shadow-2xl">
            <span className="text-red-300 mr-2">🎄</span>
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse shadow-lg"></span>
            Christmas Collection 2025
          </div>

          {/* Main Headline with Enhanced Readability */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-white drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>
              Luxury Christmas
            </span>
            <span className="block text-emerald-300 font-light drop-shadow-xl" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}>
              Trees & Decor
            </span>
          </h1>

          {/* Subtitle with Better Contrast */}
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            <span className="text-white drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
              Handpicked premium trees from the finest forests.
            </span>
            <span className="block mt-2 text-emerald-200 drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
              Delivered with white-glove service to your doorstep.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/products"
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                Explore Collection
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/deals"
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center">
                Limited Offers
                <svg className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
                </svg>
              </span>
            </Link>

            <Link
              href="/donate"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-red-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                💝 Donate Us
                <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Premium Features with Enhanced Readability */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>🎁 Free Premium Delivery</span>
            </div>
            
            <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>❄️ Freshness Guarantee</span>
            </div>

            <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <div className="w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>⭐ Curated Selection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
