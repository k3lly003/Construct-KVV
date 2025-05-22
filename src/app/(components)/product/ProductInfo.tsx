"use client";

import { useState } from "react";
import { Minus, Plus, Heart, Share2, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
}

interface ProductInfoProps {
  product: Product;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function ProductInfo({
  product,
  quantity,
  setQuantity,
}: ProductInfoProps) {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{product.name}</h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-chart-4 text-chart-4" : "text-muted"}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
        
        {/* Price */}
        <p className="text-2xl font-semibold mt-4">{product.price} Rfw</p>
      </div>
      
      {/* Quantity and Add to Cart */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center border rounded-md">
          <button
            onClick={decrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 h-10 flex items-center justify-center font-medium">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <Button 
          className="flex-1 h-10 gap-2"
          onClick={addToCart}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18} 
            className={isWishlisted ? "fill-destructive text-destructive" : ""}
          />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={shareProduct}
          aria-label="Share product"
        >
          <Share2 size={18} />
        </Button>
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
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
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