import React from 'react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Snowflake background */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 animate-pulse">❄️</div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 animate-pulse delay-500">❄️</div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 animate-pulse delay-1000">❄️</div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 animate-pulse delay-1500">❄️</div>
        <div className="absolute bottom-1/2 left-1/2 w-14 h-14 animate-pulse delay-2000">❄️</div>
      </div>
      <div className="z-10 bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h1 className="text-5xl font-bold text-green-800 mb-4 font-serif">Coming Soon!</h1>
        <p className="text-lg text-gray-700 mb-6">
          We're busy preparing something special for you. Our new deals and collections will be unwrapped soon!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-red-600 h-2.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
        </div>
        <p className="text-sm text-gray-500">
          Stay tuned for festive offers and curated Christmas collections.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
