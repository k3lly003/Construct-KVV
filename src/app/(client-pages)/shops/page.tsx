"use client"

import type { NextPage } from 'next';
import ShopCard from '@/app/(components)/supplier/SupplierCard';
import { useState, useMemo, useEffect } from 'react';
import CategoryServicesFilter from '@/app/(components)/sections/CategoriesServicesFilter';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import { mapShopToProfile } from '@/app/utils/mappers/shopMapper';
import { ShopService } from '@/app/services/shopServices';
import { Shop } from '@/types/shop';
import { ShopSkeleton } from '@/app/utils/skeleton/Shop';

const Page: NextPage = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [serviceRange, setServiceRange] = useState<[number, number]>([0, 100000]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all shops using shopService
  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ShopService.getAllShops();
      // Ensure data is always an array
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shops');
      console.error('Error fetching shops:', err);
      setShops([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a specific shop by ID (for future use)
  // const fetchShopById = async (id: string) => {
  //   try {
  //     const shop = await ShopService.getShopById(id);
  //     return shop;
  //   } catch (err) {
  //     console.error('Error fetching shop by ID:', err);
  //     throw err;
  //   }
  // };

  useEffect(() => {
    fetchShops();
  }, []);

  // Transform shops data to profiles format
  const profiles = useMemo(() => {
    if (!shops || !Array.isArray(shops)) return [];
    const mappedProfiles = shops.map(mapShopToProfile);
    console.log('Available shop IDs:', mappedProfiles.map(p => p.id));
    return mappedProfiles;
  }, [shops]);

  // Filter profiles based on selected categories and service range
  const filteredProfiles = useMemo(() => {
    let results = profiles;

    // Search filter
    if (searchTerm.trim()) {
      results = results.filter(profile =>
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((profile) => selectedCategories.includes(profile.category));
    }

    // Service range filter
    results = results.filter(
      (profile) =>
        typeof profile.serviceCost === 'number' &&
        profile.serviceCost >= serviceRange[0] &&
        profile.serviceCost <= serviceRange[1]
    );

    return results;
  }, [profiles, searchTerm, selectedCategories, serviceRange]);

  // Get all available categories from the profiles
  const allCategories = useMemo(() => {
    const categories = Array.from(new Set(profiles.map((p) => p.category)));
    return categories.map((cat) => ({ 
      label: cat, 
      value: cat, 
      count: profiles.filter(p => p.category === cat).length 
    }));
  }, [profiles]);

  // Calculate min and max service costs
  const { minServiceCost, maxServiceCost } = useMemo(() => {
    const costs = profiles.map((p) => p.serviceCost).filter((cost): cost is number => typeof cost === 'number');
    return {
      minServiceCost: costs.length > 0 ? Math.min(...costs) : 0,
      maxServiceCost: costs.length > 0 ? Math.max(...costs) : 100000
    };
  }, [profiles]);

  const handleCategoryChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
  };

  const handleServiceRangeChange = (newRange: [number, number]) => {
    setServiceRange(newRange);
  };

  if (error) {
    return (
      <>
        <DefaultPageBanner backgroundImage='/building.jpg' title='Available Shops'/>
        <div className="container max-w-7xl mx-auto py-10 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Shops</h3>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={fetchShops}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }


  return (
    <>
      <DefaultPageBanner backgroundImage='/building.jpg' title='Available Shops'/>
      <section className="container max-w-7xl mx-auto py-10 flex">
        <div className="w-full">
          <div className="mb-6 flex justify-center p-4 mb-6 bg-white rounded-xl shadow-sm">
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-10">
              <ShopSkeleton/>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProfiles.map((profile, index) => (
                <ShopCard key={index} {...profile} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;