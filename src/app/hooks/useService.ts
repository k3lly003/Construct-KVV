import { useCallback } from 'react';
import { Service } from '@/types/service';
import { serviceService } from '@/app/services/serviceServices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// type CreateServiceInput = Omit<Service, 'id' | 'createdAt'>;

export const useServices = () => {
  const queryClient = useQueryClient();
  const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
  });

  const createServiceMutation = useMutation({
    mutationFn: async ({ shopId, formData }: { shopId: string, formData: FormData }) => {
      if (!authToken) {
        toast.error("Not authenticated");
        throw new Error("Not authenticated");
      }
      return serviceService.createService(shopId, formData, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success("Service created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create service.");
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!authToken) throw new Error("Not authenticated");
      return serviceService.deleteService(id, authToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success("Service deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete service.");
    }
  });

  const createService = useCallback(async (shopId: string, formData: FormData) => {
    return createServiceMutation.mutateAsync({ shopId, formData });
  }, [createServiceMutation]);

  const deleteService = useCallback(async (id: string) => {
    return deleteServiceMutation.mutateAsync(id);
  }, [deleteServiceMutation]);

  return {
    services,
    isLoading: isLoading || createServiceMutation.isPending || deleteServiceMutation.isPending,
    error: error || createServiceMutation.error || deleteServiceMutation.error,
    createService,
    deleteService,
  };
}; 