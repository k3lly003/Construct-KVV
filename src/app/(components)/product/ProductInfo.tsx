"use client";

import React, { useState, useEffect, useRef } from "react";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTranslations } from "@/app/hooks/useTranslations";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { productService } from "@/app/services/productServices";
import { useCartStore } from "@/store/cartStore";
import { getFallbackImage } from "@/app/utils/imageUtils";

interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  attributes?: Record<string, string>;
  details?: string[];
  rating?: number;
  reviewCount?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  image?: string | string[];
  weight?: number;
  dimensions?: string;
  categoryId?: string;
}

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo = ({ product, quantity, setQuantity }: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t } = useTranslations();
  const API_URL =
    "https://ai-product-recommender-rc4q.onrender.com/api/v1/products";

  type InteractionType = "view" | "click" | "add_to_cart";
  const postInteraction = (
    interactionType: InteractionType,
    interactionWeight: number
  ) => {
    try {
      const user = getUserDataFromLocalStorage();
      const payload = {
        product_id: (product as any).id,
        name: (product as any).name ?? "",
        description: (product as any).description ?? "",
        price: (product as any).discountedPrice ?? (product as any).price ?? 0,
        stock: (product as any).stock ?? (product as any).quantity ?? 0,
        category:
          (product as any).category ??
          (product as any).categoryName ??
          (product as any).category_title ??
          (product as any)?.category?.name ??
          "General",
        user_id: user?.id,
        interaction_weight: interactionWeight,
        interaction_type: interactionType,
      } as const;

      // eslint-disable-next-line no-console
      console.log(`[ProductInfo] ${interactionType} payload:`, payload);

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
          // eslint-disable-next-line no-console
          console.log(
            `[ProductInfo] ${interactionType} interaction response:`,
            data
          );
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(
            `[ProductInfo] ${interactionType} interaction error:`,
            error
          );
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`[ProductInfo] ${interactionType} interaction error:`, error);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success(`Added ${quantity} ${product.name} to your cart`);
      // Send external interaction (non-blocking)
      postInteraction("add_to_cart", 5);
    } catch (error: any) {
      toast.error(error.message || "Failed to add item to cart");
    }
  };

  const toggleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    // Product interaction: wishlist
    const user = getUserDataFromLocalStorage();
    if (user && user.id && user.token) {
      productService
        .postProductInteraction({
          userId: user.id,
          productId: product.id,
          type: "wishlist",
          timeSpent: 0,
          token: user.token,
        })
        .then((res) => {
          console.log("[ProductInfo] Wishlist interaction sent:", res);
        })
        .catch((err) => {
          console.log("[ProductInfo] Wishlist interaction error:", err);
        });
    }
  };

  const shareProduct = async () => {
    toast("Share link copied to clipboard");
    // Product interaction: shared
    const user = getUserDataFromLocalStorage();
    if (user && user.id && user.token) {
      productService
        .postProductInteraction({
          userId: user.id,
          productId: product.id,
          type: "shared",
          timeSpent: 0,
          token: user.token,
        })
        .then((res) => {
          console.log("[ProductInfo] Shared interaction sent:", res);
        })
        .catch((err) => {
          console.log("[ProductInfo] Shared interaction error:", err);
        });
    }
  };

  // Fallback for details: use attributes if details not present
  const details =
    product.details ||
    (product.attributes
      ? Object.entries(product.attributes).map(([k, v]) => `${k}: ${v}`)
      : []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">
          {product.name}
        </h1>
        {/* Rating */}
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating || 0)
                      ? "fill-chart-4 text-chart-4"
                      : "text-muted"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount}{" "}
              {t(dashboardFakes.productInfo.reviews)})
            </span>
          </div>
        )}
        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          <p className="text-2xl font-semibold flex justify-between w-full">
            {product.discountedPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  {product.price} Rfw
                </span>
                <span>{product.discountedPrice} Rfw</span>
              </>
            ) : (
              <>{product.price} Rfw</>
            )}
          </p>
        </div>
      </div>
      {/* Quantity and Add to Cart */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center border rounded-md">
          <GenericButton
            onClick={decrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </GenericButton>
          <span className="w-10 h-10 flex items-center justify-center font-medium">
            {quantity}
          </span>
          <GenericButton
            onClick={incrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </GenericButton>
        </div>
        <GenericButton
          className="w-full sm:flex-1 h-11 gap-2 flex items-center justify-center text-sm sm:text-base"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} />
          <span className="truncate">Add to Cart</span>
        </GenericButton>
        <GenericButton
          variant="outline"
          size="sm"
          className="h-10 w-10"
          onClick={toggleWishlist}
          aria-label={
            isWishlisted
              ? t(dashboardFakes.productInfo.removeFromWishlist)
              : t(dashboardFakes.productInfo.addToWishlist)
          }
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-destructive text-destructive" : ""}
          />
        </GenericButton>
        <GenericButton
          variant="outline"
          size="sm"
          className="h-10 w-10"
          onClick={shareProduct}
          aria-label={t(dashboardFakes.productInfo.shareProduct)}
        >
          <Share2 size={18} />
        </GenericButton>
      </div>
      {/* Product information tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="description">
            {t(dashboardFakes.productInfo.description)}
          </TabsTrigger>
          <TabsTrigger value="details">
            {t(dashboardFakes.productInfo.details)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {details.length > 0 ? (
              details.map((detail, index) => <li key={index}>{detail}</li>)
            ) : (
              <li>{t(dashboardFakes.productInfo.noDetails)}</li>
            )}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProductInfo;
