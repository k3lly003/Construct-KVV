import { useState, useEffect } from 'react';
import { requestDesign, DesignRequest, CreateDesignRequestData, DesignRequestFilters } from '../services/requestDesign';
import { toast } from 'sonner';

export const useRequestDesign = () => {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Create a new design request
  const createRequest = async (data: CreateDesignRequestData) => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await requestDesign.createDesignRequest(data);
      setRequests(prev => [newRequest, ...prev]);
      toast.success('Design request created successfully!');
      return newRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create design request';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get design requests for architect
  const fetchArchitectRequests = async (filters?: DesignRequestFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestDesign.getArchitectRequests(filters);
      setRequests(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch architect requests';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get design requests for customer
  const fetchCustomerRequests = async (filters?: DesignRequestFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestDesign.getCustomerRequests(filters);
      setRequests(data);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customer requests';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single design request by ID
  const fetchRequestById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestDesign.getDesignRequestById(id);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch design request';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    error,
    clearError,
    createRequest,
    fetchArchitectRequests,
    fetchCustomerRequests,
    fetchRequestById
  };
};