"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/(components)/Button";
import { ProductFilters } from "@/app/(components)/product/ProductFilters";
import { ServiceGrid } from "@/app/(components)/service/service-grid";
import { productService } from "@/app/services/productServices";
import { serviceService } from "@/app/services/serviceServices";
import { Product } from "@/types/product";
import { Service } from "@/types/service";
import { useRouter, useSearchParams } from "next/navigation";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";
import { useTranslations } from "@/app/hooks/useTranslations";
import { getFallbackImage } from "@/app/utils/imageUtils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState("Product");
  const [sortBy, setSortBy] = useState("featured");
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // PRODUCTS PER PAGE
  // END OF PAGINATION STATE
  const availableCategories: string[] = ["Product", "Service"];
  const router = useRouter();
  const { t } = useTranslations();
  // Debounce search term to reduce rapid re-renders
  const debouncedSearch = useDebounce(searchTerm, 250);
  // Update search term when URL params change
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Fetch all products once for the Product tab
  useEffect(() => {
    if (selectedCategory !== "Product") return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getAllProducts();
        setProducts(response);
        console.log("Fetched products:", response); // TODO remove when API is stable
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Fetch services when category changes to "Service"
  useEffect(() => {
    if (selectedCategory === "Service" && services.length === 0) {
      const fetchServices = async () => {
        setServicesLoading(true);
        try {
          const data = await serviceService.getServices();
          console.log("Fetched services data:", data);
          console.log("Services data type:", typeof data);
          console.log("Is array:", Array.isArray(data));
          setServices(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Error fetching services:", err);
          setServices([]);
        } finally {
          setServicesLoading(false);
        }
      };
      fetchServices();
    }
  }, [selectedCategory, services.length]);

  // Handle search term change and reset pagination
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return products;
    }

    const normalizedSearch = debouncedSearch.toLowerCase();

    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(normalizedSearch);
      const descriptionMatch = product.description?.toLowerCase().includes(normalizedSearch);

      return nameMatch || descriptionMatch;
    });
  }, [products, debouncedSearch]);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...filteredProducts];

    // switch (sortBy) {
    //   case "price-low":
    //     nextProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    //     break;
    //   case "price-high":
    //     nextProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    //     break;
    //   case "newest":
    //     nextProducts.sort(
    //       (a, b) =>
    //         new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    //     );
    //     break;
    //   default:
    //     nextProducts.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    // }

    return nextProducts;
  }, [filteredProducts, sortBy]);

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // RESET TO PAGE 1 WHEN SEARCH TERM OR CATEGORY CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Filter services
  // const filteredServices = Array.isArray(services)
  //   ? services.filter((service) => {
  //       const matchesSearch = service.title
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase());
  //       return matchesSearch;
  //     })
  //   : [];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-12">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <ProductFilters
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchChange}
            initialProducts={[]}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            availableCategories={availableCategories}
          />

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Error loading products</p>
              <p className="text-small">{error}</p>
            </div>
          )}

          {/* Conditional Content */}
          {selectedCategory === "Product" ? (
            loading ? (
              <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse overflow-hidden w-64 m-2 rounded-xl"
                  >
                    <div className="w-full h-56 bg-gray-200" />
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-mid mb-2">
                  {searchTerm
                    ? `No products found for "${searchTerm}"`
                    : "No products available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-amber-500 hover:text-amber-600 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
                {/* SHOW PAGINATED PRODUCTS */}
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="bg-white overflow-hidden w-64 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <div className="relative">
                        {product.thumbnailUrl ? (
                          <Image
                            src={getFallbackImage(
                              product.thumbnailUrl,
                              "product"
                            )}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="w-full h-56 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-56 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-2 right-2 border text-gray-100 rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
                          <Heart className="text-gray-100" />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between">
                          <h3 className="text-md font-semibold text-gray-900 w-[60%] mb-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-small text-gray-500 mb-2 overflow">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-md text-yellow-400">
                            {product.price}
                            <span className="text-small text-yellow-400"> Rwf</span>
                          </p>
                        </div>
                        <Button
                          text={t(dashboardFakes.common.addToCart)}
                          texSize={"text-small"}
                          hoverBg={"hover:bg-yellow-400"}
                          borderCol={"border-yellow-300"}
                          bgCol={"white"}
                          textCol={"text-gray-800"}
                          border={"border-1"}
                          handleButton={async (e) => {
                            try {
                              const { addToCart } = useCartStore.getState();
                              await addToCart(product.id, 1);
                              toast.success(`Added ${product.name} to cart`);
                              return true;
                            } catch (error: any) {
                              toast.error(
                                error.message || "Failed to add item to cart"
                              );
                              return false;
                            }
                          }}
                          padding={"p-3"}
                          round={"rounded-full"}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center py-12">
                    <p className="text-gray-500 text-mid">No products found matching your search.</p>
                  </div>
                )}
                {/* END OF PAGINATED PRODUCTS */}
              </div>
            )
          ) : (
            <ServiceGrid
              // loading={servicesLoading}
              // services={filteredServices}
              searchQuery={searchTerm}
            />
          )}
          {/* PAGINATION BUTTONS */}
          {/* SHOW PAGINATION BUTTONS IF THERE ARE MORE THAN 1 PAGE AND PRODUCTS ARE FOUND */}
          {selectedCategory === "Product" && sortedProducts.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`border border-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline transition-colors ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-amber-500 hover:text-white text-amber-300 cursor-pointer"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex justify-center items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded font-semibold transition-colors ${
                          currentPage === pageNum
                            ? "bg-amber-500 text-white"
                            : "text-amber-300 hover:bg-amber-100 hover:text-amber-600"
                        }`}
                      >
                        {String(pageNum).padStart(2, "0")}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="text-amber-300 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`border border-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline transition-colors ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-amber-500 hover:text-white text-amber-300 cursor-pointer"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
          {/* END OF PAGINATION BUTTONS */}
        </div>
      </div>
    </div>
  );
};
