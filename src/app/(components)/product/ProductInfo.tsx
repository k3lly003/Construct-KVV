"use client";

import { useState } from "react";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
}: ProductInfoProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to your cart`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const shareProduct = () => {
    toast("Share link copied to clipboard");
  };

  // Fallback for details: use attributes if details not present
  const details = product.details || (product.attributes ? Object.entries(product.attributes).map(([k, v]) => `${k}: ${v}`) : []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
        {/* Rating */}
        {(product.rating !== undefined && product.reviewCount !== undefined) && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating || 0) ? "fill-chart-4 text-chart-4" : "text-muted"}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        )}
        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          <p className="text-2xl font-semibold">
            {product.discountedPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">{product.price} Rfw</span>
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
        <GenericButton 
          className="flex-1 h-10 gap-2"
          onClick={addToCart}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </GenericButton>
        <GenericButton
          variant="outline"
          size="sm"
          className="h-10 w-10"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
          aria-label="Share product"
        >
          <Share2 size={18} />
        </GenericButton>
      </div>
      {/* Product information tabs */}
      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            {details.length > 0 ? details.map((detail, index) => (
              <li key={index}>{detail}</li>
            )) : <li>No details available.</li>}
          </ul>
        </TabsContent>
        <TabsContent value="shipping" className="mt-4">
          <div className="space-y-4 text-muted-foreground">
            <p>Free standard shipping on all orders over $100.</p>
            <p>Estimated delivery time: 3-5 business days.</p>
            <p>Express shipping available at checkout.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default ProductInfo;