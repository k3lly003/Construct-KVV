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
      console.log("🔍 useCustomerProfile: Token detected, waiting...");
      // Add a small delay to allow the backend to process the Google auth token
      const timer = setTimeout(() => {
        console.log("✅ useCustomerProfile: Token ready, making API call");
        setIsTokenReady(true);
      }, 1000); // 1 second delay

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
      // Retry up to 3 times with exponential backoff for auth-related errors
      if (failureCount < 3 && error?.message?.includes("credentials")) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
