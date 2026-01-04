"use client";

import React from 'react';
import { ServiceRequest } from '@/app/services/requestService';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  MessageCircle,
  Phone
} from 'lucide-react';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onStatusUpdate?: (id: string, status: ServiceRequest['status']) => void;
  onDelete?: (id: string) => void;
  userType: 'technician' | 'customer' | 'admin';
}

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
    LOW: { color: 'bg-green-100 text-green-800', label: 'Low' },
    MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    HIGH: { color: 'bg-red-100 text-red-800', label: 'High' }
  };
  
  return configs[urgency];
};

export default function ServiceRequestCard({ 
  request, 
  onStatusUpdate, 
  onDelete, 
  userType 
}: ServiceRequestCardProps) {
  const statusConfig = getStatusConfig(request.status);
  const urgencyConfig = getUrgencyConfig(request.urgency);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canUpdateStatus = userType === 'technician' && 
    ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(request.status);

  const canDelete = userType === 'customer' && request.status === 'PENDING';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-mid font-semibold text-gray-900">
              {request.category}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-small font-medium border ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-small font-medium ${urgencyConfig.color}`}>
              <AlertCircle className="w-3 h-3 mr-1" />
              {urgencyConfig.label}
            </span>
          </div>
          
          <p className="text-gray-600 text-small mb-3 line-clamp-2">
            {request.description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {canDelete && (
            <button
              onClick={() => onDelete?.(request.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete request"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-small">{request.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-small font-medium">{request.budget.toLocaleString()} RWF</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-small">{formatDate(request.createdAt)}</span>
        </div>
      </div>

      {/* User Information */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {userType === 'customer' && request.technician && (
              <div className="flex items-center space-x-2">
                <img
                  src={request.technician.avatar || '/default-avatar.png'}
                  alt={request.technician.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-small font-medium text-gray-900">{request.technician.name}</p>
                  <p className="text-small text-gray-500">{request.technician.email}</p>
                </div>
              </div>
            )}
            
            {userType === 'technician' && request.customer && (
              <div className="flex items-center space-x-2">
                <img
                  src={request.customer.avatar || '/default-avatar.png'}
                  alt={request.customer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-small font-medium text-gray-900">{request.customer.name}</p>
                  <p className="text-small text-gray-500">{request.customer.email}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-small text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-small text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {canUpdateStatus && (
        <div className="border-t pt-4 mt-4">
          <div className="flex space-x-2">
            {request.status === 'PENDING' && (
              <button
                onClick={() => onStatusUpdate?.(request.id, 'ACCEPTED')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Accept Request
              </button>
            )}
            {request.status === 'ACCEPTED' && (
              <button
                onClick={() => onStatusUpdate?.(request.id, 'IN_PROGRESS')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Start Work
              </button>
            )}
            {request.status === 'IN_PROGRESS' && (
              <button
                onClick={() => onStatusUpdate?.(request.id, 'COMPLETED')}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => onStatusUpdate?.(request.id, 'CANCELLED')}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
