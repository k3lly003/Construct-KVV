"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState("Product");
  const [sortBy, setSortBy] = useState("featured");
  const availableCategories: string[] = ["Product", "Service"];
  const router = useRouter();
  const { t } = useTranslations();

  // Update search term when URL params change
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            onSearchTermChange={setSearchTerm}
            initialProducts={[]}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            availableCategories={availableCategories}
          />

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
            ) : (
              <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
                {filteredProducts.map((product, index) => (
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
                          className="w-full h-56 object-cover rounded-xl"
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
                      <p className="text-sm text-gray-500 mb-2 overflow">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-md text-yellow-400">
                          {product.price}
                          <span className="text-sm text-yellow-400"> Rwf</span>
                        </p>
                      </div>
                      <Button
                        text={t(dashboardFakes.common.addToCart)}
                        texSize={"text-sm"}
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
                ))}
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
          <div className="mt-6 flex justify-center space-x-2">
            <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
              <ChevronLeft className="h-5 w-5 text-amber-300" />
            </button>
            <div className="flex justify-center items-center gap-3">
              <Link href={""}>01</Link>
              <Link href={""}>02</Link>
              <Link href={""}>03</Link>
              <Link href={""}>04</Link>
            </div>
            <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
