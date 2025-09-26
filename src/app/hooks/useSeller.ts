import { useQuery, useMutation } from "@tanstack/react-query";
import {
  registerSeller,
  getSellerProfile,
  getMySellerProfile,
  getSellerOrders,
  updateSellerOrderStatus,
  getSellerDashboard,
  listSellers,
  getSellerRequests,
  SellerRegistrationData,
  SellerProfile,
} from "../services/sellerService";

interface SellerProfileApiResponse {
  success: boolean;
  data: SellerProfile;
}

export const useRegisterSeller = () => {
  return useMutation({
    mutationFn: async (data: SellerRegistrationData) => {
      return await registerSeller(data);
    },
  });
};

export const useSellerProfile = (sellerId?: string, token?: string) => {
  return useQuery<SellerProfile | undefined>({
    queryKey: ["sellerProfile", sellerId],
    queryFn: async () => {
      if (!sellerId || !token) return undefined;
      const response = await getSellerProfile(sellerId, token) as SellerProfileApiResponse;
      console.log("bbbbbbbbbbbbbb", response)
      return response.data;
    },
    enabled: !!sellerId && !!token,
  });
};

export const useMySellerProfile = (token?: string) => {
  return useQuery<SellerProfile | undefined>({
    queryKey: ["mySellerProfile"],
    queryFn: async () => {
      if (!token) return undefined;
      return await getMySellerProfile(token);
    },
    enabled: !!token,
  });
};

export const useSellerOrders = (token?: string) => {
  return useQuery({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      if (!token) return [];
      return await getSellerOrders(token);
    },
    enabled: !!token,
  });
};

export const useUpdateSellerOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ orderId, status, token }: { orderId: string; status: string; token: string }) => {
      return await updateSellerOrderStatus(orderId, status, token);
    },
  });
};

export const useSellerDashboard = (token?: string) => {
  return useQuery({
    queryKey: ["sellerDashboard"],
    queryFn: async () => {
      if (!token) return undefined;
      return await getSellerDashboard(token);
    },
    enabled: !!token,
  });
};

export const useListSellers = (token?: string) => {
  return useQuery({
    queryKey: ["listSellers"],
    queryFn: async () => await listSellers(token),
  });
};

export const useSellerRequests = (token?: string) => {
  return useQuery({
    queryKey: ["sellerRequests"],
    queryFn: async () => {
      if (!token) return [];
      return await getSellerRequests(token);
    },
    enabled: !!token,
  });
};
