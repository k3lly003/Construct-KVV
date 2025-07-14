"use client";

import React, { useEffect, useState } from 'react';
import DefaultPageBanner from '@/app/(components)/DefaultPageBanner';
import Reviews from '@/app/(components)/product/Reviews';
import RelatedProducts from '@/app/(components)/product/RelatedProducts';
import ProductView from '@/app/(components)/product/ProductView';
import ReviewDialog from '@/app/(components)/product/ReviewDialog';
import { productService } from '@/app/services/productServices';
import {  ProductViewSkeleton } from '@/app/utils/skeleton/ProductSkeletons'

interface ProductPageProps {
  params: { id: string };
}

function ProductPage({ params }: ProductPageProps) {

  //@ts-ignore
  const resolvedParams = React.use(params) as { id: string };

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
        const prod = await productService.getProductById(resolvedParams.id);
        if (isMounted) setProduct(prod);
      } catch {
        if (isMounted) setError('Product not found.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProduct();
    return () => { isMounted = false; };
  }, [resolvedParams.id]);

  // Fetch reviews
  const fetchReviews = React.useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const reviews = await productService.getProductReviews(resolvedParams.id, 1, 10);
      setReviews(reviews);
    } catch {
      setReviewsError('Failed to load reviews.');
    } finally {
      setReviewsLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Fetch eligible orders for review
  useEffect(() => {
    let isMounted = true;
    async function fetchEligibleOrders() {
      if (!product) return;
      try {
        const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : undefined;
        const orders = await productService.getPaidOrdersForUser(1, 50, authToken || undefined);
        const eligible = orders.filter((order: any) =>
          order.items && order.items.some((item: any) => item.productId === product.id)
        );
        if (isMounted) setEligibleOrders(eligible);
      } catch {
        if (isMounted) setEligibleOrders([]);
      }
    }
    fetchEligibleOrders();
    return () => { isMounted = false; };
  }, [product]);

  return (
    <div className="w-[100%]">
      <DefaultPageBanner title="Product View" backgroundImage='/building.jpg' />
      <div className="max-w-7xl flex flex-col gap-[30px] p-3 sm:w-[60%] m-auto my-10">
        {loading ? (
          <ProductViewSkeleton />
        ) : error || !product ? (
          <div className="text-center py-10 text-red-500">{error || 'Product not found.'}</div>
        ) : (
          <>
            <ProductView product={product} />
            <RelatedProducts productId={product.id} category={product.category?.slug || ''} />
            {reviewsLoading ? (
              <div>Loading reviews...</div>
            ) : reviewsError ? (
              <div className="text-red-500">{reviewsError}</div>
            ) : (
              <Reviews
                reviews={reviews}
                showReviewDialog={eligibleOrders.length > 0 ? () => setReviewDialogOpen(true) : undefined}
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
}
export default ProductPage;
