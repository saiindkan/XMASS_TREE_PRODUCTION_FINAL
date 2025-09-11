"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const closeMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-white/20 z-50 shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center space-x-3 group" onClick={closeMenus}>
          <div className="relative w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-sm border border-white/20">
            <Image
              src="/BRAND LOGO.png"
              alt="Indkan Xmas Trees Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="text-slate-900 font-bold text-2xl tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
            Indkan Xmas Trees
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/products" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/decors" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            Decors
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/deals" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            Deals
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200 relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
          
          {status === 'authenticated' ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors duration-200 border border-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {session.user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline text-slate-700 font-medium">{session.user?.name || 'Account'}</span>
                <svg className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-2 z-50">
                  <Link href="/account" className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200" onClick={closeMenus}>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Account
                  </Link>
                  <Link href="/orders" className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200" onClick={closeMenus}>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  <div className="border-t border-slate-200 my-2"></div>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); closeMenus(); }} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200" onClick={closeMenus}>Sign In</Link>
              <Link href="/auth/signup" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25" onClick={closeMenus}>Sign Up</Link>
            </div>
          )}
          
          <Link href="/cart" className="relative group p-2 hover:bg-slate-100 rounded-full transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-700 group-hover:text-emerald-600 transition-colors duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse min-w-[20px] text-center">{count}</span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link href="/cart" className="relative mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{count}</span>
            )}
          </Link>
          <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div onClick={closeMenus} className={`fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div onClick={(e) => e.stopPropagation()} className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-11/12 max-w-sm p-8 text-center border border-white/20">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>Home</Link>
            <Link href="/products" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>Shop</Link>
            <Link href="/decors" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>Decors</Link>
            <Link href="/deals" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>Deals</Link>
            <Link href="/about" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>About</Link>
            <Link href="/contact" className="text-lg font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 py-2" onClick={closeMenus}>Contact</Link>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              {status === 'authenticated' ? (
                <div className="space-y-4">
                   <div>
                    <div className="font-bold text-gray-800">{session.user?.name}</div>
                    <div className="text-sm text-gray-500">{session.user?.email}</div>
                  </div>
                  <Link href="/account" className="block text-lg font-medium text-gray-700 hover:text-green-600" onClick={closeMenus}>My Account</Link>
                  <Link href="/orders" className="block text-lg font-medium text-gray-700 hover:text-green-600" onClick={closeMenus}>My Orders</Link>
                  <button onClick={() => { signOut({ callbackUrl: '/' }); closeMenus(); }} className="w-full text-lg font-medium text-gray-700 hover:text-green-600">Sign Out</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/signin" className="block w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors" onClick={closeMenus}>Sign In</Link>
                  <Link href="/auth/signup" className="block w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition-colors" onClick={closeMenus}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </nav>
  );
}
