import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { CategoryOption } from '@/app/utils/fakes/categories';

interface CategorySelectorProps {
  categories: CategoryOption[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onChange
}) => {
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Select Your Expertise</h3>
        <p className="text-slate-600">Choose one or more categories that match your skills</p>
        <p className="text-sm text-emerald-600 font-medium mt-1">
          Selected: {selectedCategories.length} categories
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-[1.02] ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 transition-colors duration-200 ${
                  isSelected ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {isSelected ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold transition-colors duration-200 ${
                    isSelected ? 'text-emerald-800' : 'text-slate-800'
                  }`}>
                    {category.label}
                  </h4>
                  <p className={`text-sm mt-1 transition-colors duration-200 ${
                    isSelected ? 'text-emerald-700' : 'text-slate-600'
                  }`}>
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};