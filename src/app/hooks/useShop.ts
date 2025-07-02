import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShopService } from "@/app/services/shopServices";

// Define a custom AxiosError-like interface
interface CustomAxiosError {
  isAxiosError: boolean;
  response?: {
    status: number;
    data: unknown;
  };
  message: string;
}

// Custom isAxiosError function
const isAxiosError = (error: unknown): error is CustomAxiosError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as Record<string, unknown>).isAxiosError === true
  );
};

export const useShop = () => {
  const queryClient = useQueryClient();
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Mutation to create a shop
  const createShopMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!authToken) throw new Error("Not authenticated");
      return ShopService.createShop(data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  // Mutation to update a shop
  const updateShopMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      if (!authToken) throw new Error("Not authenticated");
      return ShopService.updateShop(id, data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myShop"] });
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });

  // Query to get the current user's shop
  const {
    data: myShop,
    isLoading: isMyShopLoading,
    error: myShopError,
  } = useQuery({
    queryKey: ["myShop"],
    queryFn: async () => {
      if (!authToken) return null;
      try {
        const shop = await ShopService.getMyShop(authToken);
        return shop || null;
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!authToken,
  });

  // Query to get all shops
  const {
    data: shops,
    isLoading: areShopsLoading,
    error: shopsError,
  } = useQuery({
    queryKey: ["shops"],
    queryFn: () => ShopService.getAllShops(),
    enabled: true,
  });

  return {
    createShop: createShopMutation.mutate,
    isCreating: createShopMutation.isPending,
    createError: createShopMutation.error,

    updateShop: updateShopMutation.mutate,
    isUpdating: updateShopMutation.isPending,
    updateError: updateShopMutation.error,

    myShop,
    isMyShopLoading,
    myShopError,

    shops,
    areShopsLoading,
    shopsError,
  };
};
