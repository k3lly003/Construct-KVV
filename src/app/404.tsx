
"use client";

import Link from 'next/link';
import { Home, MessageCircle, Construction } from 'lucide-react';
import Navbar from '@/app/(components)/Navbar/Navigator';
import { Footer } from '@/app/(components)/footer/Footer';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-400 to-amber-600">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Construction Icon */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-2xl">
              <Construction className="w-16 h-16 text-white" />
            </div>
          </div>
          
          {/* 404 Error */}
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
            404
          </h1>
          
          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="group bg-white text-amber-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-amber-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 min-w-[160px] justify-center"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
            
            <Link 
              href="/contact"
              className="group bg-amber-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-amber-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 min-w-[160px] justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Contact
            </Link>
          </div>
          
          {/* Construction-themed decorative elements */}
          <div className="mt-12 flex justify-center space-x-4 opacity-30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}