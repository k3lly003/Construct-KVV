import { useCallback } from 'react';
import { Category } from '@/types/category';
import { categoryService } from '@/app/services/productServices';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


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
      if (!authToken) toast.error("Not authenticated");
      const newCategory: Omit<Category, 'id'> = {
        name: name.trim(),
        description: description.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
        items: subCategories
          .map(sub => sub.trim())
          .filter(sub => sub !== '')
          .map(name => ({
            id: uuidv4(),
            name,
            description: '',
            slug: name.toLowerCase().replace(/\s+/g, '-'),
          })),
        dateCreated: new Date().toISOString(),
      };
      if (!authToken) {
        toast.error("No auth token");
      }
      return categoryService.createCategory(newCategory, authToken as string);
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

  const createCategory = useCallback(async (name: string, description: string, subCategories: string[]) => {
    return createCategoryMutation.mutateAsync({ name, description, subCategories });
  }, [createCategoryMutation]);

  const deleteCategory = useCallback(async (id: string) => {
    return deleteCategoryMutation.mutateAsync(id);
  }, [deleteCategoryMutation]);

  return {
    categories,
    isLoading: isLoading || createCategoryMutation.isPending || deleteCategoryMutation.isPending,
    error: error || createCategoryMutation.error || deleteCategoryMutation.error,
    createCategory,
    deleteCategory,
  };
}; 