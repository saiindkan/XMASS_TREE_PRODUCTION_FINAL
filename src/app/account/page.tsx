'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      setIsVisible(true);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=2000&q=80)',
          }}
        ></div>
        
        {/* Black Tint Overlay covering entire background */}
        <div className="absolute inset-0 bg-black/70 w-full h-full"></div>
        
        <div className="relative text-center bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/30">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-400/30 border-t-green-400 mx-auto mb-4"></div>
          <div className="mb-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white">
              🎄 Christmas Collection 2025
            </span>
          </div>
          <p className="text-gray-700 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=2000&q=80)',
        }}
      ></div>
      
      {/* Black Tint Overlay covering entire background */}
      <div className="absolute inset-0 bg-black/70 w-full h-full"></div>

      <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Premium Header Section */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-12">
              {/* Premium Christmas Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-green-600 text-white text-sm font-semibold mb-6 shadow-lg">
                <span className="text-green-100 mr-2">🎄</span>
                <span className="w-2 h-2 bg-green-200 rounded-full mr-2 animate-pulse"></span>
                Christmas Collection 2025 • Premium Member
              </div>

              {/* Welcome Message */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                <span className="block text-green-100">
                  Welcome Back,
                </span>
                <span className="block text-green-200 font-light">
                  {session.user?.name?.split(' ')[0] || 'Friend'}
                </span>
              </h1>

              <p className="text-lg text-white/90 mb-8 drop-shadow-md">
                Your Christmas account dashboard
              </p>

              {/* Sign Out Button - Simple Style */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>


          </div>

          {/* Profile Content Section */}
            <div className="bg-white rounded-xl p-8 mb-8 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-3xl text-white font-bold mr-6 shadow-lg">
                  {session.user?.name?.charAt(0) || '🎄'}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Information</h2>
                  <p className="text-gray-600 text-lg">Your account details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Full Name</h3>
                      <p className="text-gray-600 text-base">{session.user?.name || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600 text-base break-all">{session.user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-yellow-600 text-xl">⭐</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Account Type</h3>
                      <p className="text-gray-600 text-base">
                        {session.user?.email === 'admin@indkanworldwideexim.com' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-xl">📅</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Member Since</h3>
                      <p className="text-gray-600 text-base">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


        </div>
      </div>
    </div>
  );
}
