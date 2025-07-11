"use client"

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "../../utils/middlewares/UserCredentions";
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

export default function Home() {
  
  const [userCredentials, setUserCredentials] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const { products, isLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    setUserCredentials(user);
  }, []);

  const searchedProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };


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
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Customer"
            value="307.48K"
            change={30}
            trend="up"
          />
          <StatCard
            title="Total Revenue"
            value="$30.58K"
            change={-15}
            trend="down"
          />
          <StatCard title="Total Deals" value="2.48K" change={23} trend="up" />
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Column */}
          <div className="rounded-md w-full lg:w-[70%]">
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
                  <TableHead className="text-amber-300">Category ID</TableHead>
                  <TableHead className="text-amber-300">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="py-4 text-bold">{product.name}</TableCell>
                    <TableCell className="py-5 max-auto overflo">{product.description}</TableCell>
                    <TableCell className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</TableCell>
                    <TableCell className="py-4">
                      {getCategoryName(product.categoryId)}
                    </TableCell>
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

          {/* Right Column */}
          <div className="space-y-8 w-full lg:w-[30%]">
            <TopCustomers />
            <TopCountries />
          </div>
        </div>
      </div>
    </div>
  );
}
