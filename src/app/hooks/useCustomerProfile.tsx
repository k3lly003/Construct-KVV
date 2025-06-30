import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerProfileService } from '@/app/services/customerProfileServices';

export const useCustomerProfile = () => {
  const queryClient = useQueryClient();
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Fetch current user profile (only if authenticated)
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: () => authToken ? customerProfileService.getMyProfile(authToken) : Promise.resolve(null),
    enabled: !!authToken,
  });

  // Update profile (with FormData for image upload)
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!authToken) throw new Error("Not authenticated");
      return customerProfileService.updateMyProfile(data, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
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