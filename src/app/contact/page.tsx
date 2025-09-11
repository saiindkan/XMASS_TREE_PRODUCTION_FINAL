'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    subject: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeOffice, setActiveOffice] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus({
        success: true,
        message: 'Thank you for your message! We will get back to you within 24 hours.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        subject: 'general'
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error submitting your message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const offices = [
    {
      name: 'New York Headquarters',
      address: '240 West 40th Street',
      city: 'New York, NY 10018',
      country: 'United States',
      phone: '551-235-6264',
      email: 'sai@indkanworldwideexim.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM'
    },
    {
      name: 'West Coast Operations',
      address: 'Pacific Northwest',
      city: 'Seattle, WA',
      country: 'United States',
      phone: '551-235-6264',
      email: 'west@indkanworldwideexim.com',
      hours: 'Mon-Fri: 8AM-5PM, Sat: 9AM-3PM'
    },
    {
      name: 'Southern Distribution',
      address: 'Distribution Center',
      city: 'Atlanta, GA',
      country: 'United States',
      phone: '551-235-6264',
      email: 'south@indkanworldwideexim.com',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-2PM'
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80)',
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?auto=format&fit=crop&w=2000&q=80)',
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
            {/* Premium Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-red-800/90 backdrop-blur-md text-white text-sm font-semibold mb-8 shadow-lg border border-red-400/40"
                 style={{
                   textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                   boxShadow: '0 0 15px rgba(139, 69, 19, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                 }}>
              <span className="text-red-200 mr-3 text-lg">🎄</span>
              <span className="w-2 h-2 bg-red-300 rounded-full mr-3 animate-pulse"></span>
              We're Here to Help • Fast Response • Personal Care
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg"
                style={{
                  textShadow: '2px 2px 6px rgba(0,0,0,0.7), 0 0 12px rgba(139, 69, 19, 0.3)'
                }}>
              <span className="block text-red-200">
                Let's Chat
              </span>
              <span className="block text-amber-100 font-light">
                About Your Tree
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl mb-12 max-w-5xl mx-auto font-normal leading-relaxed drop-shadow-md"
               style={{
                 textShadow: '1px 1px 4px rgba(0,0,0,0.6), 0 0 8px rgba(139, 69, 19, 0.2)'
               }}>
              <span className="text-red-100 block mb-3 font-medium">
                Have questions? Need help choosing the perfect tree?
              </span>
              <span className="text-amber-50 block font-normal">
                We're here to make your Christmas dreams come true!
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative flex items-center">
                  Start Chatting
                  <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              </button>

              <a
                href="tel:551-235-6264"
                className="group px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-full hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </span>
              </a>
            </div>

            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { icon: '⚡', stat: '< 24h', label: 'Response Time' },
                { icon: '🌍', stat: '50+', label: 'States Served' },
                { icon: '📞', stat: '24/7', label: 'Support Available' },
                { icon: '⭐', stat: '4.9/5', label: 'Customer Rating' }
              ].map((item, index) => (
                <div key={index} className="text-center bg-black/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-sm text-emerald-200">{item.label}</div>
                </div>
              ))}
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

      {/* Interactive Offices Section */}
      <div className="py-20 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Our <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Locations</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Serving premium Christmas trees nationwide from our strategic locations
            </p>
          </div>

          {/* Office Selector */}
          <div className="flex flex-wrap justify-center mb-12 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {offices.map((office, index) => (
              <button
                key={index}
                onClick={() => setActiveOffice(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeOffice === index
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <span className="text-lg">
                  {index === 0 ? '🏢' : index === 1 ? '🌲' : '🚛'}
                </span>
                <span>{office.name}</span>
              </button>
            ))}
          </div>

          {/* Active Office Details */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Office Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{offices[activeOffice].name}</h3>
                  <p className="text-lg text-slate-600 mb-8">Your trusted partner for premium Christmas trees</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Address</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {offices[activeOffice].address}<br />
                        {offices[activeOffice].city}<br />
                        {offices[activeOffice].country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Phone</h4>
                      <a href={`tel:${offices[activeOffice].phone}`} className="text-slate-600 hover:text-emerald-600 transition-colors duration-200">
                        {offices[activeOffice].phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Email</h4>
                      <a href={`mailto:${offices[activeOffice].email}`} className="text-slate-600 hover:text-emerald-600 transition-colors duration-200">
                        {offices[activeOffice].email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Business Hours</h4>
                      <p className="text-slate-600">{offices[activeOffice].hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h3>
                  <p className="text-lg text-slate-600 mb-8">Choose your preferred way to reach us</p>
                </div>

                <div className="grid gap-4">
                  <a
                    href={`tel:${offices[activeOffice].phone}`}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl hover:from-emerald-100 hover:to-emerald-200/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Call Us Now</h4>
                        <p className="text-sm text-slate-600">Speak directly with our tree experts</p>
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-emerald-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>

                  <a
                    href={`mailto:${offices[activeOffice].email}`}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Email Us</h4>
                        <p className="text-sm text-slate-600">Get detailed information via email</p>
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>

                  <button
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">Send Message</h4>
                        <p className="text-sm text-slate-600">Fill out our contact form below</p>
                      </div>
                    </div>
                    <svg className="w-8 h-8 text-purple-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Contact Form */}
      <div id="contact-form" className="py-20 bg-slate-900/95 backdrop-blur-md text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent"></div>
          {[...Array(15)].map((_, i) => (
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

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Send Us a <span className="text-emerald-300">Message</span>
            </h2>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Ready to find your perfect Christmas tree? Get in touch with our experts today
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
            {submitStatus && (
              <div className={`p-6 mb-8 rounded-2xl border-2 ${
                submitStatus.success 
                  ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50/90 text-red-800 border-red-200'
              } backdrop-blur-sm`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    submitStatus.success ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {submitStatus.success ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      {submitStatus.success ? 'Message Sent Successfully!' : 'Error Sending Message'}
                    </h3>
                    <p>{submitStatus.message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subject Selection */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-white mb-3">
                  What can we help you with?
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="general" className="text-slate-900">General Inquiry</option>
                  <option value="trees" className="text-slate-900">Christmas Tree Selection</option>
                  <option value="delivery" className="text-slate-900">Delivery Information</option>
                  <option value="custom" className="text-slate-900">Custom Orders</option>
                  <option value="support" className="text-slate-900">Customer Support</option>
                </select>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-3">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-3">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-white mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-white mb-3">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-white mb-3">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 backdrop-blur-sm transition-all duration-200 resize-none"
                  placeholder="Tell us about your Christmas tree needs, preferred size, delivery location, or any questions you have..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative w-full flex justify-center items-center py-4 px-8 rounded-2xl text-lg font-semibold transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transform hover:-translate-y-1 shadow-2xl hover:shadow-emerald-500/25'
                  }`}
                >
                  {/* Background Shine Effect */}
                  {!isSubmitting && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                  
                  <div className="relative flex items-center">
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 mr-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        </div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </div>
                </button>
                
                {/* Trust Indicators */}
                <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-slate-300">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure & Private
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    24h Response Time
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Expert Support
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Alternative Contact Methods */}
          <div className="mt-12 text-center">
            <p className="text-slate-300 mb-6">Prefer to reach us directly?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:551-235-6264"
                className="group inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: 551-235-6264
              </a>
              <a
                href="mailto:sai@indkanworldwideexim.com"
                className="group inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
