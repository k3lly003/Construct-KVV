import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerProfileService } from "@/app/services/customerProfileServices";
import { useEffect, useState } from "react";

export const useCustomerProfile = () => {
  const queryClient = useQueryClient();
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const [isTokenReady, setIsTokenReady] = useState(false);

  // Add a small delay to ensure the token is fully processed
  useEffect(() => {
    if (authToken) {
      console.log("🔍 useCustomerProfile: Token detected, setting up delay...");
      // Add a small delay to allow the backend to process the Google auth token
      const timer = setTimeout(() => {
        console.log("✅ useCustomerProfile: Token ready, enabling API call");
        setIsTokenReady(true);
      }, 2000); // Increased to 2 seconds delay

      return () => clearTimeout(timer);
    } else {
      console.log("❌ useCustomerProfile: No token found");
      setIsTokenReady(false);
    }
  }, [authToken]);

  // Fetch current user profile (only if authenticated and token is ready)
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customerProfile"],
    queryFn: () =>
      authToken
        ? customerProfileService.getMyProfile(authToken)
        : Promise.resolve(null),
    enabled: !!authToken && isTokenReady,
    retry: (failureCount, error) => {
      console.log(
        `🔄 useCustomerProfile: Retry attempt ${failureCount}`,
        error
      );
      // Retry up to 3 times with exponential backoff for auth-related errors
      if (failureCount < 3) {
        // Retry for any error initially, as Google auth might need time to process
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(2000 * 2 ** attemptIndex, 10000); // Start with 2s, max 10s
      console.log(`⏰ useCustomerProfile: Retry delay ${delay}ms`);
      return delay;
    },
  });

  // Update profile (with FormData for image upload)
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!authToken) throw new Error("Not authenticated");
      return customerProfileService.updateMyProfile(data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });

  return {
    profile,
    isLoading: isLoading || updateProfileMutation.isPending,
    error: error || updateProfileMutation.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
