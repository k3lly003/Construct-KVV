import { useCallback } from 'react';
// import { Category } from '@/types/category';
import { categoryService } from '@/app/services/categoryServices';
// import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



export const useCategories = () => {
  const queryClient = useQueryClient();
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async ({ 
      name, 
      description,
      subCategories
    }: { 
      name: string; 
      description: string;
      subCategories: string[];
    }) => {
      if (!authToken) throw new Error("Not authenticated");

      // 1. Create the parent category
      const parentCategory = await categoryService.createCategory({
        name: name.trim(),
        description: description.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        parentId: "",
        dateCreated: new Date().toISOString(),
      }, authToken);

      // 2. Create each subcategory with parentId = parentCategory.id
      await Promise.all(
        subCategories
          .map(sub => sub.trim())
          .filter(sub => sub !== '')
          .map(subName =>
            categoryService.createCategory({
              name: subName,
              description: '', // or allow user to enter description for subcategory
              slug: subName.toLowerCase().replace(/\s+/g, '-'),
              parentId: parentCategory.id,
              dateCreated: new Date().toISOString(),
            }, authToken)
          )
      );

      return parentCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!authToken) throw new Error("Not authenticated");
      return categoryService.deleteCategory(id, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const getCategoryByIdMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!authToken) throw new Error("Not authenticated");
      return categoryService.getCategoryById(id, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const createCategory = useCallback(async (name: string, description: string, subCategories: string[]) => {
    return createCategoryMutation.mutateAsync({ name, description, subCategories });
  }, [createCategoryMutation]);

  const deleteCategory = useCallback(async (id: string) => {
    return deleteCategoryMutation.mutateAsync(id);
  }, [deleteCategoryMutation]);

  const getCategoryById = useCallback(async (id: string) => {
    return getCategoryByIdMutation.mutateAsync(id);
  }, [getCategoryByIdMutation]);

  return {
    categories,
    isLoading: isLoading || createCategoryMutation.isPending || deleteCategoryMutation.isPending || getCategoryByIdMutation.isPending,
    error: error || createCategoryMutation.error || deleteCategoryMutation.error || getCategoryByIdMutation.error,
    createCategory,
    deleteCategory,
    getCategoryById
  };
}; 