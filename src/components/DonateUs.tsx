"use client";
import Link from "next/link";

export default function DonateUs() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Christmas Red Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=2000&q=80)',
          }}
        />
        {/* Red Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/85 to-red-700/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>


      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/30">
            <span className="text-white mr-2">💝</span>
            Support Our Mission
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-2xl" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' }}>
            Help Us Spread Christmas Joy
          </h2>
          
          <p className="text-xl text-white opacity-95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Your generous donations help us provide premium Christmas trees and decorations 
            to families who need them most, ensuring everyone can experience the magic of Christmas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Impact Card 1 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:bg-white">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-2xl">🎄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Trees for Families</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Help us provide beautiful Christmas trees to families who cannot afford them, 
              bringing warmth and joy to their homes during the holiday season.
            </p>
          </div>

          {/* Impact Card 2 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:bg-white">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Community Support</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Support local communities by helping us donate decorations and holiday supplies 
              to schools, churches, and community centers.
            </p>
          </div>

          {/* Impact Card 3 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:bg-white">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Sustainable Growth</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Your donations help us expand our operations, source better trees, 
              and improve our services to reach more families in need.
            </p>
          </div>
        </div>

        {/* Donation Stats */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Families Helped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">1,200+</div>
              <div className="text-gray-600 font-medium">Trees Donated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Communities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">$25K+</div>
              <div className="text-gray-600 font-medium">Raised</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/30">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Make a Difference This Christmas</h3>
            <p className="text-xl mb-8 text-gray-600">
              Every donation, no matter the size, helps us bring Christmas joy to families in need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/donate"
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="flex items-center">
                  💝 Donate Now
                  <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href="/donate#volunteer"
                className="px-8 py-4 bg-white/80 backdrop-blur-md border border-red-200 text-red-600 font-semibold text-lg rounded-full hover:bg-white hover:border-red-300 transform hover:-translate-y-1 transition-all duration-300"
              >
                Volunteer With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
