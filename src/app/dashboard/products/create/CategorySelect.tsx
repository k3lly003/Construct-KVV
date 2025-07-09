import { useCategories } from "@/app/hooks/useCategories";
import React from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { GenericButton } from "@/components/ui/generic-button";
import { ChevronDown } from "lucide-react";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const { categories, isLoading, error } = useCategories();

  if (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred');
  }

  // Only get the 'Product' main category
  const productMainCategory = categories.find(
    cat => (!cat.parentId || cat.parentId === null || cat.parentId === "") && cat.name.toLowerCase() === 'product'
  );

  // Get subcategories for the 'Product' main category
  const productSubcategories = productMainCategory
    ? categories.filter(cat => cat.parentId === productMainCategory.id)
    : [];

  // Get the display name for the selected value
  const getSelectedDisplayName = () => {
    if (!value) return "Select category";
    const selectedCategory = categories.find(cat => cat.id === value);
    return selectedCategory ? selectedCategory.name : "Select category";
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Category</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <GenericButton 
            variant="outline" 
            className="w-[200px] rounded-lg justify-between"
            disabled={isLoading}
          >
            {getSelectedDisplayName()}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </GenericButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px]">
          {productMainCategory && (
            <DropdownMenuSub key={productMainCategory.id}>
              <DropdownMenuSubTrigger>
                {productMainCategory.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {/* Subcategory options */}
                {productSubcategories.map(subCat => (
                  <DropdownMenuItem 
                    key={subCat.id}
                    onClick={() => onChange(subCat.id)}
                    className={value === subCat.id ? "bg-accent" : ""}
                  >
                    {subCat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ServiceCategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const { categories, isLoading, error } = useCategories();

  if (error) {
    toast.error(error instanceof Error ? error.message : 'An error occurred');
  }

  // Only get the 'Services' main category
  const serviceMainCategory = categories.find(
    cat => (!cat.parentId || cat.parentId === null || cat.parentId === "") && cat.name.toLowerCase() === 'services'
  );

  // Get subcategories for the 'Services' main category
  const serviceSubcategories = serviceMainCategory
    ? categories.filter(cat => cat.parentId === serviceMainCategory.id)
    : [];

  // Get the display name for the selected value
  const getSelectedDisplayName = () => {
    if (!value) return "Select category";
    const selectedCategory = categories.find(cat => cat.id === value);
    return selectedCategory ? selectedCategory.name : "Select category";
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <GenericButton 
            variant="outline" 
            className="w-[200px] rounded-lg justify-between"
            disabled={isLoading}
          >
            {getSelectedDisplayName()}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </GenericButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[200px]">
          {serviceMainCategory && (
            <DropdownMenuSub key={serviceMainCategory.id}>
              <DropdownMenuSubTrigger>
                {serviceMainCategory.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {/* Subcategory options */}
                {serviceSubcategories.map(subCat => (
                  <DropdownMenuItem 
                    key={subCat.id}
                    onClick={() => onChange(subCat.id)}
                    className={value === subCat.id ? "bg-accent" : ""}
                  >
                    {subCat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { ServiceCategorySelect };

export default CategorySelect; 