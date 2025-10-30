"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Funnel, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useProducts } from "@/app/hooks/useProduct";
// Removed useShop import - sellers no longer need shops
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import CategorySelect from "@/app/dashboard/my-store/create/CategorySelect";
import { useTranslations } from '@/app/hooks/useTranslations';
// Removed MyService import - sellers only deal with products now

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
//   { value: "all", label: "All goods" },
//   { value: "products", label: "Products" },
//   { value: "services", label: "Services" },
// ];

const Page = () => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed shop dependency - sellers no longer need shops
  const {
    getMyProducts,
    isLoading,
    error,
    deleteProduct,
    updateProduct,
    isLoading: isProductLoading,
  } = useProducts();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const isFetchingRef = useRef(false);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);

  // Fetch products for the authenticated seller
  useEffect(() => {
    const fetchProducts = async () => {
      // Prevent multiple simultaneous requests
      if (isFetchingRef.current) {
        console.log("Request already in progress, skipping...");
        return;
      }

      // Check if auth token is available
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (!authToken) {
        console.log("No auth token available, skipping fetch...");
        return;
      }

      console.log("=== FETCHING PRODUCTS ===");
      console.log("Current Page:", currentPage);
      console.log("Results Per Page:", resultsPerPage);
      console.log("Auth Token: Present");
      
      isFetchingRef.current = true;
      setIsLoadingProducts(true);
      try {
        const data = await getMyProducts(currentPage, resultsPerPage);
        console.log("Products fetched successfully:", data);
        console.log("First product structure:", data[0]);
        console.log("Products count:", data.length);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching my products:", error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
        isFetchingRef.current = false;
      }
    };

    fetchProducts();
  }, [getMyProducts, currentPage, resultsPerPage]);

  // Function to refresh products (for manual refresh after CRUD operations)
  const refreshProducts = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      console.log("Request already in progress, skipping refresh...");
      return;
    }

    // Check if auth token is available
    const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!authToken) {
      console.log("No auth token available, skipping refresh...");
      return;
    }

    console.log("=== MANUAL REFRESH PRODUCTS ===");
    isFetchingRef.current = true;
    setIsLoadingProducts(true);
    try {
      const data = await getMyProducts(currentPage, resultsPerPage);
      console.log("Products refreshed successfully:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error refreshing my products:", error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
      isFetchingRef.current = false;
    }
  }, [getMyProducts, currentPage, resultsPerPage]);

  // Filter products based on search term
  const searchedProducts = (products || []).filter((product) => {
    if (!product) return false;
    return Object.values(product).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Filter out any invalid products
  const validProducts = searchedProducts.filter(product => product && product.id);
  const totalResults = validProducts.length;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentProducts = validProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Removed tab change handler - only products now

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

  // Delete handler
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      // Refresh product list
      refreshProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // Edit handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !editForm) return;
    try {
      // Prepare FormData for update (reuse create logic if needed)
      const formData = new FormData();
      // Convert price and discountedPrice to strings
      if (editForm.price !== undefined && editForm.price !== null) {
        editForm.price = String(editForm.price);
      }
      if (editForm.discountedPrice !== undefined && editForm.discountedPrice !== null) {
        editForm.discountedPrice = String(editForm.discountedPrice);
      }
      // Remove images from editForm for now (unless you want to support image update)
      const { images, ...productData } = editForm;
      formData.append('data', JSON.stringify(productData));
      // If you want to support image update, add imageData and images here
      await updateProduct(selectedProduct.id, formData);
      toast.success("Product updated successfully");
      setEditDialogOpen(false);
      setSelectedProduct(null);
      // Refresh product list
      refreshProducts();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };
  // if (isMyShopLoading) return <div>Loading...</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('dashboard.productsManagement')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.productsManagementDesc')}
          </p>
        </div>
        <div>
          <Link href="/dashboard/my-store/create">
            <GenericButton className="gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.addProduct')}
            </GenericButton>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <Funnel className="h-4 w-4" />
            <span className="text-sm font-medium">Products</span>
          </div>
          <Input
            type="search"
            placeholder="Search by product details..."
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
                <TableHead className="text-amber-300">{t('dashboard.photo')}</TableHead>
                <TableHead className="text-amber-300">{t('dashboard.productName')}</TableHead>
                <TableHead className="text-amber-300">{t('dashboard.category')}</TableHead>
                <TableHead className="text-amber-300">{t('dashboard.dateTime')}</TableHead>
                <TableHead className="text-amber-300">{t('dashboard.price')}</TableHead>
                <TableHead className="text-amber-300">{t('dashboard.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingProducts ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentProducts.map((product) => (
                <TableRow key={product?.id || Math.random()}>
                  <TableCell className="font-medium py-4">
                    {product?.thumbnailUrl ? (
                      <img src={product.thumbnailUrl} alt={product?.name || 'Product'} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">{product?.name || 'Unnamed Product'}</TableCell>
                  <TableCell className="py-2 md:py-5 max-auto overflo">{product?.category?.name || 'No Category'}</TableCell>
                  <TableCell className="py-2">{product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="">{product?.price ? `${product.price} Rfw` : "-"}</TableCell>
                  <TableCell className="flex gap-3 my-5">
                    <Trash2
                      className="cursor-pointer hover:text-red-500 w-[20px]"
                      onClick={() => {
                        if (product?.id) {
                          setSelectedProduct(product);
                          setDeleteDialogOpen(true);
                        }
                      }}
                    />
                    <Pencil
                      className="cursor-pointer hover:text-green-400 w-[20px]"
                      onClick={() => {
                        if (product?.id) {
                          setSelectedProduct(product);
                          setEditForm({ ...product });
                          setEditDialogOpen(true);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
                ))
              )}
              {!isLoadingProducts && currentProducts.length === 0 && (
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
        </div>

      {totalResults > 0 && (
        <div className="flex items-center justify-between mt-4">
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
            <GenericButton
              onClick={handleDelete}
              disabled={isProductLoading}
            >
              {t('dashboard.confirmDelete')}
            </GenericButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.editProduct')}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Preview at the top */}
              <div className="flex justify-center mb-4">
                {editForm.imageUrl ? (
                  <img src={editForm.imageUrl} alt={editForm.name} className="w-24 h-24 object-cover rounded" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">{t('dashboard.name')}</label>
                <Input
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('dashboard.description')}</label>
                <Input
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('dashboard.price')}</label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('dashboard.discountedPrice')}</label>
                <Input
                  type="number"
                  value={editForm.discountedPrice}
                  onChange={e => setEditForm({ ...editForm, discountedPrice: e.target.value })}
                />
              </div>
              {/* Category dropdown */}
              <div>
                <label className="block text-sm font-medium">{t('dashboard.category')}</label>
                <CategorySelect
                  value={editForm.categoryId || ''}
                  onChange={val => setEditForm({ ...editForm, categoryId: val })}
                />
              </div>
              {/* Add more fields as needed, similar to create page */}
              <DialogFooter>
                <DialogClose asChild>
                  <GenericButton variant="outline">{t('dashboard.cancel')}</GenericButton>
                </DialogClose>
                <GenericButton type="submit" disabled={isProductLoading}>
                  {t('dashboard.saveChanges')}
                </GenericButton>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;

