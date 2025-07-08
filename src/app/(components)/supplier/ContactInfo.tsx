"use client";

import React, { useState } from 'react';
import { Phone, Mail, Clock, BadgeCheck } from 'lucide-react';
import type { Shop } from '@/types/shop';


interface ContactInfoProps {
  shop?: Shop;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ shop }) => {
  
  // Use actual shop data with fallbacks
  const shopInfo = {
    name: shop?.name || shop?.seller?.businessName || "KVV Construction Supply",
    location: shop?.seller?.businessAddress || "KG 400 St, Kigali, Rwanda", // Use seller business address
    rating: 4.8, // Default rating (could be added to shop model later)
    reviews: 256, // Default reviews count (could be added to shop model later)
    yearEstablished: shop?.createdAt ? new Date(shop.createdAt).getFullYear() : 2010,
    certifications: [
      { name: "ISO 9001:2015", url: "https://www.iso.org/standard/62913.html" },
      { name: "Green Building Certified", url: "https://www.usgbc.org/" },
      { name: "Safety First Partner", url: "https://www.usgbc.org/" },
      { name: "Rwanda Standards Board Certified", url: "https://www.rsb.gov.rw/" },
    ],
    responseTime: "24 hours",
    deliveryTime: "5hrs -3days",
    contact: {
      phone: shop?.phone || shop?.seller?.businessPhone || shop?.seller?.phone || "+250 7888 507",
      email: shop?.seller?.email || "sales@kvvltd.com", // Use seller email
      website: "www.kvvltd.com" // Default website
    }
  };

const categories = [
  'All Products',
  'Building Materials',
  'Tools & Equipment',
  'Safety Gear',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Finishing Materials'
];

  const [selectedCategory, setSelectedCategory] = useState('All Products');

  return (
    <div className="px-4 sm:px-6 lg:px-5 py-1 w-[35%]">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 bg-yellow">
        <div className="space-y-5">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <a href={`tel:${shopInfo.contact.phone}`} className="text-yellow-500 hover:underline">
                  {shopInfo.contact.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <a href={`mailto:${shopInfo.contact.email}`} className="text-yellow-500 hover:underline">
                  {shopInfo.contact.email}
                </a>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <p>Response time: <span className='text-yellow-500 font-semibold'>{shopInfo.responseTime}</span></p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Certifications</h3>
            <div className="space-y-2">
              {shopInfo.certifications.map((cert, index) => (
                <div key={index} className="flex items-center">
                  <BadgeCheck className="h-5 w-5 text-green-500 mr-2" />
                  {cert.url ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-yellow-500">
                      {cert.name}
                    </a>
                  ) : (
                    <span>{cert.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex flex-col w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-yellow-50 text-yellow-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};