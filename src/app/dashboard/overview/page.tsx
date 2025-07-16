"use client"

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "../../utils/middlewares/UserCredentions";
import { StatCard } from "../(components)/overview/stat-card";
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
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';
import { productService } from '@/app/services/productServices';
import { serviceService } from '@/app/services/serviceServices';
import { useShop } from '@/app/hooks/useShop';
import { GenericButton } from "@/components/ui/generic-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Pencil, Trash2, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";

export default function Home() {
  
  const [userCredentials, setUserCredentials] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const { getProductsBySellerId } = useProducts();
  const [products, setProducts] = useState<any[]>([]);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslations();
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const { myShop } = useShop();
  const sellerId = myShop?.seller?.id || null;
  const [activeTab, setActiveTab] = useState("all");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);

  useEffect(() => {
    const user = getUserDataFromLocalStorage();
    setUserCredentials(user);
  }, []);

   // Fetch products for this seller
  useEffect(() => {
    if (!sellerId) return;
    getProductsBySellerId(sellerId)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [sellerId, getProductsBySellerId]);

  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (err) {
        setServicesError('Failed to load services');
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filter products based on the active tab
  useEffect(() => {
    let filtered: any[] = [];
    if (activeTab === "all") {
      filtered = products;
    } else if (activeTab === "products") {
      filtered = products.filter((p) => p.type === "product");
    } else if (activeTab === "services") {
      filtered = products.filter((p) => p.type === "service");
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [activeTab, products]);

  const searchedProducts = filteredProducts.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalResults = searchedProducts.length;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentProducts = searchedProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleResultsPerPageChange = (value: string) => {
    setResultsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
            {t(dashboardFakes.overview.welcomeBack)}, {userCredentials?.firstName || ""} {userCredentials?.lastName || ""}!
          </h1>
          <p className="text-gray-500">
            {t(dashboardFakes.overview.happeningToday)}
          </p>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={(products?.length ?? 0).toString()}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Services"
            value={servicesLoading || !services ? '...' : (services?.length ?? 0).toString()}
            change={0}
            trend="up"
          />
          <StatCard
            title="Total Orders"
            value="Coming soon"
            change={0}
            trend="up"
          />
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Column */}
          <div className="rounded-md w-full lg:w-[70%]">
            <div className="mb-4 flex items-center justify-between">
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
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="search"
                  placeholder="Search by any product details..."
                  className="w-[300px] sm:w-[400px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-amber-300">Photo</TableHead>
                  <TableHead className="text-amber-300">Name</TableHead>
                  <TableHead className="text-amber-300">Description</TableHead>
                  <TableHead className="text-amber-300">Date</TableHead>
                  <TableHead className="text-amber-300">Type</TableHead>
                  <TableHead className="text-amber-300">Price</TableHead>
                  <TableHead className="text-amber-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium py-4">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <span>No Image</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">{product.name}</TableCell>
                    <TableCell className="py-5 max-auto overflo">{product.description}</TableCell>
                    <TableCell className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</TableCell>
                    <TableCell className="py-4">{product.type}</TableCell>
                    <TableCell className="">{product.price ? `$${product.price}` : "-"}</TableCell>
                    <TableCell className="flex gap-3 my-10">
                      <Trash2
                        className="cursor-pointer hover:text-red-500 w-[20px]"
                        onClick={() => {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }}
                      />
                      <Pencil
                        className="cursor-pointer hover:text-green-400 w-[20px]"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditForm({ ...product });
                          setEditDialogOpen(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {currentProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-red-500 text-center py-4">
                      {t('dashboard.noProductsFound')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalResults > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.showingResults', { start: startIndex + 1, end: Math.min(endIndex, totalResults), total: totalResults })}
                </p>
                <div className="flex items-center space-x-4">
                  {/* Pagination logic here if needed */}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8 w-full lg:w-[30%]">
            <TopCustomers />
          </div>
        </div>
      </div>
    </div>
  );
}
