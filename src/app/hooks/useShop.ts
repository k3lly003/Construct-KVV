import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopService } from '@/app/services/shopServices';
import axios from 'axios';

export const useShop = () => {
  const queryClient = useQueryClient();
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Mutation to create a shop
  const createShopMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!authToken) throw new Error("Not authenticated");
      return ShopService.createShop(data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  // Mutation to update a shop
  const updateShopMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      if (!authToken) throw new Error("Not authenticated");
      return ShopService.updateShop(id, data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });

  // Query to get the current user's shop
  const { data: myShop, isLoading: isMyShopLoading, error: myShopError } = useQuery({
    queryKey: ['myShop'],
    queryFn: async () => {
      if (!authToken) return null;
      try {
        const shop = await ShopService.getMyShop(authToken);
        return shop || null; // Return null if no shop found
      } catch (error) {
        // If it's a 404 or no shops found, return null instead of throwing
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!authToken,
  });

  // Query to get all shops
  const { data: shops, isLoading: areShopsLoading, error: shopsError } = useQuery({
    queryKey: ['shops'],
    queryFn: () => ShopService.getAllShops(),
    enabled: true,
  });

  return {
    // Create Shop
    createShop: createShopMutation.mutate,
    isCreating: createShopMutation.isPending,
    createError: createShopMutation.error,
    
    // Update Shop
    updateShop: updateShopMutation.mutate,
    isUpdating: updateShopMutation.isPending,
    updateError: updateShopMutation.error,

    // Get My Shop
    myShop,
    isMyShopLoading,
    myShopError,

    // Get All Shops
    shops,
    areShopsLoading,
    shopsError,
  };
}; 