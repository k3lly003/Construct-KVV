import { useCallback } from 'react';
import { customerRequestService } from '@/app/services/customerRequestService';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCustomerRequest = () => {
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const createSellerRequestMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      businessName: string;
      businessAddress: string;
      businessPhone: string;
      taxId: string;
    }) => {
      if (!authToken) {
        toast.error("Not authenticated");
        throw new Error("Not authenticated");
      }
      return customerRequestService.requestToBecomeSeller(data, authToken);
    },
    onSuccess: () => {
      toast.success('Seller request submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit seller request');
    }
  });

  const createSellerRequest = useCallback(async (data: {
    email: string;
    businessName: string;
    businessAddress: string;
    businessPhone: string;
    taxId: string;
  }) => {
    return createSellerRequestMutation.mutateAsync(data);
  }, [createSellerRequestMutation]);

  return {
    createSellerRequest,
    isLoading: createSellerRequestMutation.isPending,
    error: createSellerRequestMutation.error,
  };
}; 