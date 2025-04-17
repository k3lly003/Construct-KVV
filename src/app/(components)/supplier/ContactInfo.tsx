"use client";

import React, { useState } from 'react';
import { Phone, Mail, Clock, BadgeCheck } from 'lucide-react';

interface Certification {
  name: string;
  url?: string;
}

interface Supplier {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  yearEstablished: number;
  certifications: Certification[];
  responseTime: string;
  deliveryTime: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

const supplierInfo: Supplier = {
  name: "KVV Construction Supply",
  location: "KG 400 St, Kigali, Rwanda",
  rating: 4.8,
  reviews: 256,
  yearEstablished: 2010,
  certifications: [
    { name: "ISO 9001:2015", url: "https://www.iso.org/standard/62913.html" },
    { name: "Green Building Certified", url: "https://www.usgbc.org/" },
    { name: "Safety First Partner", url: "https://www.usgbc.org/" },
    { name: "Rwanda Standards Board Certified", url: "https://www.rsb.gov.rw/" },
  ],
  responseTime: "24 hours",
  deliveryTime: "5hrs -3days",
  contact: {
    phone: "+250 7888 507",
    email: "sales@kvvltd.com",
    website: "www.kvvltd.com"
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

export const ContactInfo: React.FC = () => {
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
                <a href={`tel:${supplierInfo.contact.phone}`} className="text-yellow-500 hover:underline">
                  {supplierInfo.contact.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <a href={`mailto:${supplierInfo.contact.email}`} className="text-yellow-500 hover:underline">
                  {supplierInfo.contact.email}
                </a>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <p>Response time: <span className='text-yellow-500 font-semibold'>{supplierInfo.responseTime}</span></p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Certifications</h3>
            <div className="space-y-2">
              {supplierInfo.certifications.map((cert, index) => (
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