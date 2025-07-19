import Image from "next/image";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "./Button";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { productService } from "@/app/services/productServices";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

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
    product.thumbnailUrl ||
    (product.images && product.images[0]?.url) ||
    "/products/placeholder.jpg";
  const altText = (product.images && product.images[0]?.alt) || product.name;
  const name = product.name;
  const price = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const productId = product.id;

  const startTimeRef = useRef<number | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

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
    <Link href={`/product/${productId}`} className="block">
      <div className="bg-white overflow-hidden w-64 m-2 hover:shadow-lg cursor-pointer hover:rounded-xl transition-shadow h-[440px] flex flex-col">
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
              handleButton={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: price,
                  quantity: 1,
                  image: thumbnail,
                  category: product.category || "",
                  weight: product.weight || 0,
                  dimensions: product.dimensions || "",
                });
                toast.success(`Added ${product.name} to cart`);
                console.log(
                  "[ProductCard] Cart after add:",
                  JSON.parse(localStorage.getItem("kvv_cart_items") || "[]")
                );
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
