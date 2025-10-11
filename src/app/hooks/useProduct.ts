import { useCallback } from 'react';
import { productService } from '@/app/services/productServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProducts = () => {
  const queryClient = useQueryClient();
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Fetch all products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
  });

  // Create product
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!authToken) {
        toast.error("Not authenticated");
        throw new Error("Not authenticated");
      }
      return productService.createProduct(formData, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully');
    },
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      if (!authToken) {
        toast.error("Not authenticated");
        throw new Error("Not authenticated");
      }
      return productService.updateProduct(id, formData, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!authToken) throw new Error("Not authenticated");
      return productService.deleteProduct(id, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
  });

  // Get product by id
  const getProductById = useCallback(async (id: string) => {
    return productService.getProductById(id);
  }, []);

  // Get product by slug
  const getProductBySlug = useCallback(async (slug: string) => {
    return productService.getProductBySlug(slug);
  }, []);

  // Get products by seller id
  const getProductsBySellerId = useCallback(async (sellerId: string) => {
    if (!authToken) throw new Error("Not authenticated");
    return productService.getProductsBySellerId(sellerId, authToken);
  }, [authToken]);

  // Get my products (authenticated seller's products)
  const getMyProducts = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!authToken) throw new Error("Not authenticated");
    return productService.getMyProducts(authToken, page, limit);
  }, [authToken]);

  const createProduct = useCallback(async (formData: FormData) => {
    return createProductMutation.mutateAsync(formData);
  }, [createProductMutation]);

  const updateProduct = useCallback(async (id: string, formData: FormData) => {
    return updateProductMutation.mutateAsync({ id, formData });
  }, [updateProductMutation]);

  const deleteProduct = useCallback(async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  }, [deleteProductMutation]);

  return {
    products,
    isLoading: isLoading || createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending,
    error: error || createProductMutation.error || updateProductMutation.error || deleteProductMutation.error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductBySlug,
    getProductsBySellerId,
    getMyProducts,
  };
}; 