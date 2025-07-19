import { Shop } from '@/types/shop';

// Helper function to extract shop ID from shop object
export const getShopIdFromShop = (shop: Shop): string | null => {
  if (!shop) {
    return null;
  }
  
  // Extract shop id from the shop object
  const shopId = shop.id;
  
  if (!shopId) {
    console.warn('No shop id found in shop object:', shop);
    return null;
  }
  
  return shopId;
};