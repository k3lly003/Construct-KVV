import Image from "next/image";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { productService } from "@/app/services/productServices";

interface ProductCardProps {
  product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Extract fields from backend product
  const thumbnail =
    product.thumbnailUrl ||
    (product.images && product.images[0]?.url) ||
    "/products/placeholder.jpg";
  const altText = (product.images && product.images[0]?.alt) || product.name;
  const name = product.name;
  const price = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  const productId = product.id;

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    // On mount, send 'viewed' interaction
    const user = getUserDataFromLocalStorage();
    if (user && user.id && user.token) {
      productService
        .postProductInteraction({
          userId: user.id,
          productId: productId,
          type: "viewed",
          timeSpent: 0,
          token: user.token,
        })
        .then((res) => {
          console.log("[ProductCard] Viewed interaction sent:", res);
        })
        .catch((err) => {
          console.log("[ProductCard] Viewed interaction error:", err);
        });
    }
    return () => {
      // On unmount, send 'viewed' with time spent if not already sent as 'clicked'
      if (startTimeRef.current) {
        const timeSpent = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        if (user && user.id && user.token) {
          productService
            .postProductInteraction({
              userId: user.id,
              productId: productId,
              type: "viewed",
              timeSpent,
              token: user.token,
            })
            .then((res) => {
              console.log(
                "[ProductCard] Viewed (unmount) interaction sent:",
                res
              );
            })
            .catch((err) => {
              console.log(
                "[ProductCard] Viewed (unmount) interaction error:",
                err
              );
            });
        }
      }
    };
  }, [productId]);

  const handleClick = () => {
    // On click, send 'clicked' interaction with time spent
    const user = getUserDataFromLocalStorage();
    const timeSpent = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;
    if (user && user.id && user.token) {
      productService
        .postProductInteraction({
          userId: user.id,
          productId: productId,
          type: "clicked",
          timeSpent,
          token: user.token,
        })
        .then((res) => {
          console.log("[ProductCard] Clicked interaction sent:", res);
        })
        .catch((err) => {
          console.log("[ProductCard] Clicked interaction error:", err);
        });
    }
  };

  return (
    <Link
      href={`/product/${productId}`}
      className="block"
      onClick={handleClick}
    >
      <div className="relative hover:shadow-md transition-shadow duration-200 space-y-3 mb-5 cursor-pointer">
        <div className="aspect-w-1 h-40 w-full overflow-hidden">
          <Image
            src={thumbnail}
            alt={altText}
            width={300}
            height={300}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/products/placeholder.jpg";
            }}
          />
        </div>
        <div className="p-4 h-30 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-900">
            <span aria-hidden="true" className="absolute inset-0" />
            {name}
          </h3>
          <div className="mt-1 flex items-center">
            {/* Optionally add a star rating here if available */}
            {rating > 0 && (
              <>
                <span className="text-yellow-500">★</span>
                <p className="ml-1 text-sm text-gray-500">{rating}</p>
                {reviewCount > 0 && (
                  <span className="ml-1 text-xs text-gray-400">
                    ({reviewCount})
                  </span>
                )}
              </>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {originalPrice && (
              <span className="line-through text-gray-400 text-sm">
                RwF {originalPrice.toLocaleString()}
              </span>
            )}
            <p className="font-semibold text-gray-900">
              RwF {price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
