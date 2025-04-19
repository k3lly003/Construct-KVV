"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Heart, Star } from "lucide-react";
import Button from "../Button";
import { featuredProductData } from "@/app/utils/fakes/ProductFakes";


export const ProductCarousel: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-x-5">
          {featuredProductData.map((product) => (
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
                {/* Assuming Heart is a component */}
                <div className="absolute top-2 right-2 border rounded-full p-3 flex items-center justify-center cursor-pointer shadow-sm hover:bg-yellow-400 hover:border-yellow-400 transition-colors">
                  <Heart className="text-gray-100" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <div>
                    <Star className="h-4 w-4 text-yellow-400 fill-current inline-block mr-1" />
                    {product.rating}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {"Description might not be directly available"}
                </p>
                <div className="mb-2">
                    {product.discountedPrice && product.originalPrice ? (
                      <div className="w-full flex justify-between">
                        <p className="font-semibold text-yellow-400 line-through text-sm">
                          RwF {product.originalPrice.toLocaleString()}
                        </p>
                        <p className="font-semibold text-gray-900 text-md">
                          RwF {product.discountedPrice.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-900 text-md">
                        RwF{" "}
                        {product.originalPrice?.toLocaleString() ||
                          product.discountedPrice?.toLocaleString()}
                      </p>
                    )}
                  
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
        {/* NAVIGATION BUTTONS */}
        <div className="mt-6 flex justify-end space-x-2">
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronLeft className="h-5 w-5 text-amber-300" />
          </button>
          <button className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};