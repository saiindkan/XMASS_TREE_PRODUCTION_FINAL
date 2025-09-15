"use client";

import type { ReactNode } from "react";
import "./globals.css";
import PromoBar from "../components/PromoBar";
import Navbar from "../components/Navbar";
import PressBar from "../components/PressBar";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { SessionProvider } from "../components/SessionProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Indkan Xmas Trees</title>
        <meta name="description" content="Premium American Christmas trees, wreaths, and decor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Google Pay API */}
        <script async src="https://pay.google.com/gp/p/js/pay.js"></script>
      </head>
      <body className="bg-white min-h-screen text-green-900 font-sans flex flex-col">
        <SessionProvider>
          <CartProvider>
            <div className="flex flex-col flex-grow">
              <PromoBar />
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <PressBar />
              <Footer />
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
