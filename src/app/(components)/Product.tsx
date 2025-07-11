"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/(components)/Button";
import { ProductFilters } from "@/app/(components)/product/ProductFilters";
import { productService } from "@/app/services/productServices";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import ProductCard from "@/app/(components)/ProductCard";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const availableCategories: string[] = ["All Products"];
  const router = useRouter();

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

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

          {/* Products */}
          {loading ? (
            <div>Loading products...</div>
          ) : (
            <div className="flex flex-wrap px-4 gap-7 justify-center lg:flex lg:justify-start">
              {filteredProducts.map((product) => (
                <>
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
                        text={"Add to cart"}
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
                </>
              ))}
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
    </div>
  );
};
