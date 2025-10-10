"use client";

import { StatCard } from "@/app/dashboard/(components)/overview/sections/stat-card";
import Comments from "@/app/dashboard/(components)/overview/sections/comments";
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
import { useDashboard } from "@/hooks/useDashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { revenueSplitService } from "@/app/services/RevenueSplitService";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

export default function AdminOverview() {
  // Custom dashboard hook
  const {
    userInfo,
    stats,
    recentOrders,
    topCustomers,
    revenueData,
    projectsData,
    searchTerm,
    isLoading,
    hasError,
    error,
    handleSearch,
    handleRefresh,
    handleClearError,
  } = useDashboard();

  // Other hooks
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const [totalCommission, setTotalCommission] = useState<number>(0);
  const [totalGross, setTotalGross] = useState<number>(0);

  useEffect(() => {
    revenueSplitService
      .getTotalPlatformCommission()
      .then(setTotalCommission)
      .catch(() => setTotalCommission(0));
    revenueSplitService
      .getTotalGross()
      .then(setTotalGross)
      .catch(() => setTotalGross(0));
  }, []);

  const searchedProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  if (isLoading) {
    return <div className="p-8 text-lg">Loading analytics...</div>;
  }

  if (hasError) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => {
            handleClearError();
            handleRefresh();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="px-2">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold">
            Welcome Back, {userInfo.fullName || "User"}!
          </h1>
          <p className="text-gray-500">
            Here is what happening with your store today
          </p>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Revenue Over Time Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Revenue Over Time
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m) => m?.slice(0, 7)}
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#374151" }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#374151" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    color: "#F9FAFB",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Projects by Status Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Projects by Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectsData}
                  dataKey="_count._all"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {projectsData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Stats Section */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers?.toLocaleString() ?? "--"}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Gross"
            value={`RWF ${totalGross.toLocaleString()}`}
            change={0}
            trend="up"
          />

          <StatCard
            title="Total Orders"
            value={stats?.totalOrders?.toLocaleString() ?? "--"}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Commission"
            value={`RWF ${totalCommission.toLocaleString()}`}
            change={0}
            trend="up"
          />
      
        </div>
        {/* Main Content Section: Product Table */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Column: Recent Orders and Product Table */}
          <div className="rounded-md w-full">
            {/* Recent Orders Table */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-amber-300">Order ID</TableHead>
                    <TableHead className="text-amber-300">Customer</TableHead>
                    <TableHead className="text-amber-300">
                      Date & Time
                    </TableHead>
                    <TableHead className="text-amber-300">Total</TableHead>
                    <TableHead className="text-amber-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders?.length > 0 ? (
                    recentOrders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="py-4 text-bold">
                          {order.id}
                        </TableCell>
                        <TableCell className="py-5">
                          {order.customerName || "-"}
                        </TableCell>
                        <TableCell className="py-4">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell className="">
                          {order.total ? `RWF ${order.total}` : "-"}
                        </TableCell>
                        <TableCell className="">
                          {order.status || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-red-500 text-center py-4"
                      >
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
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-amber-300">
                      Product Name
                    </TableHead>
                    <TableHead className="text-amber-300">
                      Description
                    </TableHead>
                    <TableHead className="text-amber-300">
                      Date & Time
                    </TableHead>
                    <TableHead className="text-amber-300">Category</TableHead>
                    <TableHead className="text-amber-300">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="py-4 text-bold">
                        {product.name}
                      </TableCell>
                      <TableCell className="py-5 max-auto overflo">
                        {product.description}
                      </TableCell>
                      <TableCell className="py-4">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell className="py-4">
                        {getCategoryName(product.categoryId)}
                      </TableCell>
                      <TableCell className="">
                        {product.price ? `RWF ${product.price}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {searchedProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-red-500 text-center py-4"
                      >
                        No Products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* Right Column: Top Customers */}
          {/* <div className="space-y-8 w-full lg:w-[30%]">
            <div className="p-6 bg-white rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Top Customers</h2>
              </div>
              <div className="space-y-4">
                {topCustomers?.length > 0 ? topCustomers.map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={customer.avatar || 'https://i.pravatar.cc/150?u=' + customer.id} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.purchases} Purchases</p>
                      </div>
                    </div>
                    <span className="font-medium">RWF {customer.amount?.toLocaleString()}</span>
                  </div>
                )) : (
                  <div className="text-gray-500">No top customers found.</div>
                )}
              </div>
            </div>
            <Comments />
          </div> */}
        </div>
      </div>
    </div>
  );
}
