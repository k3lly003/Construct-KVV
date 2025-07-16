"use client";

import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Funnel, Pencil, Plus, Trash2, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useProducts } from "@/app/hooks/useProduct";
import { useShop } from '@/app/hooks/useShop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import CategorySelect from "../products/create/CategorySelect";
import { useTranslations } from '@/app/hooks/useTranslations';

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
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { myShop, myShopError, isMyShopLoading } = useShop();
  const sellerId = myShop?.seller?.id || null;
  const {
    getProductsBySellerId,
    isLoading,
    error,
    deleteProduct,
    updateProduct,
    isLoading: isProductLoading,
  } = useProducts();

  const [products, setProducts] = useState<any[]>([]);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);

  // Fetch products for this seller
  useEffect(() => {
    if (!sellerId) return;
    getProductsBySellerId(sellerId)
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [sellerId, getProductsBySellerId]);

  // Filter products based on the active tab
  useEffect(() => {
    let filtered: any[] = [];
    if (activeTab === "all") {
      // Show both products and services
      filtered = products;
    } else if (activeTab === "products") {
      // Show only products
      filtered = products.filter((p) => p.type === "product");
    } else if (activeTab === "services") {
      // Show only services
      filtered = products.filter((p) => p.type === "service");
    }
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset page on tab change
  }, [activeTab, products]);

  // Filter products based on the search term
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

  // Delete handler
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      // Refresh product list
      if (sellerId) {
        getProductsBySellerId(sellerId)
          .then((data) => setProducts(data))
          .catch(() => setProducts([]));
      }
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
      if (sellerId) {
        getProductsBySellerId(sellerId)
          .then((data) => setProducts(data))
          .catch(() => setProducts([]));
      }
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  let first = myShop?.seller;
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
        <div className="space-x-2">
          <Link href="/dashboard/create-service">
            <GenericButton className="gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.addService')}
            </GenericButton>
          </Link>
          <Link href="/dashboard/products/create">
            <GenericButton className="gap-2">
              <Plus className="h-4 w-4" />
              {t('dashboard.addProduct')}
            </GenericButton>
          </Link>
        </div>
      </div>

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
              {/* Add more filter options */}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-300">{t('dashboard.photo')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.productName')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.description')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.dateTime')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.price')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.actions')}</TableHead>
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
                <TableCell className="py-4 md:py-5 max-auto overflo">{product.description}</TableCell>
                <TableCell className="py-4">{product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</TableCell>
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
                <TableCell
                  colSpan={7}
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

