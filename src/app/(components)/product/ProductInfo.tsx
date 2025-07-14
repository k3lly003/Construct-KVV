"use client";

import { useState, useEffect, useRef } from "react";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useTranslations } from '@/app/hooks/useTranslations';
import { dashboardFakes } from '@/app/utils/fakes/DashboardFakes';

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
}

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const ProductInfo = ({ product, quantity, setQuantity }: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t } = useTranslations();

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    toast.success(`Added ${quantity} ${product.name} to your cart`);
    // Product interaction: clicked
    const user = getUserDataFromLocalStorage();
    if (user && user.id && user.token) {
      productService
        .postProductInteraction({
          userId: user.id,
          productId: product.id,
          type: "clicked",
          timeSpent: 0,
          token: user.token,
        })
        .then((res) => {
          console.log("[ProductInfo] Clicked interaction sent:", res);
        })
        .catch((err) => {
          console.log("[ProductInfo] Clicked interaction error:", err);
        });
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
              {product.rating} ({product.reviewCount} {t(dashboardFakes.productInfo.reviews)})
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
      <div className="flex gap-4 items-center">
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
        <GenericButton className="flex-1 h-10 gap-2" onClick={addToCart}>
          <ShoppingCart size={16} />
          {t(dashboardFakes.productInfo.addToCart)}
        </GenericButton>
        <GenericButton
          variant="outline"
          size="sm"
          className="h-10 w-10"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? t(dashboardFakes.productInfo.removeFromWishlist) : t(dashboardFakes.productInfo.addToWishlist)}
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
          <TabsTrigger value="description">{t(dashboardFakes.productInfo.description)}</TabsTrigger>
          <TabsTrigger value="details">{t(dashboardFakes.productInfo.details)}</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {details.length > 0 ? details.map((detail, index) => (
              <li key={index}>{detail}</li>
            )) : <li>{t(dashboardFakes.productInfo.noDetails)}</li>}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProductInfo;
