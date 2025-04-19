"use client";

import React, { useState } from "react";
import { Search, Star, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button";
import { initialProducts } from "../../utils/fakes/ProductFakes";

export const ShopProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = initialProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.originalPrice - b.originalPrice;
        case "price-high":
          return b.originalPrice - a.originalPrice;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white overflow-hidden w-64 m-4 hover:shadow-lg hover:rounded-xl transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-full h-56 object-cover rounded-xl"
                  />
                  <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
                    <Heart className="text-gray-100" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="text-md font-semibold text-gray-900 w-[60%] mb-1">
                      {product.name}
                    </h3>
                    <div className="text-green-500 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current inline-block mr-1" />
                      {product.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2 overflow">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-md text-yellow-400">
                      {product.originalPrice}
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
                    handleButton={() =>
                      alert(`Add to Cart clicked for ${product.name}`)
                    }
                    padding={"p-3"}
                    round={"rounded-full"}
                  />
                </div>
              </div>
            ))}
          </div>
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
