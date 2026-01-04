'use client';

import React, { useState, useEffect } from 'react';
import { serviceService } from '@/app/services/serviceServices';
import { ShopService } from '@/app/services/shopServices';
import { getShopIdFromShop } from '@/app/utils/helper/FilterServicesFromAll';
import { getCategoryName } from '@/app/utils/helper/getCategoryName';
import { useCategories } from '@/app/hooks/useCategories';
import { Service } from '@/types/service';
import { Shop } from '@/types/shop';
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
import { ChevronDown, Funnel, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslations } from '@/app/hooks/useTranslations';
import Link from 'next/link';

// No need for extended interface since we're using the base Service type

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

interface MyServiceProps {
  searchTerm?: string;
}

const MyService = ({ searchTerm = "" }: MyServiceProps) => {
  const { t } = useTranslations();
  const { categories } = useCategories();
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [myShop, setMyShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shopError, setShopError] = useState<string | null>(null);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);

  // Fetch my shop and services for that shop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get auth token from localStorage or your auth context
        const authToken = localStorage.getItem('authToken') || '';
        
        // Fetch my shop data
        const shopData = await ShopService.getMyShop(authToken);
        setMyShop(shopData);
        
        // Extract shop ID and fetch services for that shop
        const shopId = getShopIdFromShop(shopData);
        if (shopId) {
          const shopServices = await serviceService.getServicesByShopId(shopId);
          setServices(shopServices);
        } else {
          setServices([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setShopError('Failed to fetch shop data');
        toast.error('Failed to fetch data');
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on the search term
  const searchedServices = services.filter((service) =>
    Object.values(service).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalResults = searchedServices.length;
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentServices = searchedServices.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Remove the handleSearchChange function since search is now controlled by parent

  const handleResultsPerPageChange = (value: string) => {
    setResultsPerPage(parseInt(value));
    setCurrentPage(1); // Reset page on results per page change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      // You'll need to implement deleteService in serviceService
      // await serviceService.deleteService(selectedService.id, authToken);
      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedService(null);
      // Refresh service list
      if (myShop) {
        const shopId = getShopIdFromShop(myShop);
        if (shopId) {
          const shopServices = await serviceService.getServicesByShopId(shopId);
          setServices(shopServices);
        }
      }
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  // Edit handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !editForm) return;
    try {
      // You'll need to implement updateService in serviceService
      // await serviceService.updateService(selectedService.id, editForm, authToken);
      toast.success("Service updated successfully");
      setEditDialogOpen(false);
      setSelectedService(null);
      // Refresh service list
      if (myShop) {
        const shopId = getShopIdFromShop(myShop);
        if (shopId) {
          const shopServices = await serviceService.getServicesByShopId(shopId);
          setServices(shopServices);
        }
      }
    } catch (err) {
      toast.error("Failed to update service");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (shopError) {
    return <div className="p-6 text-red-500">Error loading shop data</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-300">{t('dashboard.photo')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.serviceName')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.category')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.location')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.price')}</TableHead>
              <TableHead className="text-amber-300">{t('dashboard.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium py-4">
                  {service.gallery && service.gallery.length > 0 ? (
                    <img src={service.gallery[0]} alt={service.title} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <span>No Image</span>
                  )}
                </TableCell>
                <TableCell className="py-2">{service.title}</TableCell>
                <TableCell className="py-2 md:py-5 max-auto overflo">{getCategoryName(service.category, categories)}</TableCell>
                <TableCell className="py-2">
                  {(service as any).location?.city || service.location || "-"}
                </TableCell>
                <TableCell className="">
                  {(service as any).pricing?.basePrice 
                    ? `${(service as any).pricing.basePrice} Rfw` 
                    : service.pricing 
                    ? `${service.pricing} Rfw` 
                    : "-"}
                </TableCell>
                <TableCell className="flex gap-3 my-5">
                  <Trash2
                    className="cursor-pointer hover:text-red-500 w-[20px]"
                    onClick={() => {
                      setSelectedService(service);
                      setDeleteDialogOpen(true);
                    }}
                  />
                  <Pencil
                    className="cursor-pointer hover:text-green-400 w-[20px]"
                    onClick={() => {
                      setSelectedService(service);
                      setEditForm({ ...service });
                      setEditDialogOpen(true);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {currentServices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-red-500 text-center py-4"
                >
                  {t('dashboard.noServicesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalResults > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-small text-muted-foreground">
            {t('dashboard.showingResults', { start: startIndex + 1, end: Math.min(endIndex, totalResults), total: totalResults })}
          </p>
          <div className="flex items-center space-x-4">
            <Pagination
              total={totalPages}
              current={currentPage}
              onPageChange={handlePageChange}
            />
            <div className="flex items-center space-x-2">
              <p className="text-small text-muted-foreground">{t('dashboard.resultsPerPage')}</p>
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
            <DialogTitle>{t('dashboard.deleteService')}</DialogTitle>
          </DialogHeader>
          <p>{t('dashboard.deleteServiceConfirm', { name: selectedService?.title })}</p>
          <DialogFooter>
            <DialogClose asChild>
              <GenericButton variant="outline">{t('dashboard.cancel')}</GenericButton>
            </DialogClose>
            <GenericButton
              onClick={handleDelete}
              disabled={isLoading}
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
            <DialogTitle>{t('dashboard.editService')}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image Preview at the top */}
              <div className="flex justify-center mb-4">
                {editForm.gallery && editForm.gallery.length > 0 ? (
                  <img src={editForm.gallery[0]} alt={editForm.title} className="w-24 h-24 object-cover rounded" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div>
                <label className="block text-small font-medium">{t('dashboard.title')}</label>
                <Input
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-small font-medium">{t('dashboard.description')}</label>
                <Input
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-small font-medium">{t('dashboard.category')}</label>
                <Input
                  value={editForm.category}
                  onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-small font-medium">{t('dashboard.pricing')}</label>
                <Input
                  value={editForm.pricing}
                  onChange={e => setEditForm({ ...editForm, pricing: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <GenericButton variant="outline">{t('dashboard.cancel')}</GenericButton>
                </DialogClose>
                <GenericButton type="submit" disabled={isLoading}>
                  {t('dashboard.saveChanges')}
                </GenericButton>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MyService; 