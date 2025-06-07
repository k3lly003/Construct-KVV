import React from "react";
import { Search } from "lucide-react";
import { categories } from "@/app/utils/fakes/ProductFakes";

interface Product {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  // Add other product properties as needed
}

interface FilteredProductsProps {
  initialProducts: Product[];
  onSearchTermChange: (term: string) => void;
  searchTerm: string;
  onSelectedCategoryChange: (category: string) => void;
  selectedCategory: string;
  onSortByChange: (sortByOption: string) => void;
  sortBy: string;
  availableCategories: string[]; // Add this prop
}

export const ProductFilters: React.FC<FilteredProductsProps> = ({
  onSearchTermChange,
  searchTerm,
  onSelectedCategoryChange,
  selectedCategory,
  onSortByChange,
  sortBy,
  availableCategories,
}) => {
  const {} = categories;
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => onSelectedCategoryChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="All Products">All Products</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
};
