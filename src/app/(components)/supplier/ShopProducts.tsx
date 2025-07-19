"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/(components)/Button";
import { ProductFilters } from "@/app/(components)/product/ProductFilters";
import { productService } from '@/app/services/productServices';
import { ShopService } from '@/app/services/shopServices';
import { getShopIdFromShop } from '@/app/utils/helper/FilterServicesFromAll';
import { MyShopServices } from './MyShopServices';
import { Shop } from '@/types/shop';
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
  const [loading, setLoading] = useState(false);
  const [myShop, setMyShop] = useState<Shop | null>(null);
  const [shopError, setShopError] = useState<string | null>(null);
  // const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const availableCategories: string[] = ["Product", "Service"];

  // Fetch my shop and products for that shop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get auth token from localStorage
        const authToken = localStorage.getItem('authToken') || '';
        
        // Fetch my shop data
        const shopData = await ShopService.getMyShop(authToken);
        setMyShop(shopData);
        
        // Extract shop ID and fetch products for that shop
        const shopId = getShopIdFromShop(shopData);
        if (shopId) {
          // For now, we'll use getAllProducts and filter by shop
          // You might want to create a getProductsByShopId method in productService
          const allProducts = await productService.getAllProducts();
          const shopProducts = allProducts.filter((product: any) => 
            product.shopId === shopId || product.sellerId === shopId
          );
          setProducts(shopProducts);
        } else {
          setProducts([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setShopError('Failed to fetch shop data');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const { t } = useTranslations();

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Extract shop ID for services
  const actualShopId = shopId || shop?.id || (myShop ? getShopIdFromShop(myShop) : null);

  if (shopError) {
    return <div className="p-6 text-red-500">Error loading shop data</div>;
  }

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
                <div>Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div>No products found for this shop.</div>
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
                        handleButton={() => alert(`Add to Cart clicked for ${product.name}`)}
                        padding={"p-3"}
                        round={"rounded-full"} />
                    </div>
                  </div>
              ))
            )}
          </div>
          ) : (
            actualShopId ? (
              <MyShopServices shopId={actualShopId} searchTerm={searchTerm} />
            ) : (
              <div className="w-full text-center py-12 text-gray-500">
                Shop ID not found.
              </div>
            )
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
