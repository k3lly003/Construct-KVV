import React from "react";
import { Search } from "lucide-react";
import { ChevronDown, List } from "lucide-react";
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
}) => {
  
  const shopName = shop?.name || shop?.seller?.businessName || 'this shop';
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 items-center w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${shopName} ${selectedCategory.toLowerCase()}s...`}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
           {/* Category Dropdown */}
           {/* <div className="relative">
            <button
              type="button"
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <List className="w-5 h-5 mr-2 text-gray-500" />
              <span>{selectedCategory === "Service" ? "Serives" : "Product"}</span>
              <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
            </button>
            <select
              value={selectedCategory}
              onChange={e => onSelectedCategoryChange(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            >
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div> */}
        </div>
      </div>
    </div>
  );
};
