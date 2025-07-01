"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Plus, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dummyOrders } from "../../utils/fakes/ProductFakes"
import Link from "next/link";
// import { Pagination } from '@/components/ui/pagination'; // Assuming you'll create this

// Temporary Pagination component implementation
interface PaginationProps {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ total, current, onPageChange }: PaginationProps) => {
  if (total <= 1) return null;
  return (
    <div className="flex space-x-1">
      <GenericButton
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
      >
        Prev
      </GenericButton>
      {Array.from({ length: total }, (_, i) => (
        <GenericButton
          key={i + 1}
          className={`px-2 py-1 border rounded ${
            current === i + 1 ? "bg-primary text-white" : ""
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </GenericButton>
      ))}
      <GenericButton
        className="px-2 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
      >
        Next
      </GenericButton>
    </div>
  );
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter orders based on the active tab
  const filteredOrders = dummyOrders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "pending";
    if (activeTab === "approved") return order.status === "Approved";
    if (activeTab === "sold") return order.status === "sold";
    return true;
  });

  // Filter orders based on the search term (basic implementation)
  const searchedOrders = filteredOrders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalResults = searchedOrders.length;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentOrders = searchedOrders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset page on tab change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const handleResultsPerPageChange = (value: string) => {
    setResultsPerPage(parseInt(value));
    setCurrentPage(1); // Reset page on results per page change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };




  //        INTERACTION LOGIC GOES BELOW        //                INTEGRATION LOGIC GOES BELOW        //                                INTEGRATION LOGIC GOES BELOW        //



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Orders Management</h1>
          <p className="text-sm text-muted-foreground">
            View and check all orders registered on your platform and edit them
            if necessary. The changes will be notified to users through the user
            dashboard and email.
          </p>
        </div>
        <div className="space-x-2">
          <GenericButton variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export
          </GenericButton>
          <Link href="/dashboard/create-service">
            <GenericButton className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </GenericButton>
          </Link>
          <Link href="/dashboard/products/create">
            <GenericButton className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </GenericButton>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="sold">sold</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <GenericButton variant="outline" size="sm">
                <Funnel className="h-4 w-4 mr-2" />
                Filter <ChevronDown className="h-4 w-4 ml-2" />
              </GenericButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>Filter by Name</DropdownMenuItem>
              <DropdownMenuItem>Filter by Product</DropdownMenuItem>
              <DropdownMenuItem>Filter by Date</DropdownMenuItem>
              {/* Add more filter options */}
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            type="search"
            placeholder="Search by any order details..."
            className="w-[300px] sm:w-[400px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-300">Photo</TableHead>
              <TableHead className="text-amber-300">Product-name</TableHead>
              <TableHead className="text-amber-300">Description</TableHead>
              <TableHead className="text-amber-300">Date & Time</TableHead>
              <TableHead className="text-amber-300">Status</TableHead>
              <TableHead className="text-amber-300">Cost per unit(Rfw)</TableHead>
              <TableHead className="text-amber-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium py-4">
                  {order.orderId}
                </TableCell>
                <TableCell className="py-4">{order.name}</TableCell>
                <TableCell className="py-4">{order.product}</TableCell>
                <TableCell className="py-4">{order.dateTime}</TableCell>
                <TableCell className="py-4">
                  <div
                    className={`inline-flex items-center rounded-full px-5 py-1 text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Approved"
                        ? "bg-amber-500 text-white"
                        : order.status === "sold"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="">
                  ${order.totalPaid.toFixed(2)}
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
              </TableRow>
            ))}
            {currentOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-red-500 text-center py-4"
                >
                  No Products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalResults > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} - {Math.min(endIndex, totalResults)} of{" "}
            {totalResults} Results
          </p>
          <div className="flex items-center space-x-4">
            <Pagination
              total={totalPages}
              current={currentPage}
              onPageChange={handlePageChange}
            />
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Results Per Page:</p>
              <Select
                value={resultsPerPage.toString()}
                onValueChange={handleResultsPerPageChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

