import React from "react";
import { Search } from "lucide-react";
import { Shop } from '@/types/shop';

interface Product {
  id: string;
  name: string;
}

interface FilteredProductsProps {
  initialProducts: Product[];
  onSearchTermChange: (term: string) => void;
  searchTerm: string;
  shop?: Shop;
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  availableCategories: string[];
}

export const ProductFilters: React.FC<FilteredProductsProps> = ({
  onSearchTermChange,
  searchTerm,
  shop,
  selectedCategory,
  onSelectedCategoryChange,
  sortBy,
  onSortByChange,
  availableCategories,
}) => {
  
  const shopName = shop?.name || shop?.seller?.businessName || 'this shop';
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${shopName} products...`}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
