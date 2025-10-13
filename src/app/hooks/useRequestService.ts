import { useState, useEffect } from 'react';
import { requestService, ServiceRequest, CreateServiceRequestData, ServiceRequestFilters, ServiceRequestResponse } from '../services/requestService';
import { toast } from 'sonner';

export const useRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Create a new service request
  const createRequest = async (data: CreateServiceRequestData) => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await requestService.createServiceRequest(data);
      setRequests(prev => [newRequest, ...prev]);
      toast.success('Service request created successfully!');
      return newRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create service request';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get service requests for technician
  const fetchTechnicianRequests = async (filters?: ServiceRequestFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestService.getTechnicianRequests(filters);
      setRequests(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 10,
        total: response.data?.length || 0,
        totalPages: 1
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch technician requests';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get service requests for customer
  const fetchCustomerRequests = async (filters?: ServiceRequestFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestService.getCustomerRequests(filters);
      setRequests(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 10,
        total: response.data?.length || 0,
        totalPages: 1
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customer requests';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all service requests (admin)
  const fetchAllRequests = async (filters?: ServiceRequestFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestService.getAllServiceRequests(filters);
      setRequests(response.data || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 10,
        total: response.data?.length || 0,
        totalPages: 1
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch all requests';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single service request by ID
  const fetchRequestById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getServiceRequestById(id);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch service request';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update service request status
  const updateRequestStatus = async (id: string, status: ServiceRequest['status']) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRequest = await requestService.updateServiceRequestStatus(id, status);
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      toast.success('Request status updated successfully!');
      return updatedRequest;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update request status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete service request
  const deleteRequest = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await requestService.deleteServiceRequest(id);
      setRequests(prev => prev.filter(req => req.id !== id));
      toast.success('Service request deleted successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete service request';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    pagination,
    loading,
    error,
    clearError,
    createRequest,
    fetchTechnicianRequests,
    fetchCustomerRequests,
    fetchAllRequests,
    fetchRequestById,
    updateRequestStatus,
    deleteRequest
  };
};