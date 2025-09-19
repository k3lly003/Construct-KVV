import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { getFallbackImage } from "@/app/utils/imageUtils";

interface ProductCardProps {
  product: any;
  showHighlyRecommended?: boolean;
  isHighlyRecommended?: boolean;
}

const ProductCard = ({
  product,
  showHighlyRecommended = false,
  isHighlyRecommended = false,
}: ProductCardProps) => {
  const thumbnail =
    getFallbackImage(
      product.thumbnailUrl || (product.images && product.images[0]?.url),
      "product"
    ) || "/products/placeholder.jpg";
  const altText = (product.images && product.images[0]?.alt) || product.name;
  const name = product.name;
  const price = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const productId = product.id;

  const addToCart = useCartStore((state) => state.addToCart);
  const hasSentViewRef = useRef<boolean>(false);

  type InteractionType = "view" | "click" | "add_to_cart";
  const API_BASE =
    process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL;
  const API_URL = `${API_BASE}/api/v1/products`;

  const postInteraction = (
    interactionType: InteractionType,
    interactionWeight: number
  ) => {
    try {
      const user = getUserDataFromLocalStorage();
      const payload = {
        product_id: product.id,
        name: product.name ?? "",
        description: product.description ?? "",
        price: product.discountedPrice ?? product.price ?? 0,
        stock: product.stock ?? product.quantity ?? 0,
        category:
          product.category ??
          product.categoryName ??
          product.category_title ??
          product?.category?.name ??
          "General",
        user_id: user?.id,
        interaction_weight: interactionWeight,
        interaction_type: interactionType,
      } as const;

      console.log(`[ProductCard] ${interactionType} payload:`, payload);

      // Fire-and-forget; do not await to avoid blocking UI
      fetch(API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          console.log(
            `[ProductCard] ${interactionType} interaction response:`,
            data
          );
        })
        .catch((error) => {
          console.log(
            `[ProductCard] ${interactionType} interaction error:`,
            error
          );
        });
    } catch (error) {
      console.log(`[ProductCard] ${interactionType} interaction error:`, error);
    }
  };

  const handleMouseEnter = () => {
    if (hasSentViewRef.current) return;
    hasSentViewRef.current = true;
    postInteraction("view", 1);
  };

  const handleCardClick = () => {
    postInteraction("click", 2);
  };

  return (
    <Link
      href={`/product/${productId}`}
      className="block"
      onClick={handleCardClick}
    >
      <div
        className="bg-white overflow-hidden w-64 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow h-[440px] flex flex-col"
        onMouseEnter={handleMouseEnter}
      >
        <div className="relative">
          <Image
            src={thumbnail}
            alt={altText}
            width={300}
            height={224}
            className="w-full h-56 object-cover rounded-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/products/placeholder.jpg";
            }}
          />
          {/* Show Highly Recommended badge in the top right corner if needed */}
          {showHighlyRecommended && isHighlyRecommended && (
            <span
              className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg"
              style={{ padding: "8px 16px" }}
            >
              Highly Recommended
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 justify-between p-4">
          <div>
            <h3 className="text-md font-semibold text-gray-900 w-full mb-1 text-left">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mb-2 overflow text-left min-h-[40px]">
              {product.description}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                {originalPrice && (
                  <span className="line-through text-gray-400 text-sm mr-2">
                    RwF {originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="font-semibold text-md text-yellow-400">
                  {price} <span className="text-sm text-yellow-400">Rwf</span>
                </span>
              </div>
            </div>
            <Button
              text={"Add to cart"}
              texSize={"text-sm"}
              hoverBg={"hover:bg-yellow-400"}
              borderCol={"border-yellow-300"}
              bgCol={"white"}
              textCol={"text-gray-800"}
              border={"border-1"}
              handleButton={async () => {
                try {
                  await addToCart(product.id, 1);
                  toast.success(`Added ${product.name} to cart`);
                  // Send interaction after successful add to cart
                  postInteraction("add_to_cart", 5);
                  return true;
                } catch (error: any) {
                  toast.error(error.message || "Failed to add item to cart");
                  return false;
                }
              }}
              padding={"p-3"}
              round={"rounded-full"}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
