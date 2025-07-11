"use client"

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { StatCard } from "../(components)/overview/stat-card";
import { TopCountries } from "../(components)/overview/top-countries";
import { TopCustomers } from "../(components)/overview/top-customers";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useProducts } from "@/app/hooks/useProduct";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/app/hooks/useCategories";
import axios from 'axios';
import { analyticsService } from '@/app/services/analyticsService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Home() {
  // All hooks at the top!
  const [userCredentials, setUserCredentials] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products, isLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  const searchedProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    setUserCredentials(user);
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    setLoading(true);
    analyticsService.getAdminAnalytics(token)
      .then(res => setAnalytics(res))
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-lg">Loading analytics...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="px-2">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold">
            Welcome Back, {userCredentials?.firstName || ""} {userCredentials?.lastName || ""}!
          </h1>
          <p className="text-gray-500">
            Here is what happening with your store today
          </p>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Revenue Over Time Line Chart */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.ecommerce?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={m => m?.slice(0,7)} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Projects by Status Pie Chart */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Projects by Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics?.bidding?.projectsByStatus || []}
                  dataKey="_count._all"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {(analytics?.bidding?.projectsByStatus || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Customers"
            value={analytics?.users?.totalCustomers?.toLocaleString() ?? '--'}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Revenue"
            value={analytics?.ecommerce?.totalSales ? `$${analytics.ecommerce.totalSales.toLocaleString()}` : '--'}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Orders"
            value={analytics?.ecommerce?.totalOrders?.toLocaleString() ?? '--'}
            change={0}
            trend="up"
          />
        </div>
        {/* Main Content Section: Product Table */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Column: Recent Orders and Product Table */}
          <div className="rounded-md w-full lg:w-[70%]">
            {/* Recent Orders Table */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-amber-300">Order ID</TableHead>
                    <TableHead className="text-amber-300">Customer</TableHead>
                    <TableHead className="text-amber-300">Date & Time</TableHead>
                    <TableHead className="text-amber-300">Total</TableHead>
                    <TableHead className="text-amber-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.recentOrders?.length > 0 ? analytics.recentOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="py-4 text-bold">{order.id}</TableCell>
                      <TableCell className="py-5">{order.customerName || '-'}</TableCell>
                      <TableCell className="py-4">{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell className="">{order.total ? `$${order.total}` : '-'}</TableCell>
                      <TableCell className="">{order.status || '-'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-red-500 text-center py-4">
                        No recent orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Product Table */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Input
                  type="search"
                  placeholder="Search by any product details..."
                  className="w-[300px] sm:w-[400px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-amber-300">Product Name</TableHead>
                    <TableHead className="text-amber-300">Description</TableHead>
                    <TableHead className="text-amber-300">Date & Time</TableHead>
                    <TableHead className="text-amber-300">Category</TableHead>
                    <TableHead className="text-amber-300">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="py-4 text-bold">{product.name}</TableCell>
                      <TableCell className="py-5 max-auto overflo">{product.description}</TableCell>
                      <TableCell className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</TableCell>
                      <TableCell className="py-4">{getCategoryName(product.categoryId)}</TableCell>
                      <TableCell className="">{product.price ? `$${product.price}` : "-"}</TableCell>
                    </TableRow>
                  ))}
                  {searchedProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-red-500 text-center py-4">
                        No Products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* Right Column: Top Customers */}
          <div className="space-y-8 w-full lg:w-[30%]">
            <div className="p-6 bg-white rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Customers</h2>
              </div>
              <div className="space-y-4">
                {analytics?.topCustomers?.length > 0 ? analytics.topCustomers.map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar || 'https://i.pravatar.cc/150?u=' + customer.id} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.purchases} Purchases</p>
                      </div>
                    </div>
                    <span className="font-medium">${customer.amount?.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="text-gray-500">No top customers found.</div>
                )}
              </div>
            </div>
            <TopCountries />
          </div>
        </div>
      </div>
    </div>
  );
}