export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-green-800 to-green-900 border-t-4 border-green-600 mt-10 py-8 text-sm text-white relative overflow-hidden">
      {/* Christmas tree decorations */}
      <div className="absolute top-0 left-4 text-green-400 text-2xl opacity-30">🎄</div>
      <div className="absolute top-2 right-8 text-green-400 text-xl opacity-30">🌟</div>
      <div className="absolute bottom-4 left-12 text-green-400 text-lg opacity-30">🎁</div>
      <div className="absolute bottom-6 right-16 text-green-400 text-lg opacity-30">❄️</div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-4 relative z-10">
        <div className="text-white font-bold text-2xl mb-2 flex items-center gap-2">
          <span className="text-green-300">🎄</span>
          Indkan Xmas Trees
          <span className="text-green-300">🎄</span>
        </div>
        <div className="mb-2 text-green-200 font-medium">Premium American Christmas Trees & Holiday Decor</div>
        <div className="text-xs text-green-300">&copy; {new Date().getFullYear()} Indkan Xmas Trees. All rights reserved.</div>
      </div>
      
      {/* Bottom festive border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-red-500 to-green-600"></div>
    </footer>
  );
}
