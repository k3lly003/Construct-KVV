"use client";

import React, { useEffect, useState } from "react";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import Reviews from "@/app/(components)/product/Reviews";
import RelatedProducts from "@/app/(components)/product/RelatedProducts";
import ProductView from "@/app/(components)/product/ProductView";
import ReviewDialog from "@/app/(components)/product/ReviewDialog";
import { productService } from "@/app/services/productServices";
import { ProductViewSkeleton } from "@/app/utils/skeleton/ProductSkeletons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { GenericButton } from "@/components/ui/generic-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { id } = React.use(params);
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [eligibleOrders, setEligibleOrders] = useState<any[]>([]);

  // Fetch product
  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const prod = await productService.getProductById(id);
        if (isMounted) setProduct(prod);
      } catch {
        if (isMounted) setError("Product not found.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch reviews
  const fetchReviews = React.useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const reviews = await productService.getProductReviews(id, 1, 10);
      setReviews(reviews);
    } catch {
      setReviewsError("Failed to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Fetch eligible orders for review
  useEffect(() => {
    let isMounted = true;
    async function fetchEligibleOrders() {
      if (!product) return;
      try {
        const authToken =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : undefined;
        const orders = await productService.getPaidOrdersForUser(
          1,
          50,
          authToken || undefined
        );
        const eligible = orders.filter(
          (order: any) =>
            order.items &&
            order.items.some((item: any) => item.productId === product.id)
        );
        if (isMounted) setEligibleOrders(eligible);
      } catch {
        if (isMounted) setEligibleOrders([]);
      }
    }
    fetchEligibleOrders();
    return () => {
      isMounted = false;
    };
  }, [product]);

  return (
    <div className="w-[100%]">
      {product && (
        <Head>
          <title>
            {product.name
              ? `${product.name} | Construct KVV`
              : "Product | Construct KVV"}
          </title>
          <meta
            name="description"
            content={
              product.description || "View product details at KVV Construction."
            }
          />
          <meta
            property="og:title"
            content={
              product.name
                ? `${product.name} | Construct KVV`
                : "Product | Construct KVV"
            }
          />
          <meta
            property="og:description"
            content={
              product.description || "View product details at KVV Construction."
            }
          />
          <meta property="og:type" content="product" />
          <meta
            property="og:url"
            content={`https://www.constructkvv.com/product/${product.id}`}
          />
          <meta
            property="og:image"
            content={
              product.images && product.images.length > 0
                ? product.images[0].url
                : "/kvv-logo.png"
            }
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={
              product.name
                ? `${product.name} | Construct KVV`
                : "Product | Construct KVV"
            }
          />
          <meta
            name="twitter:description"
            content={
              product.description || "View product details at KVV Construction."
            }
          />
          <meta
            name="twitter:image"
            content={
              product.images && product.images.length > 0
                ? product.images[0].url
                : "/kvv-logo.png"
            }
          />
          <link
            rel="canonical"
            href={`https://www.constructkvv.com/product/${product.id}`}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: product.name,
                image:
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : undefined,
                description: product.description,
                sku: product.sku,
                brand: {
                  "@type": "Brand",
                  name: "KVV Construction",
                },
                offers: product.price
                  ? {
                      "@type": "Offer",
                      priceCurrency: "RWF",
                      price: product.price,
                      availability: product.isActive
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                      url: `https://www.constructkvv.com/product/${product.id}`,
                    }
                  : undefined,
              }),
            }}
          />
        </Head>
      )}
      <DefaultPageBanner title="Product View" backgroundImage="/building.jpg" />
      <div className="mt-6 sm:mt-10 md:mt-14 lg:mt-20 ml-2 sm:ml-4 lg:ml-8 mb-10 flex justify-start">
        <Link href="/product">
          <GenericButton
            variant="outline"
            className="border-amber-500 text-amber-700 hover:bg-amber-50 bg-white"
          >
            ← Back to Products
          </GenericButton>
        </Link>
      </div>

      <div className="max-w-7xl flex flex-col gap-[30px] p-3 sm:w-[60%] m-auto my-10">
        {loading ? (
          <ProductViewSkeleton />
        ) : error || !product ? (
          <div className="text-center py-10 text-red-500">
            {error || "Product not found."}
          </div>
        ) : (
          <>
            <ProductView product={product} />
            <RelatedProducts
              productId={product.id}
              category={product.category?.slug || ""}
            />
            {reviewsLoading ? (
              <div>Loading reviews...</div>
            ) : reviewsError ? (
              <div className="text-red-500">{reviewsError}</div>
            ) : (
              <Reviews
                reviews={reviews}
                showReviewDialog={
                  eligibleOrders.length > 0
                    ? () => setReviewDialogOpen(true)
                    : undefined
                }
              />
            )}
            {reviewDialogOpen && eligibleOrders.length > 0 && (
              <ReviewDialog
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                productId={product.id}
                eligibleOrders={eligibleOrders}
                onReviewSubmitted={fetchReviews}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default Page;
