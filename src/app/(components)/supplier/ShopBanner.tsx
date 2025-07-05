import React from 'react';
import { MapPin, Star, Shield, Truck, } from 'lucide-react';
import { Shop } from '@/types/shop';

interface ShopBannerProps {
  shop?: Shop;
}

export const ShopBanner: React.FC<ShopBannerProps> = ({ shop }) => {
  console.log('=== ShopBanner Component ===');
  console.log('Received shop prop:', shop);
  console.log('Shop name:', shop?.name);
  console.log('Shop seller:', shop?.seller);
  console.log('Shop seller businessName:', shop?.seller?.businessName);
  console.log('Shop seller businessAddress:', shop?.seller?.businessAddress);
  console.log('Shop seller email:', shop?.seller?.email);
  console.log('Shop phone:', shop?.phone);
  console.log('Shop createdAt:', shop?.createdAt);
  
  // Use actual shop data with fallbacks
  const shopInfo = {
    name: shop?.name || shop?.seller?.businessName || "Murenzi Construction Supply",
    location: shop?.seller?.businessAddress || "KG 400 St, Kigali, Rwanda", // Use seller business address
    rating: 4.8, // Default rating (could be added to shop model later)
    reviews: 256, // Default reviews count (could be added to shop model later)
    yearEstablished: shop?.createdAt ? new Date(shop.createdAt).getFullYear() : 2010,
    certifications: ["ISO 9001:2015", "Green Building Certified", "Safety First Partner"],
    responseTime: "24 hours",
    deliveryTime: "1hr - 3days",
    contact: {
      phone: shop?.phone || shop?.seller?.businessPhone || shop?.seller?.phone || "+250 7888 507",
      email: shop?.seller?.email || "sales@kvvltd.com", // Use seller email
      website: "www.kvvltd.com" // Default website
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-300 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{shopInfo.name}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{shopInfo.rating}</span>
                  <span className="ml-1 text-yellow-200">({shopInfo.reviews} reviews)</span>
                </div>
                <span className="text-yellow-200">•</span>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{shopInfo.location}</span>
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
                  <p className="text-sm text-yellow-200">Since {shopInfo.yearEstablished}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Fast Delivery</span>
                  </div>
                  <p className="text-sm text-yellow-200">{shopInfo.deliveryTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};