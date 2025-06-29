import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { negotiationService } from "@/app/services/negotiationService";
import {
  CreateNegotiationMessageDTO,
  NegotiationMessage,
} from "@/types/negotiation";
import { useEffect, useState, useCallback } from "react";

export const useNegotiation = (
  bidId: string,
  initialMessages?: NegotiationMessage[]
) => {
  const queryClient = useQueryClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      setAuthToken(token);
    }
  }, []);

  // Pre-populate cache with initial data if provided
  useEffect(() => {
    if (initialMessages && bidId && isClient) {
      queryClient.setQueryData(
        ["negotiationHistory", bidId],
        initialMessages as unknown[]
      );
    }
  }, [initialMessages, bidId, isClient, queryClient]);

  const historyQuery = useQuery({
    queryKey: ["negotiationHistory", bidId],
    queryFn: async () => {
      if (!authToken) throw new Error("Not authenticated");
      if (!isClient) throw new Error("Not on client side");
      try {
        const result = await negotiationService.getNegotiationHistory(
          bidId,
          authToken
        );
        return result;
      } catch (error) {
        console.error("Failed to fetch negotiation history:", error);
        throw error;
      }
    },
    enabled: !!bidId && !!authToken && isClient,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 10000, // Refetch every 10 seconds
    retry: (failureCount, error: Error) => {
      if (error.message === "Not authenticated") return false;
      if (error.message === "Not on client side") return false;
      return failureCount < 2;
    },
    initialData: initialMessages,
    refetchOnMount: !initialMessages,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: CreateNegotiationMessageDTO) => {
      if (!authToken) throw new Error("Not authenticated");
      if (!isClient) throw new Error("Not on client side");

      try {
        const result = await negotiationService.sendNegotiationMessage(
          messageData,
          authToken
        );
        return result;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["negotiationHistory", bidId],
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  // Wrap mutateAsync to ensure it's called on client side only
  const sendMessage = useCallback(
    async (messageData: CreateNegotiationMessageDTO) => {
      if (!isClient) {
        throw new Error("Cannot send message on server side");
      }
      return sendMessageMutation.mutateAsync(messageData);
    },
    [sendMessageMutation, isClient]
  );

  return {
    historyQuery,
    sendMessage,
    isSending: sendMessageMutation.isPending,
    isClient,
  };
};
