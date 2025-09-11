"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [counters, setCounters] = useState({ trees: 0, customers: 0, years: 0, states: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    // Animate counters
    const animateCounter = (key: keyof typeof counters, target: number) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 50);
    };

    const timer = setTimeout(() => {
      animateCounter('trees', 50000);
      animateCounter('customers', 15000);
      animateCounter('years', 15);
      animateCounter('states', 50);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=2000&q=80)',
      }}
    >
      {/* Christmas Wallpaper Hero Section */}
      <div 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Christmas Background Wallpaper */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
                      style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=2000&q=80)',
            }}
        />
        
        {/* Minimal Dark Tint for Text Visibility */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Christmas Snowfall Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute bg-white/40 rounded-full`}
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                animation: `snowfall ${8 + Math.random() * 4}s linear infinite`,
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
          
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            {/* Luxury Forest Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-slate-800/90 backdrop-blur-md text-white text-sm font-semibold mb-8 shadow-lg border border-slate-400/40"
                 style={{
                   textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                   boxShadow: '0 0 15px rgba(71, 85, 105, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                 }}>
              <span className="text-slate-200 mr-3 text-lg">🌲</span>
              <span className="w-2 h-2 bg-slate-300 rounded-full mr-3 animate-pulse"></span>
              From Pristine Forests • Handpicked Excellence • Since 2009
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg"
                style={{
                  textShadow: '2px 2px 6px rgba(0,0,0,0.7), 0 0 12px rgba(71, 85, 105, 0.3)'
                }}>
              <span className="block text-emerald-100">
                From Forest
              </span>
              <span className="block text-slate-100 font-light">
                to Your Family
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-5xl mx-auto font-normal leading-relaxed drop-shadow-md"
               style={{
                 textShadow: '1px 1px 4px rgba(0,0,0,0.6), 0 0 8px rgba(71, 85, 105, 0.2)'
               }}>
              <span className="text-emerald-50 block mb-3 font-medium">
                Deep in America's most pristine winter forests, we handselect each tree
              </span>
              <span className="text-slate-200 block font-normal">
                Bringing you the luxury of nature's finest Christmas trees, where every needle tells a story of perfection
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                                <Link
                    href="/products"
                    className="group relative px-12 py-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-emerald-500/30 transform hover:-translate-y-2 transition-all duration-300 border border-emerald-500/30"
                  >
                    <span className="relative flex items-center">
                      🌲 Discover Premium Trees
                      <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>

                  <button
                    onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group px-12 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-xl rounded-full hover:bg-white/20 hover:border-white/50 transform hover:-translate-y-2 transition-all duration-300"
                  >
                    <span className="flex items-center">
                      ❄️ Our Forest Journey
                      <svg className="w-6 h-6 ml-3 group-hover:translate-y-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-20 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              A Legacy of <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Forest Excellence</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              From the pristine snow-covered forests to your family's living room - our journey of bringing nature's finest Christmas trees to America's homes
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 border border-emerald-500/20">
                <div className="text-5xl mb-3">🌲</div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {counters.trees.toLocaleString()}+
                </div>
                <div className="text-emerald-100 font-semibold text-lg">Premium Trees<br/>From Forest to Home</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-3xl p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 border border-blue-500/20">
                <div className="text-5xl mb-3">🏡</div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {counters.customers.toLocaleString()}+
                </div>
                <div className="text-blue-100 font-semibold text-lg">Luxury Families<br/>Creating Memories</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-3xl p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 border border-amber-500/20">
                <div className="text-5xl mb-3">❄️</div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {counters.years}
                </div>
                <div className="text-amber-100 font-semibold text-lg">Winter Seasons<br/>of Excellence</div>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-700 to-purple-800 rounded-3xl p-8 shadow-2xl transform group-hover:scale-110 transition-all duration-300 border border-purple-500/20">
                <div className="text-5xl mb-3">🇺🇸</div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {counters.states}+
                </div>
                <div className="text-purple-100 font-semibold text-lg">States Blessed<br/>with Our Trees</div>
              </div>
            </div>
          </div>
          </div>
        </div>

      {/* Interactive Story Section */}
      <div id="story" className="py-20 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Our <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Forest Legacy</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Journey with us through snow-covered forests and pristine wilderness, where every tree tells a story of luxury, tradition, and the magic of bringing nature's masterpieces to your home
            </p>
          </div>
          
          {/* Interactive Tabs */}
          <div className="flex flex-wrap justify-center mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {[
              { id: 'story', label: 'Forest Journey', icon: '🌲' },
              { id: 'mission', label: 'Winter Mission', icon: '❄️' },
              { id: 'values', label: 'Nature Values', icon: '🏔️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
            {activeTab === 'story' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-5a1 1 0 011-1h4a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Born in Winter Wilderness</h3>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Deep in the snow-covered forests of America, where pristine evergreens stand tall against winter skies, our story began. <strong>We don't just deliver trees - we bring you nature's luxury.</strong> Since 2009, we've been the guardians of forest excellence, handpicking only the most magnificent specimens from untouched wilderness to grace your family's most precious moments.
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Fresh Produce & Spices</h4>
                    <p className="text-slate-600">Premium agricultural commodities sourced from trusted growers</p>
                  </div>

                  <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Healthcare Supplies</h4>
                    <p className="text-slate-600">Nutraceutical and pharmaceutical products for wellness</p>
                  </div>

                  <div className="group bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">🚛</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Logistics & Distribution</h4>
                    <p className="text-slate-600">Multimodal wholesale distribution across all 50 states</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="text-center space-y-8 animate-fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h3>
                <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
                  To revolutionize global trade through data-driven strategies and operational agility, while empowering local producers, fostering sustainable growth, and building strategic partnerships that bring families the finest Christmas trees from America's pristine forests.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8">
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Sustainable Excellence</h4>
                    <p className="text-slate-600">Every tree represents our commitment to environmental stewardship and sustainable forestry practices.</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8">
                    <h4 className="text-xl font-bold text-slate-900 mb-4">Customer First</h4>
                    <p className="text-slate-600">We prioritize customer satisfaction through premium quality products and exceptional service.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="space-y-12 animate-fade-in-up">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-slate-900 mb-6">Our Core Values</h3>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                    These principles guide everything we do, from sourcing to delivery
                  </p>
            </div>
            
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { icon: '🌿', title: 'Sustainability', desc: 'Environmental responsibility in every decision' },
                    { icon: '⭐', title: 'Quality', desc: 'Premium standards that exceed expectations' },
                    { icon: '🤝', title: 'Trust', desc: 'Building lasting relationships through integrity' },
                    { icon: '🚀', title: 'Innovation', desc: 'Embracing technology to improve experiences' },
                    { icon: '💚', title: 'Care', desc: 'Genuine concern for customers and communities' },
                    { icon: '🏆', title: 'Excellence', desc: 'Continuous improvement in all aspects' }
                  ].map((value, index) => (
                    <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h4>
                      <p className="text-slate-600">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Trees Section */}
      <div className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-8">
              <span className="text-2xl mr-3">🎄</span>
              Premium Natural Christmas Trees
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Our Natural Christmas Trees
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Sustainably sourced from America's pristine forests, delivered fresh to your door
            </p>
            </div>
            
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-emerald-100 mb-8">100% Natural & Sustainable</h3>
              {[
                { icon: '🌲', title: 'Certified Sustainable Farms', desc: 'Sourced from certified sustainable tree farms across the Pacific Northwest' },
                { icon: '🌿', title: 'Pure Natural Freshness', desc: 'No artificial preservatives or chemicals - just pure, natural freshness' },
                { icon: '🏔️', title: 'Pristine Environment', desc: 'Grown in pristine mountain environments with clean air and pure water' },
                { icon: '♻️', title: 'Eco-Friendly Harvesting', desc: 'Eco-friendly harvesting practices that support forest regeneration' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-emerald-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
              <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-emerald-100">{item.desc}</p>
                  </div>
              </div>
              ))}
            </div>
            
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-emerald-100 mb-8">Premium Quality Promise</h3>
              {[
                { icon: '✨', title: 'Hand-Selected Quality', desc: 'Hand-selected for perfect shape, fullness, and needle retention' },
                { icon: '🚚', title: 'Fresh Delivery', desc: 'Fresh-cut and delivered within 48 hours of harvest' },
                { icon: '🎯', title: 'Quality Control', desc: 'Rigorous quality control ensures only the finest trees reach your home' },
                { icon: '🏠', title: 'Long-Lasting Freshness', desc: 'Long-lasting freshness that fills your home with natural pine fragrance' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-emerald-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
              <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-emerald-100">{item.desc}</p>
                  </div>
              </div>
              ))}
            </div>
          </div>

          {/* Tree Varieties */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌲', name: 'Noble Fir', desc: 'The premium choice with excellent needle retention and sturdy branches', badge: '100% Natural' },
              { icon: '🎄', name: 'Douglas Fir', desc: 'Classic Christmas tree with sweet fragrance and full, pyramid shape', badge: 'Sustainably Grown' },
              { icon: '🌿', name: 'Grand Fir', desc: 'Glossy green needles with citrus scent and excellent fullness', badge: 'Forest Fresh' }
            ].map((tree, index) => (
              <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 text-center">{tree.icon}</div>
                <h4 className="text-2xl font-bold text-white mb-4 text-center">{tree.name}</h4>
                <p className="text-emerald-100 mb-6 text-center leading-relaxed">{tree.desc}</p>
                <div className="text-center">
                  <span className="inline-block px-4 py-2 bg-emerald-500/30 text-emerald-100 rounded-full text-sm font-semibold">
                    {tree.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Commitment */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Our Environmental <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Commitment</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every tree we sell represents our commitment to environmental stewardship and sustainable forestry practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🌍', title: 'Carbon Neutral Operations', desc: 'Our tree farms actively absorb CO₂, making each purchase carbon-positive for the environment' },
              { icon: '🦋', title: 'Wildlife Habitat Protection', desc: 'Our sustainable farming practices preserve natural habitats for local wildlife' },
              { icon: '💧', title: 'Water Conservation', desc: 'Advanced irrigation systems minimize water usage while maintaining tree health' },
              { icon: '🌱', title: 'Regenerative Practices', desc: 'For every tree harvested, multiple seedlings are planted to ensure forest renewal' }
            ].map((item, index) => (
              <div key={index} className="group text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="py-20 bg-slate-900/95 backdrop-blur-md text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent"></div>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-300/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-bold mb-8">
            From Winter Forest <span className="text-emerald-300">to Your Heart</span>
          </h2>
          <p className="text-xl text-slate-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            Step into luxury with nature's masterpieces. Each tree carries the pristine essence of America's most beautiful forests, 
            handcrafted by winter winds and selected by our forest experts to create your family's most treasured Christmas memories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link
              href="/products" 
              className="group relative px-12 py-5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-emerald-500/30 transform hover:-translate-y-2 transition-all duration-300 border border-emerald-500/30"
            >
              <span className="relative flex items-center">
                🌲 Explore Forest Collection
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <a 
              href="mailto:info@indkan.com" 
              className="group px-12 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold text-xl rounded-full hover:bg-white/20 hover:border-white/50 transform hover:-translate-y-2 transition-all duration-300"
            >
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ❄️ Connect with Forest Experts
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
