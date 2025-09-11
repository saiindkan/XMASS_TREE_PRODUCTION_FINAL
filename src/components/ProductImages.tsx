"use client";

import { useState, useEffect } from "react";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isZoomed) return;

      switch (event.key) {
        case 'Escape':
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            setSelectedImage((prev) => 
              prev === 0 ? images.length - 1 : prev - 1
            );
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            setSelectedImage((prev) => 
              prev === images.length - 1 ? 0 : prev + 1
            );
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, images.length]);

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative group">
        {/* Main Image */}
        <div 
          className="relative w-full rounded-3xl shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 overflow-hidden border border-gray-100 cursor-pointer group/image" 
          style={{aspectRatio: '1/1'}}
          onClick={() => setIsZoomed(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-100/20"></div>
          <img
            src={images[selectedImage]}
            alt={`${productName} - Main View`}
            className="w-full h-full object-contain p-8 transition-transform duration-500 ease-out group-hover/image:scale-110"
          />
          
          {/* Premium Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={() => setSelectedImage((prev) => 
                prev === 0 ? images.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => setSelectedImage((prev) => 
                prev === images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 z-10 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg border border-gray-200">
              <span className="text-emerald-600 font-bold">{selectedImage + 1}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span>{images.length}</span>
            </div>

            {/* Zoom Indicator */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 shadow-lg border border-gray-200">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span>Click to zoom • ESC to close</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Premium Thumbnails */}
      {images.length > 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>
            <span className="text-sm text-gray-500">{images.length} photos</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-none w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                  selectedImage === index
                    ? "border-emerald-500 shadow-lg ring-2 ring-emerald-200"
                    : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                }`}
              >
                <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50">
                  <img
                    src={image}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500 rounded-2xl"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-10 bg-white/90 text-gray-700 text-sm font-medium px-3 py-2 rounded-full shadow-lg border border-gray-200">
                <span className="text-emerald-600 font-bold">{selectedImage + 1}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span>{images.length}</span>
              </div>
            )}

            {/* Main Zoomed Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={`${productName} - Zoomed View`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Navigation Arrows for Zoomed View */}
            {images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => 
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => 
                      prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-600 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Thumbnails for Zoomed View */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-gray-200">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? "border-emerald-500 shadow-md"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${productName} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Click outside to close */}
            <div 
              className="absolute inset-0 -z-10" 
              onClick={() => setIsZoomed(false)}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
