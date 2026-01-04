"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from '@/app/hooks/useTranslations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ShoppingCart, Filter, Search, Grid, List, Download, Heart } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { designService } from "@/app/services/designService";
import { useDebounce } from "@/hooks/useDebounce";

// Design interface based on the backend API
interface Design {
  id: string;
  title: string;
  description: string;
  buildingDescription: string;
  price: number;
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LANDSCAPE' | 'INTERIOR' | 'URBAN_PLANNING' | 'RENOVATION' | 'SUSTAINABLE' | 'LUXURY' | 'AFFORDABLE';
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  images: string[];
  documents: string[];
  tags: string[];
  isActive: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  architectId: string;
  architect: {
    id: string;
    businessName: string;
    user: {
      firstName: string;
      lastName: string;
      profilePic?: string;
    };
  };
}

interface DesignListResponse {
  success: boolean;
  data: Design[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const DesignMarketplace: React.FC = () => {
  const { t } = useTranslations();
  const { role: userRole, isHydrated } = useUserStore();
  const router = useRouter();

  // State management
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: 'any',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Purchase modal
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Debounce search term to reduce API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch designs from API using the new search service
  const fetchDesigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || undefined : undefined;

      // Prepare search parameters
      const searchParams = {
        search: debouncedSearch || undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        bedrooms: filters.bedrooms !== 'any' ? Number(filters.bedrooms) : undefined,
        bathrooms: filters.bathrooms !== 'any' ? Number(filters.bathrooms) : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder as 'asc' | 'desc',
        page: pagination.page,
        limit: pagination.limit,
      };

      // Remove undefined values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key as keyof typeof searchParams] === undefined) {
          delete searchParams[key as keyof typeof searchParams];
        }
      });

      const response = await designService.searchDesigns(searchParams, token);
      
      if (response.success) {
        setDesigns(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages
        }));
      } else {
        throw new Error('Failed to load designs');
      }
    } catch (err: any) {
      console.error('Error fetching designs:', err);
      setError(err.message || 'Failed to load designs');
      setDesigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle design purchase
  const handlePurchase = async (design: Design) => {
    if (!isHydrated || !userRole) {
      toast.error('Please sign in to purchase designs');
      router.push('/signin');
      return;
    }

    setSelectedDesign(design);
    setPurchaseModalOpen(true);
  };

  const confirmPurchase = async () => {
    if (!selectedDesign) return;

    setPurchasing(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please sign in to purchase designs');
        router.push('/signin');
        return;
      }

      const response = await fetch('/api/v1/design/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designId: selectedDesign.id,
          paymentMethod: 'card'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Design purchased successfully!');
        setPurchaseModalOpen(false);
        setSelectedDesign(null);
        // Optionally refresh the designs list
        fetchDesigns();
      } else {
        toast.error(data.message || 'Failed to purchase design');
      }
    } catch (err: any) {
      console.error('Error purchasing design:', err);
      toast.error('Failed to purchase design');
    } finally {
      setPurchasing(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Apply filters (now handled automatically via useEffect)
  const applyFilters = () => {
    // Filters are applied automatically via useEffect
    // This function kept for backward compatibility with UI
    fetchDesigns();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'any',
      bathrooms: 'any',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Load designs on component mount and when filters/pagination change
  useEffect(() => {
    fetchDesigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.bathrooms, filters.sortBy, filters.sortOrder]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'RESIDENTIAL', label: 'Residential' },
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'INDUSTRIAL', label: 'Industrial' },
    { value: 'LANDSCAPE', label: 'Landscape' },
    { value: 'INTERIOR', label: 'Interior' },
    { value: 'URBAN_PLANNING', label: 'Urban Planning' },
    { value: 'RENOVATION', label: 'Renovation' },
    { value: 'SUSTAINABLE', label: 'Sustainable' },
    { value: 'LUXURY', label: 'Luxury' },
    { value: 'AFFORDABLE', label: 'Affordable' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Popular' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-900">
        <div className="absolute inset-0">
          <img
            src="/Desing market.jpg"
            alt="Design Marketplace"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="text-mid text-amber-500 font-semibold mb-4 block">
                Professional Architectural Designs
              </span>
              <h1 className="text-large font-bold mb-6 text-white">
                Design Marketplace
              </h1>
              <p className="text-mid text-gray-200 mb-8 max-w-3xl mx-auto">
                Discover and purchase architectural designs from professional architects. 
                Transform your vision into reality with our curated collection of innovative designs.
              </p>
              
              {/* Hero Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-mid font-semibold rounded-full shadow-lg transition-all flex items-center gap-2"
                  onClick={() => document.getElementById('designs-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Search className="w-5 h-5" />
                  Browse Designs
                </button>
                {isHydrated && userRole && (
                  <Link href="/design-orders">
                    <button 
                      className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-mid font-semibold rounded-full shadow-lg transition-all bg-transparent flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      View Your Orders
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-title font-bold text-amber-800 mb-4">
              Explore Our Design Collection
            </h2>
            <p className="text-mid text-amber-700 max-w-3xl mx-auto">
              Browse through our carefully curated collection of architectural designs, 
              from modern residential homes to commercial buildings and sustainable structures.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="block text-small font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search designs..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-small font-medium mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-small font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-small font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Bedrooms */}
              <div>
                <label className="block text-small font-medium mb-2">Bedrooms</label>
                <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-small font-medium mb-2">Bathrooms</label>
                <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-small font-medium mb-2">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters} className="bg-amber-500 hover:bg-amber-600">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Results Header */}
          <div id="designs-section" className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-mid font-semibold text-amber-800">
              {loading ? 'Loading...' : `${pagination.total} designs found`}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading designs</p>
                <p className="text-small">{error}</p>
                <Button onClick={fetchDesigns} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Designs Grid */}
        {!loading && !error && (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {designs.map((design) => (
                <Card key={design.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={design.images[0] || '/placeholder-design.jpg'}
                      alt={design.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="secondary" className="bg-white/90 text-amber-800">
                        {design.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <CardTitle className="text-mid mb-2 line-clamp-2">{design.title}</CardTitle>
                    <CardDescription className="text-small mb-3 line-clamp-2">
                      {design.description}
                    </CardDescription>
                    
                    {/* Design specs */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {design.bedrooms && (
                        <Badge variant="outline" className="text-small">
                          {design.bedrooms} bed
                        </Badge>
                      )}
                      {design.bathrooms && (
                        <Badge variant="outline" className="text-small">
                          {design.bathrooms} bath
                        </Badge>
                      )}
                      {design.squareFootage && (
                        <Badge variant="outline" className="text-small">
                          {design.squareFootage} sq ft
                        </Badge>
                      )}
                    </div>

                    {/* Architect info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                        <span className="text-small font-medium text-amber-800">
                          {design.architect.user.firstName[0]}
                        </span>
                      </div>
                      <span className="text-small text-gray-600">
                        {design.architect.businessName}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-small text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{design.rating.toFixed(1)}</span>
                        <span>({design.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{design.views}</span>
                      </div>
                    </div>

                    {/* Price and actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-mid font-bold text-amber-600">
                        ${design.price.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/design-marketplace/${design.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(design)}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? 'default' : 'outline'}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        className={pagination.page === page ? 'bg-amber-500 hover:bg-amber-600' : ''}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && designs.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-mid font-semibold text-gray-800 mb-2">No designs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      {/* Purchase Modal */}
      {purchaseModalOpen && selectedDesign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Purchase Design</CardTitle>
              <CardDescription>
                Confirm your purchase of "{selectedDesign.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Price:</span>
                  <span className="text-mid font-bold text-amber-600">
                    ${selectedDesign.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Architect:</span>
                  <span>{selectedDesign.architect.businessName}</span>
                </div>
                <div className="text-small text-gray-600">
                  After purchase, you'll receive access to all design files and documents.
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPurchaseModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPurchase}
                disabled={purchasing}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DesignMarketplace;
