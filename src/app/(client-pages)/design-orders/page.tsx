"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from '@/app/hooks/useTranslations';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShoppingCart, 
  Download, 
  Eye, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Star,
  MessageSquare
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Design Order interface based on the backend API
interface DesignOrder {
  id: string;
  designId: string;
  buyerId: string;
  orderDate: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod?: string;
  transactionId?: string;
  design: {
    id: string;
    title: string;
    description: string;
    images: string[];
    architect: {
      businessName: string;
      user: {
        firstName: string;
        lastName: string;
        profilePic?: string;
      };
    };
  };
}

interface DesignOrderResponse {
  success: boolean;
  data: DesignOrder[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const DesignOrders: React.FC = () => {
  const { t } = useTranslations();
  const { role: userRole, isHydrated } = useUserStore();
  const router = useRouter();

  // State management
  const [orders, setOrders] = useState<DesignOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Check authentication
  useEffect(() => {
    if (isHydrated && !userRole) {
      toast.error('Please sign in to view your design orders');
      router.push('/signin');
    }
  }, [isHydrated, userRole, router]);

  // Fetch user's design orders
  const fetchOrders = async () => {
    if (!isHydrated || !userRole) return;

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/v1/design/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data: DesignOrderResponse = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
      } else {
        throw new Error('Failed to load orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh orders
  const refreshOrders = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Load orders on component mount
  useEffect(() => {
    if (isHydrated && userRole) {
      fetchOrders();
    }
  }, [isHydrated, userRole]);

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'PAID':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CreditCard className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'PROCESSING':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><RefreshCw className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter orders by status
  const filteredOrders = statusFilter && statusFilter !== 'all'
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  // Get status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle download (placeholder - would need actual implementation)
  const handleDownload = (order: DesignOrder) => {
    if (order.status === 'COMPLETED') {
      toast.success('Download started!');
      // Here you would implement actual download logic
    } else {
      toast.error('Design is not ready for download yet');
    }
  };

  // Handle view design
  const handleViewDesign = (designId: string) => {
    router.push(`/design-marketplace/${designId}`);
  };

  // Handle review design
  const handleReview = (order: DesignOrder) => {
    if (order.status === 'COMPLETED') {
      router.push(`/design-marketplace/${order.designId}/review`);
    } else {
      toast.error('You can only review completed designs');
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-900">
        <div className="absolute inset-0">
          <img
            src="/Desing market.jpg"
            alt="Design Orders"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="text-amber-500 text-mid font-semibold mb-4 block">
                Track Your Design Orders
              </span>
              <h1 className="text-title md:text-6xl font-bold mb-6 text-white">
                Your Design Orders
              </h1>
              <p className="text-mid md:text-mid text-gray-200 mb-8 max-w-3xl mx-auto">
                Manage and track all your purchased architectural designs. 
                Download completed designs and leave reviews for architects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-title font-bold text-amber-800 mb-2">Your Design Orders</h1>
              <p className="text-mid text-amber-700">
                Track and manage your purchased architectural designs
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={refreshOrders}
                disabled={refreshing}
                variant="outline"
                className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/design-marketplace">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Designs
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-amber-400 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-mid font-bold">{orders.length}</div>
                <div className="text-small opacity-90">Total Orders</div>
              </CardContent>
            </Card>
            <Card className="bg-green-100 text-green-800">
              <CardContent className="p-4 text-center">
                <div className="text-mid font-bold">
                  {orders.filter(o => o.status === 'COMPLETED').length}
                </div>
                <div className="text-small">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-100 text-blue-800">
              <CardContent className="p-4 text-center">
                <div className="text-mid font-bold">
                  {orders.filter(o => o.status === 'PROCESSING').length}
                </div>
                <div className="text-small">Processing</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-100 text-yellow-800">
              <CardContent className="p-4 text-center">
                <div className="text-mid font-bold">
                  {orders.filter(o => o.status === 'PENDING').length}
                </div>
                <div className="text-small">Pending</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-small font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading orders</p>
                <p className="text-small">{error}</p>
                <Button onClick={fetchOrders} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <>
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-mid font-semibold text-gray-800 mb-2">
                      {statusFilter ? 'No orders found with this status' : 'No design orders yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {statusFilter 
                        ? 'Try selecting a different status filter'
                        : 'Start exploring our design marketplace to find your perfect design'
                      }
                    </p>
                    <Link href="/design-marketplace">
                      <Button className="bg-amber-500 hover:bg-amber-600">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Browse Designs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Design Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={order.design.images[0] || '/placeholder-design.jpg'}
                            alt={order.design.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-mid font-semibold text-gray-900 mb-1">
                                {order.design.title}
                              </h3>
                              <p className="text-small text-gray-600 line-clamp-2">
                                {order.design.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          {/* Architect Info */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                              <span className="text-small font-medium text-amber-800">
                                {order.design.architect.user.firstName[0]}
                              </span>
                            </div>
                            <span className="text-small text-gray-600">
                              by {order.design.architect.businessName}
                            </span>
                          </div>

                          {/* Order Info */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-small text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Ordered: {formatDate(order.orderDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-small text-gray-600">
                              <CreditCard className="w-4 h-4" />
                              <span>Amount: ${order.amount.toLocaleString()}</span>
                            </div>
                            {order.paymentMethod && (
                              <div className="flex items-center gap-2 text-small text-gray-600">
                                <span>Payment: {order.paymentMethod}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDesign(order.designId)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Design
                            </Button>
                            
                            {order.status === 'COMPLETED' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleDownload(order)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReview(order)}
                                >
                                  <Star className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </>
                            )}

                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-yellow-600 border-yellow-300"
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Payment Pending
                              </Button>
                            )}

                            {order.status === 'PROCESSING' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-purple-600 border-purple-300"
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Processing
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default DesignOrders;
