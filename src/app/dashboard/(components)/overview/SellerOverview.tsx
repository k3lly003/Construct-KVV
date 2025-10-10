"use client";

import React from "react";
import { StatCard } from "@/app/dashboard/(components)/overview/sections/stat-card";
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
  fetchSellerProductsCount,
  fetchSellerRevenueAndOrders,
} from "@/app/services/sellerOverviewService";
import { getSellerOrders } from "@/app/services/sellerOverviewService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import api from "@/lib/axios";

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

// Seller Earnings component: fetch, filter by sellerId (from localStorage), summarize and chart
function SellerEarnings() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<
    Array<{ sellerId: string; netAmount: number; createdAt: string }>
  >([]);

  const getSellerIdFromStorage = () => {
    try {
      if (typeof window === "undefined") return null;
      const userStr = localStorage.getItem("user");
      const sidKey = localStorage.getItem("sellerId");
      let finalSellerId: string | null = null;
      if (userStr) {
        try {
          const user: any = JSON.parse(userStr);
          const sellerIdFromSeller =
            user?.seller?.id ?? user?.seller?._id ?? null;
          const fallbackUserId = user?.id ?? user?._id ?? null;
          finalSellerId = sellerIdFromSeller || fallbackUserId || null;
          console.log("[SellerEarnings] sellerId derivation", {
            user,
            sellerIdFromSeller,
            fallbackUserId,
            finalSellerId,
          });
        } catch (e) {
          console.log("[SellerEarnings] user parse error", e);
        }
      }
      if (!finalSellerId && sidKey) {
        console.log(
          "[SellerEarnings] using sellerId key from localStorage",
          sidKey
        );
        finalSellerId = sidKey;
      }
      return finalSellerId;
    } catch (e) {
      console.log("[SellerEarnings] getSellerIdFromStorage error", e);
      return null;
    }
  };

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/api/v1/cart/split-calculations", {
          headers: { accept: "*/*" },
        });
        const payload: any = res?.data || {};
        const list: any[] = Array.isArray(payload)
          ? payload
          : payload.data || payload.items || payload.splits || [];
        const sellerId = getSellerIdFromStorage();
        console.log("[SellerEarnings] fetched", {
          count: list.length,
          sellerId,
        });
        const filtered = sellerId
          ? list.filter((i: any) => i?.sellerId === sellerId)
          : [];
        if (mounted)
          setItems(
            filtered.map((i: any) => ({
              sellerId: i.sellerId,
              netAmount: Number(i.netAmount || 0),
              createdAt: i.createdAt,
            }))
          );
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load earnings");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  const isInRange = (dateIso: string, from: Date, to: Date) => {
    const t = new Date(dateIso).getTime();
    return t >= from.getTime() && t <= to.getTime();
  };

  const now = new Date();
  const thisMonthFrom = startOfMonth(now);
  const thisMonthTo = endOfMonth(now);
  const lastMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const lastMonthFrom = startOfMonth(lastMonthRef);
  const lastMonthTo = endOfMonth(lastMonthRef);

  const thisMonthEarnings = items
    .filter((i) => isInRange(i.createdAt, thisMonthFrom, thisMonthTo))
    .reduce((sum, i) => sum + (i.netAmount || 0), 0);
  const lastMonthEarnings = items
    .filter((i) => isInRange(i.createdAt, lastMonthFrom, lastMonthTo))
    .reduce((sum, i) => sum + (i.netAmount || 0), 0);

  // Aggregate by day for chart
  const dailyMap = new Map<string, number>();
  for (const i of items) {
    const d = new Date(i.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    dailyMap.set(key, (dailyMap.get(key) || 0) + (i.netAmount || 0));
  }
  const chartData = Array.from(dailyMap.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([key, value]) => {
      const [y, m, d] = key.split("-");
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
      return { dateLabel: label, netAmount: value };
    });

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="lg:col-span-2">
          <div className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return <div className="text-gray-500">No earnings data available</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: summaries */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 dark:text-amber-300">
              This Month Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              RWF {thisMonthEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 dark:text-amber-300">
              Last Month Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              RWF {lastMonthEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: bar chart */}
      <div className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#D1D5DB" }}
            />
            <YAxis
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#D1D5DB" }}
            />
            <Tooltip
              formatter={(v: any) => [
                `RWF ${Number(v).toLocaleString()}`,
                "Net Amount",
              ]}
              labelStyle={{ color: "#111827" }}
              contentStyle={{ borderRadius: 8 }}
            />
            <Bar
              dataKey="netAmount"
              fill="url(#earningsGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function SellerOverview() {
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

  // Seller products count (from service fetching all products then filtering by sellerId)
  const [sellerProductsCount, setSellerProductsCount] =
    React.useState<number>(0);
  const [sellerProductsLoading, setSellerProductsLoading] =
    React.useState<boolean>(true);
  const [sellerProductsError, setSellerProductsError] = React.useState<
    string | null
  >(null);

  // Revenue and Orders from split-calculations
  const [sellerTotals, setSellerTotals] = React.useState<{
    totalRevenue: number;
    totalOrders: number;
  }>({ totalRevenue: 0, totalOrders: 0 });
  const [sellerTotalsLoading, setSellerTotalsLoading] =
    React.useState<boolean>(true);
  const [sellerTotalsError, setSellerTotalsError] = React.useState<
    string | null
  >(null);

  // Preferred Orders state
  const [sellerOrders, setSellerOrders] = React.useState<any[]>([]);
  const [sellerOrdersLoading, setSellerOrdersLoading] =
    React.useState<boolean>(true);
  const [sellerOrdersError, setSellerOrdersError] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    let mounted = true;
    async function loadSellerProductsCount() {
      try {
        setSellerProductsLoading(true);
        setSellerProductsError(null);
        // Log user record from localStorage and effect start
        try {
          const userStr =
            typeof window !== "undefined" ? localStorage.getItem("user") : null;
          console.log("[SellerOverview] effect:start", {
            hasWindow: typeof window !== "undefined",
            hasUser: !!userStr,
          });
          if (userStr) {
            const user = JSON.parse(userStr);
            console.log("[SellerOverview] localStorage.user", user);
          }
        } catch (e) {
          console.log("[SellerOverview] localStorage.user:parse_error", e);
        }
        const count = await fetchSellerProductsCount();
        if (mounted) setSellerProductsCount(count);
        console.log("[SellerOverview] effect:success", { count });
      } catch (e: any) {
        if (mounted)
          setSellerProductsError(e?.message || "Failed to load products");
        console.log("[SellerOverview] effect:error", e);
      } finally {
        if (mounted) setSellerProductsLoading(false);
        console.log("[SellerOverview] effect:finish");
      }
    }
    loadSellerProductsCount();
    // Load revenue and orders
    (async () => {
      try {
        setSellerTotalsLoading(true);
        setSellerTotalsError(null);
        console.log("[SellerOverview] totals:start");
        const totals = await fetchSellerRevenueAndOrders();
        setSellerTotals(totals);
        console.log("[SellerOverview] totals:success", totals);
      } catch (e: any) {
        setSellerTotalsError(e?.message || "Failed to load revenue & orders");
        console.log("[SellerOverview] totals:error", e);
      } finally {
        setSellerTotalsLoading(false);
        console.log("[SellerOverview] totals:finish");
      }
    })();
    // Load preferred orders
    (async () => {
      try {
        setSellerOrdersLoading(true);
        setSellerOrdersError(null);
        const userStr =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        const user = userStr ? JSON.parse(userStr) : null;
        const orders = await getSellerOrders(user);
        const sorted = [...orders].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSellerOrders(sorted.slice(0, 5));
      } catch (e: any) {
        setSellerOrdersError(e?.message || "Failed to load orders");
      } finally {
        setSellerOrdersLoading(false);
      }
    })();
    return () => {
      mounted = false;
      console.log("[SellerOverview] effect:cleanup");
    };
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
        <div className="mb-10 pt-8">
          <h1 className="text-2xl font-semibold">
            Welcome Back, {userInfo.fullName || "User"}!
          </h1>
          <p className="text-gray-500">
            Here is what happening with your store today
          </p>
        </div>

        {/* Seller Earnings Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Seller Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SellerEarnings />
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total product"
            value={
              sellerProductsLoading
                ? "..."
                : sellerProductsCount.toLocaleString()
            }
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Revenue"
            value={
              sellerTotalsLoading
                ? "..."
                : `RWF ${sellerTotals.totalRevenue.toLocaleString()}`
            }
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Orders"
            value={
              sellerTotalsLoading
                ? "..."
                : sellerTotals.totalOrders.toLocaleString()
            }
            change={0}
            trend="up"
          />
        </div>

        {/* Preferred Orders */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Preferred Ordered Products
            </h2>
          </div>
          {sellerOrdersLoading ? (
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ) : sellerOrders.length === 0 ? (
            <div className="text-gray-500">No preferred orders yet.</div>
          ) : (
            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        #
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Buyer Name
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Email
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Product
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Price
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Quantity
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Status
                      </TableHead>
                      <TableHead className="text-amber-700 dark:text-amber-300">
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellerOrders.map((o: any, idx: number) => {
                      const firstProduct = o?.products?.[0] || {};
                      const productName = firstProduct?.name || "—";
                      const quantity = firstProduct?.quantity || 0;
                      const price = firstProduct?.price || 0;
                      const buyerName = o?.buyer?.name || o?.buyerName || "—";
                      const buyerEmail =
                        o?.buyer?.email || o?.buyerEmail || "—";
                      const status = String(o?.status || "").toUpperCase();
                      const isPaid = status === "PAID";
                      const created = o?.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "—";
                      return (
                        <TableRow key={o.orderId || idx}>
                          <TableCell className="py-4">{idx + 1}.</TableCell>
                          <TableCell className="py-4">{buyerName}</TableCell>
                          <TableCell className="py-4">{buyerEmail}</TableCell>
                          <TableCell className="py-4">{productName}</TableCell>
                          <TableCell className="py-4">
                            {price
                              ? `RWF ${Number(price).toLocaleString()}`
                              : "-"}
                          </TableCell>
                          <TableCell className="py-4">{quantity}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              className={
                                isPaid ? "bg-green-500" : "bg-yellow-500"
                              }
                            >
                              {status || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">{created}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
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
    </div>
  );
}
