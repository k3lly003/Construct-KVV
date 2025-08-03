"use client"

import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "../../utils/middlewares/UserCredentions";
import { StatCard } from "../(components)/overview/stat-card";
import Notifications from "../(components)/overview/notifications";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProducts } from "@/app/hooks/useProduct";
import { Input } from "@/components/ui/input";
// import { useCategories } from "@/app/hooks/useCategories";
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';
import { serviceService } from '@/app/services/serviceServices';
import { useShop } from '@/app/hooks/useShop';
import { GenericButton } from "@/components/ui/generic-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MyService from "../create-service/my-service";
import Comments from "../(components)/overview/comments";
import Image from "next/image";

export default function Home() {

  const [userCredentials, setUserCredentials] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const { getProductsBySellerId } = useProducts();
  const [products, setProducts] = useState<any[]>([]);
  // const { categories, isLoading: categoriesLoading } = useCategories();
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
            className={`px-2 py-1 border rounded ${current === i + 1 ? "bg-primary text-white" : ""
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


  return (
    <div className="min-h-screen px-2">
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
        {/* Main Table Column */}
        <div className="flex-1">
          {/* Filter/Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <GenericButton variant="outline" size="sm">
                    <Funnel className="h-4 w-4 mr-2" />
                    {activeTab === "products" ? t('dashboard.products') : t('dashboard.services')} <ChevronDown className="h-4 w-4 ml-2" />
                  </GenericButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => handleTabChange("products")}>{t('dashboard.products')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTabChange("services")}>{t('dashboard.services')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="search"
                placeholder={t('dashboard.searchPlaceholder', { type: t(`dashboard.${activeTab}`) })}
                className="w-[300px] sm:w-[400px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Table/Card Section */}
          <div className="rounded-md border bg-white shadow-sm p-2 sm:p-4">
            {activeTab === "products" ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-amber-300">{t('dashboard.photo')}</TableHead>
                      <TableHead className="text-amber-300">{t('dashboard.productName')}</TableHead>
                      <TableHead className="text-amber-300">{t('dashboard.category')}</TableHead>
                      <TableHead className="text-amber-300">{t('dashboard.dateTime')}</TableHead>
                      <TableHead className="text-amber-300">{t('dashboard.price')}</TableHead>
                      <TableHead className="text-amber-300">{t('dashboard.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium py-4">
                          {product.thumbnailUrl ? (
                            <Image src={product.thumbnailUrl} width={48} height={48} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <span>No Image</span>
                          )}
                        </TableCell>
                        <TableCell className="py-2 align-middle">{product.name}</TableCell>
                        <TableCell className="py-2 align-middle">{product.category?.name}</TableCell>
                        <TableCell className="py-2 align-middle">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}</TableCell>
                        <TableCell className="align-middle">{product.price ? `${product.price} Rfw` : "-"}</TableCell>
                        <TableCell className="align-middle">
                          <div className="flex gap-3 items-center">
                            <Trash2
                              className="cursor-pointer hover:text-red-500 w-[20px] h-[20px]"
                              onClick={() => {
                                setSelectedProduct(product);
                                setDeleteDialogOpen(true);
                              }}
                            />
                            <Pencil
                              className="cursor-pointer hover:text-green-400 w-[20px] h-[20px]"
                              onClick={() => {
                                setSelectedProduct(product);
                                setEditForm({ ...product });
                                setEditDialogOpen(true);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentProducts.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-red-500 text-center py-4"
                        >
                          {t('dashboard.noProductsFound')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {/* Pagination and Results Info */}
                {totalResults > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                    <p className="text-sm text-muted-foreground">
                      {t('dashboard.showingResults', { start: startIndex + 1, end: Math.min(endIndex, totalResults), total: totalResults })}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Pagination
                        total={totalPages}
                        current={currentPage}
                        onPageChange={handlePageChange}
                      />
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">{t('dashboard.resultsPerPage')}</p>
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
              </>
            ) : (
              <MyService searchTerm={searchTerm} />
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('dashboard.deleteProduct')}</DialogTitle>
              </DialogHeader>
              <p>{t('dashboard.deleteProductConfirm', { name: selectedProduct?.name })}</p>
              <DialogFooter>
                <DialogClose asChild>
                  <GenericButton variant="outline">{t('dashboard.cancel')}</GenericButton>
                </DialogClose>
                {/* <GenericButton
                  onClick={handleDelete}
                  disabled={isProductLoading}
                >
                  {t('dashboard.confirmDelete')}
                </GenericButton> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Sidebar */}
        <div className="space-y-8 w-full lg:w-[30%] lg:pl-6 mt-10 lg:mt-0">
          <Notifications />
          <Comments />
        </div>
      </div>
    </div>
  );
}
