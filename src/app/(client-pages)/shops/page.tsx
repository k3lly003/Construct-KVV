"use client"

import type { NextPage } from 'next';
import ProfileCard from '../../(components)/supplier/SupplierCard';
import { useState } from 'react';
import CategoryServicesFilter from '../../(components)/sections/CategoriesServicesFilter';
import { profilesFakes, Profile } from '@/app/utils/fakes/shopsFakes';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';


const Page: NextPage = () => {


  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [serviceRange, setServiceRange] = useState<[number, number]>([0, 100000]); // Initial range
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(profilesFakes);

  const allCategories = Array.from(new Set(profilesFakes.map((p) => p.category))).map(
    (cat) => ({ label: cat, value: cat, count: profilesFakes.filter(p => p.category === cat).length })
  );

  const minServiceCost = Math.min(...profilesFakes.map((p) => p.serviceCost).filter((cost): cost is number => typeof cost === 'number'));
  const maxServiceCost = Math.max(...profilesFakes.map((p) => p.serviceCost).filter((cost): cost is number => typeof cost === 'number'));

  const handleCategoryChange = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
    filterProfiles(newCategories, serviceRange);
  };

  const handleServiceRangeChange = (newRange: [number, number]) => {
    setServiceRange(newRange);
    filterProfiles(selectedCategories, newRange);
  };

  const filterProfiles = (categories: string[], priceRange: [number, number]) => {
    let results = profilesFakes;

    if (categories.length > 0) {
      results = results.filter((profile) => categories.includes(profile.category));
    }

    results = results.filter(
      (profile) =>
        typeof profile.serviceCost === 'number' &&
        profile.serviceCost >= priceRange[0] &&
        profile.serviceCost <= priceRange[1]
    );

    setFilteredProfiles(results);
  };

  return (
    <>
    <DefaultPageBanner backgroundImage='/building.jpg' title='Available Shops'/>
    <section className="container max-w-7xl mx-auto py-10 flex">
      <div className="sticky top-4 w-1/4 pr-5">
        <h2 className="text-xl font-semibold mb-4">Filter</h2>
        <CategoryServicesFilter
          categories={allCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          minServiceCost={minServiceCost}
          maxServiceCost={maxServiceCost}
          currentServiceRange={serviceRange}
          onServiceRangeChange={handleServiceRangeChange}
        />
      </div>
      <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProfiles.map((profile, index) => (
          <ProfileCard key={index} {...profile} />
        ))}
      </div>
    </section>
    </>
  );
};

export default Page;