import { Shop } from '@/types/shop';
import { Profile } from '@/app/utils/fakes/shopsFakes';

export const mapShopToProfile = (shop: Shop): Profile => {
  // Extract year from createdAt date
  const establishedYear = shop.createdAt 
    ? new Date(shop.createdAt).getFullYear().toString()
    : '2023';

  // Generate a random rating between 4.0 and 5.0 for demo purposes
  const rating = Math.floor(Math.random() * 10) / 10 + 4.0;

  // Generate a random number of photos for demo purposes
  const photosCount = Math.floor(Math.random() * 20) + 1;

  // Map shop category to a construction category
  const getCategory = (shopName: string): string => {
    const categories = [
      'Commercial Construction',
      'Residential Construction', 
      'Mixed Use Development',
      'Civil Engineering',
      'Roofing',
      'Eco-Friendly Construction',
      'Paving',
      'Steel Erection',
      'Plumbing',
      'Electrical'
    ];
    
    // Use shop name to deterministically assign a category
    const hash = shopName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return categories[Math.abs(hash) % categories.length];
  };

  // Generate a service cost based on category
  const getServiceCost = (category: string): number => {
    const costRanges: Record<string, [number, number]> = {
      'Commercial Construction': [40000, 80000],
      'Residential Construction': [20000, 40000],
      'Mixed Use Development': [30000, 60000],
      'Civil Engineering': [50000, 100000],
      'Roofing': [10000, 25000],
      'Eco-Friendly Construction': [35000, 70000],
      'Paving': [25000, 45000],
      'Steel Erection': [50000, 90000],
      'Plumbing': [8000, 20000],
      'Electrical': [10000, 25000]
    };
    
    const [min, max] = costRanges[category] || [15000, 50000];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const category = getCategory(shop.name);
  const serviceCost = getServiceCost(category);

  return {
    id: shop.id,
    name: shop.name,
    title: shop.description || `Professional ${category} services`,
    rating: parseFloat(rating.toFixed(1)),
    pictures: photosCount.toString(),
    since: establishedYear,
    imageSrc: '/store-img.jpg', // Use default image for now since logo might be File object
    category,
    serviceCost
  };
}; 