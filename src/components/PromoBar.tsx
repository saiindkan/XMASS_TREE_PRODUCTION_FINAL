import Link from 'next/link';

export default function PromoBar() {
  return (
    <Link href="/" className="block w-full bg-gradient-to-r from-emerald-800 via-red-900 to-emerald-800 text-white py-4 px-4 text-center relative flex items-center justify-center overflow-hidden min-h-[70px] shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-red-600/10 to-emerald-600/10"></div>
      
      {/* Elegant Left Decoration */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center">
          <span className="text-white text-sm">✦</span>
        </div>
        <div className="w-1 h-8 bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-60"></div>
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 flex items-center gap-6">
        <span className="text-yellow-400 text-2xl">🎄</span>
        
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-bold tracking-wide text-white drop-shadow-lg" 
               style={{fontFamily: 'serif'}}>
            INDKAN
          </div>
          <div className="text-sm md:text-lg font-medium tracking-widest text-emerald-200 -mt-1" 
               style={{letterSpacing: '0.3em'}}>
            PREMIUM CHRISTMAS
          </div>
        </div>
        
        <span className="text-red-400 text-2xl">🎁</span>
      </div>

      {/* Elegant Right Decoration */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <div className="w-1 h-8 bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-60"></div>
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg flex items-center justify-center">
          <span className="text-white text-sm">✦</span>
        </div>
      </div>

      {/* Subtle Sparkles */}
      <div className="absolute left-20 top-4 text-yellow-300 text-xs opacity-70">✨</div>
      <div className="absolute right-20 top-4 text-yellow-300 text-xs opacity-70">✨</div>
      <div className="absolute left-1/4 top-2 text-emerald-300 text-xs opacity-50">⭐</div>
      <div className="absolute right-1/4 top-2 text-emerald-300 text-xs opacity-50">⭐</div>
    </Link>
  );
}
