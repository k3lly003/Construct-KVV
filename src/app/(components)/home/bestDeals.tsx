"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Heart, Star } from "lucide-react";
import { Button } from "../Button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ProductCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 4;
  const [products, setProducts] = useState<any[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  useEffect(() => {
    async function fetchLatestProducts() {
      try {
        const res = await fetch(
          `https://construct-kvv-bn-fork.onrender.com/api/v1/products?page=1&limit=${productsPerPage}&active=true&sort=createdAt&order=desc`,
          { headers: { accept: "application/json" } }
        );
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        setProducts([]);
        console.error("Failed to fetch latest products", err);
      }
    }
    fetchLatestProducts();
  }, [productsPerPage]);

  const totalProducts = products.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + productsPerPage;
      return nextIndex >= totalProducts ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexCalc = prevIndex - productsPerPage;
      return prevIndexCalc < 0
        ? Math.max(0, totalProducts - productsPerPage)
        : prevIndexCalc;
    });
  };

  const currentProducts = products.slice(
    currentIndex,
    currentIndex + productsPerPage
  );

  const niceRatings = [4.9, 4.7, 4.5, 4.2, 4.8, 4.6, 4.3, 4.1];

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-x-5">
          {currentProducts.map((product, idx) => (
            <div
              key={product.id}
              className="bg-white overflow-hidden w-64 m-4 hover:shadow-lg hover:rounded-xl transition-shadow cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="relative">
                <Image
                  src={
                    product.thumbnailUrl ||
                    product.imageSrc ||
                    (product.images && product.images[0]?.url) ||
                    "/products/placeholder.jpg"
                  }
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
                <div className="flex justify-between text-sm text-gray-500">
                  <h3 className="text-md font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current inline-block" />
                    <span>
                      {niceRatings[(currentIndex + idx) % niceRatings.length]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {product.description ||
                    "Description might not be directly available"}
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
                        product.discountedPrice?.toLocaleString() ||
                        product.price?.toLocaleString()}
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
                  handleButton={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price:
                        product.discountedPrice ||
                        product.originalPrice ||
                        product.price,
                      quantity: 1,
                      image:
                        product.thumbnailUrl ||
                        product.imageSrc ||
                        (product.images && product.images[0]?.url) ||
                        "/products/placeholder.jpg",
                      category:
                        typeof product.category === "string"
                          ? product.category
                          : product.category?.name || "",
                      weight: product.weight || 0,
                      dimensions: product.dimensions || "",
                    });
                    toast.success(`Added ${product.name} to cart`);
                    router.push(`/product/${product.id}`);
                  }}
                  padding={"p-3"}
                  round={"rounded-full"}
                />
              </div>
            </div>
          ))}
        </div>
        {/* NAVIGATION BUTTONS */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={prevSlide}
            className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            <ChevronLeft className="h-5 w-5 text-amber-300 hover:text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="border border-amber-300 hover:bg-amber-500 hover:text-white text-amber-300 font-semibold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            <ChevronRight className="h-5 w-5 text-amber-300 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
