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

  // Get main (parent) categories, excluding "Deals"
  const mainCategories = categories.filter(
    cat => (!cat.parentId || cat.parentId === null || cat.parentId === "") && cat.name.toLowerCase() !== 'deals'
  );

  // Get subcategories for each main category
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

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
          {mainCategories.map(mainCat => {
            const subcategories = getSubcategories(mainCat.id);
            
            return (
              <DropdownMenuSub key={mainCat.id}>
                <DropdownMenuSubTrigger>
                  {mainCat.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {/* Subcategory options */}
                  {subcategories.map(subCat => (
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
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategorySelect; 