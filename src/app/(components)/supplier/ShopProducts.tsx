"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/(components)/Button";
import { ProductFilters } from "@/app/(components)/product/ProductFilters";
import { productService } from "@/app/services/productServices";
import { ShopService } from "@/app/services/shopServices";
import { serviceService } from "@/app/services/serviceServices";
import { getShopIdFromShop } from "@/app/utils/helper/FilterServicesFromAll";
// import { MyShopServices } from "./MyShopServices";
import { Shop } from "@/types/shop";
import router from "next/router";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";
import { useTranslations } from "@/app/hooks/useTranslations";

interface ShopProductsProps {
  shopId?: string;
  shop?: Shop;
}

export const ShopProducts: React.FC<ShopProductsProps> = ({ shopId, shop }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Product");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [myShop, setMyShop] = useState<Shop | null>(null);
  const [shopError, setShopError] = useState<string | null>(null);
  const availableCategories: string[] = ["Product", "Service"];

  // Extract the actual shop ID to use
  const actualSellerId =
    shopId || myShop?.seller?.id || (myShop ? getShopIdFromShop(myShop) : null);

  // Fetch my shop and products/services for that shop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get auth token from localStorage
        const authToken = localStorage.getItem("authToken") || "";

        // If we don't have a shopId prop, fetch my shop data
        if (!shopId && !shop?.id) {
          const shopData = await ShopService.getMyShop(authToken);
          setMyShop(shopData);
          console.log("MMMMMMAAAAAAAAAAAAAAA:", shopData);
        }

        // Use the actual shop ID to fetch products
        if (actualSellerId) {
          try {
            const authToken = localStorage.getItem("authToken") || "";
            const shopProducts = await productService.getProductsBySellerId(
              actualSellerId,
              authToken
            );
            setProducts(shopProducts);
          } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShopError("Failed to fetch shop data");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId, shop?.id, actualSellerId]);

  // Fetch services for the shop when category changes to Service
  useEffect(() => {
    if (selectedCategory === "Service" && actualSellerId) {
      const fetchServices = async () => {
        setServicesLoading(true);
        try {
          const shopServices = await serviceService.getServicesByShopId(
            actualSellerId
          );
          setServices(shopServices);
        } catch (error) {
          console.error("Error fetching services:", error);
          setServices([]);
        } finally {
          setServicesLoading(false);
        }
      };

      fetchServices();
    }
  }, [selectedCategory, actualSellerId]);

  const { t } = useTranslations();

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filter services based on search term
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-12">
        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onSelectedCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          initialProducts={[]}
          availableCategories={availableCategories}
          shop={shop}
        />

        {/* Conditional Content */}
        {selectedCategory === "Product" ? (
          <div className="flex flex-wrap gap-5 justify-center lg:flex lg:justify-start">
            {loading ? (
              <div className="w-full text-center py-12 text-gray-500">
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500">
                {actualSellerId
                  ? "No products found for this shop."
                  : "Shop not found."}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden w-64 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div className="relative">
                    {product.thumbnailUrl ? (
                      <Image
                        src={product.thumbnailUrl}
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
                      handleButton={() =>
                        alert(`Add to Cart clicked for ${product.name}`)
                      }
                      padding={"p-3"}
                      round={"rounded-full"}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Services section
          <div className="flex flex-wrap gap-5 justify-center lg:flex lg:justify-start">
            {servicesLoading ? (
              <div className="w-full text-center py-12 text-gray-500">
                Loading services...
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500">
                {actualSellerId
                  ? "No services found for this shop."
                  : "Shop not found."}
              </div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white overflow-hidden w-72 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow"
                >
                  <section className="p-0">
                    {/* Service Image */}
                    <div className="px-4 pb-4">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border">
                        <Image
                          src={
                            service.gallery && service.gallery.length > 0
                              ? service.gallery[0]
                              : "/empty-cart.png"
                          }
                          width={100}
                          height={100}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {(service as any).provider?.name || "Unknown"}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h1 className="font-bold text-gray-900 text-lg leading-tight mb-4 line-clamp-2">
                        {service.title}
                      </h1>

                      {/* Pricing and Location Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="font-semibold text-gray-900">
                            {(service as any).pricing?.basePrice
                              ? `${(service as any).pricing.basePrice} Rwf`
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Location</p>
                          <p className="font-semibold text-gray-900">
                            {(service as any).location?.city || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Features as Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {Array.isArray(service.features) &&
                          service.features.map((feature: string) => (
                            <span
                              key={feature}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                      </div>
                    </div>
                  </section>

                  <section className="p-4 pt-0">
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        text="View"
                        texSize={"text-sm"}
                        hoverBg={"hover:bg-gray-800"}
                        borderCol={"border-gray-300"}
                        bgCol={"bg-gray-100"}
                        textCol={"text-gray-800"}
                        border={"border-1"}
                        handleButton={() =>
                          router.push(`/service/${service.id}`)
                        }
                        padding={"p-2"}
                        round={"rounded"}
                      />
                      <Button
                        text="Add to cart"
                        texSize={"text-sm"}
                        hoverBg={"hover:bg-amber-700"}
                        borderCol={"border-gray-900"}
                        bgCol={"bg-gray-900"}
                        textCol={"text-white"}
                        border={"border-1"}
                        handleButton={() =>
                          alert(`Add to Cart clicked for ${service.title}`)
                        }
                        padding={"p-2"}
                        round={"rounded"}
                      />
                    </div>
                  </section>
                </div>
              ))
            )}
          </div>
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
  );
};
