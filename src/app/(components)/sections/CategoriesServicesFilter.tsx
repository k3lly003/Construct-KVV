import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterOption {
  label: string;
  count: number;
  value: string;
}

interface CategoryServicesFilterProps {
  categories: FilterOption[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  minServiceCost: number;
  maxServiceCost: number;
  currentServiceRange: [number, number];
  onServiceRangeChange: (range: [number, number]) => void;
}

const CategoryServicesFilter: React.FC<CategoryServicesFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  minServiceCost,
  maxServiceCost,
  currentServiceRange,
  onServiceRangeChange,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const handleCategoryToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleServicesToggle = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const handleCategorySelect = (categoryValue: string) => {
    if (selectedCategories.includes(categoryValue)) {
      onCategoryChange(selectedCategories.filter((cat) => cat !== categoryValue));
    } else {
      onCategoryChange([...selectedCategories, categoryValue]);
    }
  };

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      onServiceRangeChange([value[0], value[1]]);
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Category Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={handleCategoryToggle}
        >
          <h3 className="font-semibold">Category</h3>
          <svg
            className={`w-4 h-4 transition-transform ${
              isCategoryOpen ? 'rotate-180' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isCategoryOpen && (
          <div>
            <div className="relative mb-2">
              <FaSearch className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search category ..."
                className="border border-gray-300 rounded-md pl-8 pr-2 py-1 w-full text-small"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              />
            </div>
            <ul className="max-h-48 overflow-y-auto text-small">
              {filteredCategories.map((category) => (
                <li
                  key={category.value}
                  className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCategorySelect(category.value)}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 rounded border-gray-300 focus:ring-indigo-500 h-4 w-4"
                      value={category.value}
                      checked={selectedCategories.includes(category.value)}
                      onChange={() => handleCategorySelect(category.value)}
                    />
                    {category.label}
                  </label>
                  <span className="text-gray-500">({category.count})</span>
                </li>
              ))}
              {filteredCategories.length === 0 && (
                <li className="py-1 text-gray-500 text-center">No categories found.</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Services Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={handleServicesToggle}
        >
          <h3 className="font-semibold">Services</h3>
          <svg
            className={`w-4 h-4 transition-transform ${
              isServicesOpen ? 'rotate-180' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isServicesOpen && (
          <div>
            <Slider
              range
              min={minServiceCost}
              max={maxServiceCost}
              value={currentServiceRange}
              onChange={handleSliderChange}
              className="mb-4"
            />
            <div className="flex justify-between text-small text-gray-600">
              <span>{currentServiceRange[0].toLocaleString('en-US', { style: 'currency', currency: 'SAR' })}</span>
              <span>{currentServiceRange[1].toLocaleString('en-US', { style: 'currency', currency: 'SAR' })}</span>
            </div>
            <div className="flex justify-between mt-2">
              <input
                type="number"
                className="border border-gray-300 rounded-md p-1 w-24 text-small"
                value={currentServiceRange[0]}
                onChange={(e) =>
                  onServiceRangeChange([
                    parseInt(e.target.value, 10) || minServiceCost,
                    currentServiceRange[1],
                  ])
                }
              />
              <span className="mx-2">-</span>
              <input
                type="number"
                className="border border-gray-300 rounded-md p-1 w-24 text-small"
                value={currentServiceRange[1]}
                onChange={(e) =>
                  onServiceRangeChange([
                    currentServiceRange[0],
                    parseInt(e.target.value, 10) || maxServiceCost,
                  ])
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Advanced Link (Optional) */}
      <div className="text-right text-small text-indigo-600">
        <a href="#advanced">Advanced</a>
      </div>
    </div>
  );
};

export default CategoryServicesFilter;