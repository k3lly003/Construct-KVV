import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bidService } from '../services/bidService';
import { Bid, CreateBidDTO } from '@/types/bid';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const useBids = () => {
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      setAuthToken(token);
    }
  }, []);

  const createBidMutation = useMutation({
    mutationFn: async (bidData: CreateBidDTO) => {
      if (!authToken) throw new Error("Not authenticated");
      if (!isClient) throw new Error("Not on client side");
      
      try {
        const result = await bidService.createBid(bidData, authToken);
        return result;
      } catch (error) {
        console.error('Failed to create bid:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sellerBids'] });
      queryClient.invalidateQueries({ queryKey: ['projectBids', data.finalProjectId] });
      toast.success("Bid created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create bid. Please try again.");
      console.error("Error creating bid:", error);
    }
  });

  const createBid = useCallback(async (bidData: CreateBidDTO) => {
    if (!isClient) {
      throw new Error("Cannot create bid on server side");
    }
    return createBidMutation.mutateAsync(bidData);
  }, [createBidMutation, isClient]);

  const useBidDetails = useCallback((bidId: string, initialData?: Bid) => {
    // Pre-populate cache with initial data if provided
    useEffect(() => {
      if (initialData && bidId && isClient) {
        queryClient.setQueryData(['bidDetails', bidId], initialData);
      }
    }, [initialData, bidId, isClient]);

    return useQuery<Bid, Error>({
      queryKey: ['bidDetails', bidId],
      queryFn: async () => {
        if (!authToken) throw new Error("Not authenticated");
        if (!isClient) throw new Error("Not on client side");
        
        try {
          const result = await bidService.getBidById(bidId, authToken);
          return result;
        } catch (error) {
          console.error('Failed to fetch bid details:', error);
          throw error;
        }
      },
      enabled: !!bidId && !!authToken && isClient,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        if (error.message === "Not authenticated") return false;
        if (error.message === "Not on client side") return false;
        return failureCount < 2;
      },
      initialData: initialData,
      refetchOnMount: !initialData,
    });
  }, [authToken, isClient, queryClient]);

  const useProjectBids = useCallback((projectId: string) => {
    return useQuery<Bid[], Error>({
      queryKey: ['projectBids', projectId],
      queryFn: async () => {
        if (!authToken) throw new Error("Not authenticated");
        if (!isClient) throw new Error("Not on client side");
        
        try {
          const result = await bidService.getProjectBids(projectId, authToken);
          return result;
        } catch (error) {
          console.error('Failed to fetch project bids:', error);
          throw error;
        }
      },
      enabled: !!projectId && !!authToken && isClient,
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (error.message === "Not authenticated") return false;
        if (error.message === "Not on client side") return false;
        return failureCount < 2;
      }
    });
  }, [authToken, isClient]);

  const useSellerBids = useCallback(() => {
    return useQuery<Bid[], Error>({
      queryKey: ['sellerBids'],
      queryFn: async () => {
        if (!authToken) throw new Error("Not authenticated");
        if (!isClient) throw new Error("Not on client side");
        
        try {
          const result = await bidService.getSellerBids(authToken);
          return result;
        } catch (error) {
          console.error('Failed to fetch seller bids:', error);
          throw error;
        }
      },
      enabled: !!authToken && isClient,
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (error.message === "Not authenticated") return false;
        if (error.message === "Not on client side") return false;
        return failureCount < 2;
      }
    });
  }, [authToken, isClient]);

  const acceptBidMutation = useMutation({
    mutationFn: async ({ bidId, finalAmount }: { bidId: string; finalAmount: number }) => {
      if (!authToken) throw new Error("Not authenticated");
      if (!isClient) throw new Error("Not on client side");
      
      try {
        const result = await bidService.acceptBid(bidId, finalAmount, authToken);
        return result;
      } catch (error) {
        console.error('Failed to accept bid:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      toast.success("Bid accepted successfully! The project is now closed.");
      queryClient.invalidateQueries({ queryKey: ['sellerBids'] });
      queryClient.invalidateQueries({ queryKey: ['projectBids'] });
      queryClient.invalidateQueries({ queryKey: ['bidDetails', variables.bidId] });
    },
    onError: (error) => {
      toast.error("Failed to accept bid. Please try again.");
      console.error("Error accepting bid:", error);
    }
  });

  const acceptBid = useCallback(async (data: { bidId: string; finalAmount: number }) => {
    if (!isClient) {
      throw new Error("Cannot accept bid on server side");
    }
    return acceptBidMutation.mutateAsync(data);
  }, [acceptBidMutation, isClient]);

  return {
    createBid,
    isCreatingBid: createBidMutation.isPending,
    createBidError: createBidMutation.error,
    useProjectBids,
    useBidDetails,
    useSellerBids,
    acceptBid,
    isAcceptingBid: acceptBidMutation.isPending,
    isClient,
  };
};
