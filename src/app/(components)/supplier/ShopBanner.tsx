import React from 'react';
import { MapPin, Star, Shield, Truck } from 'lucide-react';
import { Shop } from '@/types/shop';
import { useSellerProfile } from '@/app/hooks/useSeller';
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';

interface ShopBannerProps {
  shop?: Shop | { data?: Shop };
}

export const ShopBanner: React.FC<ShopBannerProps> = ({ shop }) => {
  // Support both shop and shop.data as the source, but ensure type safety
  let realShop: Shop | undefined = undefined;
  if (shop) {
    if ('data' in shop && shop.data) {
      realShop = shop.data as Shop;
    } else if (
      typeof shop === 'object' &&
      'id' in shop &&
      'name' in shop &&
      'description' in shop &&
      'createdAt' in shop &&
      'seller' in shop
    ) {
      realShop = shop as Shop;
    }
  }

  const {
    logo,
    name,
    seller,
    phone,
    createdAt
  } = realShop || {};
  const productCount = (realShop && 'productsCount' in realShop) ? (realShop as any).productsCount : 0;
  const serviceCount = (realShop && 'servicesCount' in realShop) ? (realShop as any).servicesCount : 0;

  // Get sellerId for API
  const sellerId = seller?.id || seller?.sellerId;
  const token = (typeof window !== 'undefined') ? localStorage.getItem('token') || '' : '';
  const { data: sellerProfile, isLoading } = useSellerProfile(sellerId, token);
  // Use actual shop data with fallbacks, prefer API data if available
  const shopInfo = {
    logo: logo || seller?.logo || '',
    name: name || sellerProfile?.businessName || seller?.businessName || 'Murenzi Construction Supply',
    location: sellerProfile?.businessAddress || seller?.businessAddress || 'KG 400 St, Kigali, Rwanda',
    productCount: productCount,
    serviceCount: serviceCount,
    rating: 4.8, // Default rating (could be added to shop model later)
    reviews: 256, // Default reviews count (could be added to shop model later)
    yearEstablished: createdAt ? new Date(createdAt).getFullYear() : 2010,
    certifications: ['ISO 9001:2015', 'Green Building Certified', 'Safety First Partner'],
    responseTime: '24 hours',
    deliveryTime: '1hr - 3days',
    contact: {
      phone: sellerProfile?.businessPhone || phone || seller?.businessPhone || seller?.phone || '+250 7888 507',
      email: sellerProfile?.user?.email || seller?.email || 'sales@kvvltd.com',
      website: 'www.kvvltd.com', // Default website
    },
    status: sellerProfile?.status,
    taxId: sellerProfile?.taxId,
    commissionRate: sellerProfile?.commissionRate,
    payoutMethod: sellerProfile?.payoutMethod,
  };

  const { t } = useTranslations();

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-300 to-yellow-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className='flex justify-center items-center gap-2'>
                {shopInfo.logo && (
                  <img src={shopInfo.logo} alt="Shop Logo" className="h-16 w-16 rounded-full mb-2" />
                )}
                <h1 className="text-4xl font-bold mb-4">{shopInfo.name}</h1>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{shopInfo.rating}</span>
                  <span className="ml-1 text-yellow-200">({shopInfo.reviews} {t(dashboardFakes.shopbanner.reviews)})</span>
                </div>
                <span className="text-yellow-200">•</span>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{shopInfo.location}</span>
                </div>
              </div>
              <div className="flex gap-4 mb-2">
                <div>{t(dashboardFakes.shopbanner.products)}: <span className="font-bold">{shopInfo.productCount}</span></div>
                <div>{t(dashboardFakes.shopbanner.services)}: <span className="font-bold">{shopInfo.serviceCount}</span></div>
              </div>
              {/* Display extra seller info from API */}
              {sellerProfile && (
                <div className="mb-2 text-yellow-100 text-sm">
                  <div>{t(dashboardFakes.shopbanner.status)}: <span className="font-bold">{shopInfo.status}</span></div>
                  <div>{t(dashboardFakes.shopbanner.taxId)}: <span className="font-bold">{shopInfo.taxId}</span></div>
                  <div>{t(dashboardFakes.shopbanner.commissionRate)}: <span className="font-bold">{shopInfo.commissionRate ?? 'N/A'}</span></div>
                  <div>{t(dashboardFakes.shopbanner.payoutMethod)}: <span className="font-bold">{shopInfo.payoutMethod ?? 'N/A'}</span></div>
                  <div>{t(dashboardFakes.shopbanner.contactEmail)}: <span className="font-bold">{shopInfo.contact.email}</span></div>
                </div>
              )}
              <div className="flex space-x-4 mt-6">
                <button className="bg-white text-yellow-600 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors">
                  {t(dashboardFakes.shopbanner.contactSupplier)}
                </button>
                <a href="#catalogue" className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  {t(dashboardFakes.shopbanner.viewCatalog)}
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="font-semibold">{t(dashboardFakes.shopbanner.verifiedSupplier)}</span>
                  </div>
                  <p className="text-sm text-yellow-200">{t(dashboardFakes.shopbanner.since, { year: shopInfo.yearEstablished })}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Truck className="h-5 w-5 mr-2" />
                    <span className="font-semibold">{t(dashboardFakes.shopbanner.fastDelivery)}</span>
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
}