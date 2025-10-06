"use client";

import React, { useState, useEffect } from 'react';
import { useRequests } from '@/app/hooks/useRequests';
import { ServiceRequest } from '@/app/services/requestService';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Eye, 
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ServiceRequestsPage = () => {
  const { 
    requests, 
    loading, 
    error, 
    fetchAllRequests,
    updateRequestStatus
  } = useRequests();

  const [filters, setFilters] = useState({
    status: '',
    category: '',
    urgency: '',
    searchTerm: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      await fetchAllRequests();
    } catch (error) {
      console.error('Failed to load requests:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: ServiceRequest['status']) => {
    try {
      await updateRequestStatus(id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusConfig = (status: ServiceRequest['status']) => {
    const configs = {
      PENDING: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock, 
        label: 'Pending' 
      },
      ACCEPTED: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: CheckCircle, 
        label: 'Accepted' 
      },
      IN_PROGRESS: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: Clock, 
        label: 'In Progress' 
      },
      COMPLETED: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle, 
        label: 'Completed' 
      },
      CANCELLED: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle, 
        label: 'Cancelled' 
      }
    };
    
    return configs[status];
  };

  const getUrgencyConfig = (urgency: ServiceRequest['urgency']) => {
    const configs = {
      LOW: { color: 'bg-green-100 text-green-800', label: 'Low Priority' },
      MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium Priority' },
      HIGH: { color: 'bg-red-100 text-red-800', label: 'HIGH Priority' }
    };
    
    return configs[urgency];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredRequests = requests.filter(request => {
    if (filters.searchTerm && !request.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.status && request.status !== filters.status) {
      return false;
    }
    if (filters.category && request.category !== filters.category) {
      return false;
    }
    if (filters.urgency && request.urgency !== filters.urgency) {
      return false;
    }
    return true;
  });

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading service requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage and track all service requests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadRequests}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="CARPENTRY">Carpentry</option>
                    <option value="PAINTING">Painting</option>
                    <option value="CLEANING">Cleaning</option>
                    <option value="HOME_REPAIR">Home Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <select
                    value={filters.urgency}
                    onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Urgency</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Service Request Cards */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
            <p className="text-gray-600">
              {filters.searchTerm ? 'Try adjusting your search terms' : 'No service requests available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const urgencyConfig = getUrgencyConfig(request.urgency);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Card Header with Title and Price */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {request.description.length > 50 
                            ? `${request.description.substring(0, 50)}...` 
                            : request.description
                          }
                        </h3>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {request.budget.toLocaleString()} RWF
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {request.description}
                    </p>

                    {/* Key Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{request.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">{formatDate(request.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig.color}`}>
                          {urgencyConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Service Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {request.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Service Request
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        Professional Service
                      </span>
                    </div>

                    {/* User Information */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {request.customer?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {request.customer?.name || 'Unknown User'}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.8 (127)</span>
                          </div>
                        </div>
                      </div>

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'PENDING' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'ACCEPTED')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'CANCELLED')}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}

                    {request.status === 'ACCEPTED' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'IN_PROGRESS')}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Start Work
                        </button>
                      </div>
                    )}

                    {request.status === 'IN_PROGRESS' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'COMPLETED')}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsPage;
