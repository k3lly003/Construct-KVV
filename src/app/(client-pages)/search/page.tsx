'use client';

import React from 'react';
import Head from 'next/head';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import GlobalSearch from '@/components/features/search/GlobalSearch';
import { useTranslations } from '@/app/hooks/useTranslations';

export default function SearchPage() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Search | Construct KVV</title>
        <meta
          name="description"
          content="Search for products, services, designs, and portfolios on Construct KVV"
        />
      </Head>

      <DefaultPageBanner
        title="Search Everything"
        backgroundImage="/store-img.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search Across All Categories
            </h2>
            <p className="text-gray-600">
              Find products, services, architectural designs, and professional portfolios all in one place
            </p>
          </div>

          <GlobalSearch
            placeholder="Search products, services, designs, portfolios..."
            showTypeFilters={true}
            className="mb-8"
          />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Products</h3>
              <p className="text-sm text-blue-700">
                Search construction materials, tools, and equipment
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Services</h3>
              <p className="text-sm text-green-700">
                Find professional construction services
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Designs</h3>
              <p className="text-sm text-purple-700">
                Browse architectural designs and plans
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-2">Portfolios</h3>
              <p className="text-sm text-amber-700">
                Explore professional work portfolios
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

