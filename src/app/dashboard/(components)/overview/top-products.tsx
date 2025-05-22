/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Plus, Upload } from "lucide-react";
// import { Pagination } from '@/components/ui/pagination'; // Assuming you'll create this

// Temporary Pagination component implementation
interface PaginationProps {
  total: number;
  current: number;
  onPageChange: (page: number) => void;
}
import Link from "next/link";

// Define the type for an order item
export interface Order {
  orderId: string;
  name: string;
  product: string;
  dateTime: string;
  status: "Completed" | "In Progress" | "Canceled";
  totalPaid: number;
  paymentMethod: "Paypal" | "Credit Card" | "Wallet";
}

// Dummy order data (replace with your actual data fetching)
const dummyOrders: Order[] = [
  {
    orderId: "A26TOJ1M",
    name: "Nick Patterson",
    product: "Pull & Bear Shirt",
    dateTime: "Mar 18, 2022 (08:19)",
    status: "Completed",
    totalPaid: 428.67,
    paymentMethod: "Paypal",
  },
  {
    orderId: "AAYR74J5",
    name: "Ayda Zyne",
    product: "Kotton Corduroy Pants",
    dateTime: "Mar 18, 2022 (08:02)",
    status: "Completed",
    totalPaid: 89.0,
    paymentMethod: "Credit Card",
  },
  {
    orderId: "ABU6BF03",
    name: "Islam Abroni...",
    product: "Apple Airpods Pro, Desk Shelf, Sta...",
    dateTime: "Mar 18, 2022 (07:34)",
    status: "In Progress",
    totalPaid: 1259.0,
    paymentMethod: "Wallet",
  },
  {
    orderId: "ABZR9NE1",
    name: "Ahmed Gül",
    product: "Tom Ford Black Orchid, Cactus So...",
    dateTime: "Mar 18, 2022 (07:20)",
    status: "Completed",
    totalPaid: 4099.0,
    paymentMethod: "Wallet",
  },
  {
    orderId: "AD60VQ7V",
    name: "James Jones",
    product: "Redmi Power Bank - 20000mAh",
    dateTime: "Mar 18, 2022 (06:52)",
    status: "In Progress",
    totalPaid: 36.0,
    paymentMethod: "Wallet",
  },
  {
    orderId: "AS0B9BE5",
    name: "Ario Chilver",
    product: "Faber-Castell Polychromos 120",
    dateTime: "Mar 18, 2022 (03:35)",
    status: "Completed",
    totalPaid: 249.45,
    paymentMethod: "Paypal",
  },
  {
    orderId: "ATM502ND",
    name: "Fred Wade Jr.",
    product: "H&M Hat, Nike Air Zoom",
    dateTime: "Mar 18, 2022 (00:49)",
    status: "Completed",
    totalPaid: 1600.0,
    paymentMethod: "Paypal",
  },
  {
    orderId: "AW0OR5F5",
    name: "Hille Johnson",
    product: "New Balance Suit",
    dateTime: "Mar 17, 2022 (23:36)",
    status: "Canceled",
    totalPaid: 899.0,
    paymentMethod: "Credit Card",
  },
  {
    orderId: "B04FV6IO",
    name: "Matheus Brown",
    product: "Apple Watch Series 7",
    dateTime: "Mar 17, 2022 (23:32)",
    status: "In Progress",
    totalPaid: 740.0,
    paymentMethod: "Paypal",
  },
  {
    orderId: "B3MPFKQ2",
    name: "Udein Battier",
    product: "Michelin Pilot Sport 4",
    dateTime: "Mar 17, 2022 (21:05)",
    status: "Completed",
    totalPaid: 430.0,
    paymentMethod: "Credit Card",
  },
  // ... more dummy data
];

export const TopProducts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter orders based on the active tab
  const filteredOrders = dummyOrders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return order.status === "Completed";
    if (activeTab === "inProgress") return order.status === "In Progress";
    if (activeTab === "canceled") return order.status === "Canceled";
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

  return (
    <div className="p-1">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Orders Management</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Add new product
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Funnel className="h-4 w-4 mr-2" />
                Filter <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
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
              <TableHead className="text-amber-300">ID</TableHead>
              <TableHead className="text-amber-300">Name</TableHead>
              <TableHead className="text-amber-300">Product(s)</TableHead>
              <TableHead className="text-amber-300">Date & Time</TableHead>
              <TableHead className="text-amber-300">Status</TableHead>
              <TableHead className="text-amber-300">Total Paid</TableHead>
              <TableHead className="text-amber-300">Payment Method</TableHead>
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
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Canceled"
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
      <div className="flex justify-end my-5">
        <Link
          href="/dashboard/products"
          className="text-sm text-amber-500 hover:underline"
        >
          view more...
        </Link>
      </div>
    </div>
  );
};
