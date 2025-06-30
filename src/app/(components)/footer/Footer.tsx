import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

const constructionImages = [
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=300",
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Company Info */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <Image src='/kvv-logo.png' alt='kvv-logo' width={34} height={34} />
              <h2 className="text-2xl font-bold">kvv Ltd</h2>
            </div>

            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              <a href="#" className="block hover:text-yellow-400 transition-colors">About</a>
              <a href="#" className="block hover:text-yellow-400 transition-colors">Shop</a>
              <a href="#" className="block hover:text-yellow-400 transition-colors">Contact us</a>
              <a href="#" className="block hover:text-yellow-400 transition-colors">Terms & condition</a>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Reach out</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-yellow-400" />
                <div>
                  <p>KG 400 St</p>
                  <p>Kigali, Rwanda</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-6 w-6 text-yellow-400" />
                <div>
                  <p>+250 7888 507</p>
                  <p>+250 7888 600</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-yellow-400" />
                <a href="mailto:kvvltd@gmail.com" className="hover:text-yellow-400 transition-colors">kvvltd@gmail.com</a>
              </div>
              <a href="http://www.kvvltd.com/contact" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                www.kvvltd.com/contact
              </a>
            </div>
          </div>

          {/* Posts/Feeds */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Posts/Feeds</h3>
            <div className="grid grid-cols-2 gap-4">
              {constructionImages.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    width={100}
                    height={100}
                    alt={`Construction project ${index + 1}`}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-6 w-[350px]">
            <h3 className="text-xl font-semibold">About Us</h3>
            <div className="space-y-4">
              <p className="text-gray-400 text-md leading-relaxed">
                At <strong className='text-amber-300'>KVV Construction</strong>, we understand that successful projects require more than just quality tools. We supply top-tier construction equipment while offering professional services that complement every purchase. <br /><br />
                Our integrated approach means you get the right products backed by the expertise to use them effectively. From initial consultation to project completion, we&apos;re your trusted construction partner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-yellow-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-black text-center">
            Copyright ©2025 <a href="#" className="font-semibold hover:text-white transition-colors">KVVLtd</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};