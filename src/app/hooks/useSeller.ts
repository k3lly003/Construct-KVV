import { useQuery, useMutation } from "@tanstack/react-query";
import { registerSeller, getSellerProfile, SellerRegistrationData, SellerProfile } from "../services/sellerService";

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
