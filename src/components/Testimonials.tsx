"use client";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Amanda L.",
    location: "New York, NY",
    rating: 5,
    title: "Absolutely stunning tree!",
    content: "The quality is top-notch and setup was a breeze. Our family loves it! The white-glove delivery service was exceptional.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?auto=format&fit=crop&w=150&q=80",
    verified: true,
    product: "Luxury Heritage Fir"
  },
  {
    id: 2,
    name: "John S.",
    location: "Los Angeles, CA",
    rating: 5,
    title: "Best investment for Christmas",
    content: "It looks so real and the lights are beautiful. Shipping was super fast! The customer service team was incredibly helpful.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verified: true,
    product: "Designer Decorated Pine"
  },
  {
    id: 3,
    name: "Priya R.",
    location: "Chicago, IL",
    rating: 5,
    title: "Gorgeous and easy to assemble",
    content: "The tree exceeded my expectations. Will buy again for gifts! The premium packaging showed real attention to detail.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    verified: true,
    product: "Classic Noble Fir"
  },
  {
    id: 4,
    name: "Michael T.",
    location: "Miami, FL",
    rating: 5,
    title: "Premium quality, worth every penny",
    content: "The freshness guarantee really delivered. Three weeks later and it still looks perfect. Highly recommend the premium service.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    verified: true,
    product: "Premium Blue Spruce"
  },
  {
    id: 5,
    name: "Sarah K.",
    location: "Seattle, WA",
    rating: 5,
    title: "Perfect for small spaces",
    content: "The boutique collection is exactly what I needed for my apartment. Beautifully crafted and the perfect size.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    verified: true,
    product: "Boutique Tabletop Collection"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-emerald-50/30 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Trusted by Thousands
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            What Our Customers
            <span className="block bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their holiday celebrations
          </p>
        </div>

        {/* Main Testimonial Showcase */}
        <div className="relative mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            
            <div className="relative z-10">
              {/* Quote Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>

              {/* Current Testimonial */}
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-amber-400 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-800 leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full border-4 border-emerald-100 shadow-lg"
                  />
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-lg">{testimonials[currentIndex].name}</h4>
                      {testimonials[currentIndex].verified && (
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-slate-600">{testimonials[currentIndex].location}</p>
                    <p className="text-emerald-600 text-sm font-medium">{testimonials[currentIndex].product}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button 
                onClick={prevTestimonial}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-emerald-600' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-emerald-600 mb-2">50,000+</div>
            <div className="text-slate-600 font-medium">Happy Customers</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-emerald-600 mb-2">4.9★</div>
            <div className="text-slate-600 font-medium">Average Rating</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
            <div className="text-slate-600 font-medium">Satisfaction Rate</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div className="text-3xl font-bold text-emerald-600 mb-2">15 Years</div>
            <div className="text-slate-600 font-medium">In Business</div>
          </div>
        </div>
      </div>
    </section>
  );
}
