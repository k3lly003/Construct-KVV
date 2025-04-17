import React from 'react';
import { MapPin, Star, Shield, Truck, } from 'lucide-react';


interface Supplier {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  yearEstablished: number;
  certifications: string[];
  responseTime: string;
  deliveryTime: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
}

const supplierInfo: Supplier = {
  name: "Murenzi Construction Supply",
  location: "KG 400 St, Kigali, Rwanda",
  rating: 4.8,
  reviews: 256,
  yearEstablished: 2010,
  certifications: ["ISO 9001:2015", "Green Building Certified", "Safety First Partner"],
  responseTime: "24 hours",
  deliveryTime: "1hr - 3days",
  contact: {
    phone: "+250 7888 507",
    email: "sales@kvvltd.com",
    website: "www.kvvltd.com"
  }
};

export const ShopBanner: React.FC = () => {

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-300 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{supplierInfo.name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{supplierInfo.rating}</span>
                  <span className="ml-1 text-yellow-200">({supplierInfo.reviews} reviews)</span>
                </div>
                <span className="text-yellow-200">•</span>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{supplierInfo.location}</span>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button className="bg-white text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors">
                  Contact Supplier
                </button>
                <a href="#catalogue"className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  View Catalog
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Verified Supplier</span>
                  </div>
                  <p className="text-sm text-yellow-200">Since {supplierInfo.yearEstablished}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Fast Delivery</span>
                  </div>
                  <p className="text-sm text-yellow-200">{supplierInfo.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};