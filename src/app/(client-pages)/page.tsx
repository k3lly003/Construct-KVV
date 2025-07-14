"use client";

// import { BrickLoader } from "../(components)/BrickLoader";
import { Banner } from "@/app/(components)/home/Banner";
import { ProductCarousel } from "@/app/(components)/home/bestDeals";
import { ProjectShowcase } from "@/app/(components)/home/ProjectShowcase";
import { Products } from "@/app/(components)/Product";
// import { reviewsData } from "../utils/fakes/HomeFakes";
// import ReviewCarousel from "../(components)/home/ReviewCarousel";
import { useEffect, useState } from "react";
import { getUserDataFromLocalStorage } from "@/app/utils/middlewares/UserCredentions";
import { productService } from "@/app/services/productServices";
import Link from "next/link";
import ProductCard from "@/app/(components)/ProductCard";

export default function Home() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = getUserDataFromLocalStorage();
    setUser(userData);
    if (!userData) return;
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        if (userData && userData.id && userData.token) {
          interface ProductRecommendationsResponse {
            recommendations: any[]; // You can replace 'any' with a more specific type for your recommendations
          }
          const res = (await productService.getProductRecommendations(
            userData.id,
            userData.token
          )) as ProductRecommendationsResponse;
          setRecommendations(res.recommendations || []);
        }
      } catch (err: any) {
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <>
      <Banner />
      <ProjectShowcase />
      {/* Visualize Dream Home Section */}
      <section className="w-full bg-gradient-to-r from-amber-50 to-amber-100 py-16 my-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-900">
            Want to visualize your dream home?
          </h2>
          <Link href="/visualize">
            <button className="mt-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-full shadow-lg transition-all flex items-center gap-2">
              Start Visualizing <span aria-hidden="true">→</span>
            </button>
          </Link>
        </div>
      </section>
      {/* UN-COMMENT THIS REVIEW ONCE THE TOOL HAVE GOME MANY REVIEW */}
      {/* <ReviewCarousel reviews={reviewsData} /> */}
      <ProductCarousel />
      {/* Recommendations Section */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-7 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center lg:text-left">
            Recommended for you
          </h2>
          {loading ? (
            <div>Loading recommendations...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : recommendations.length > 0 ? (
            <div className="flex flex-wrap px-4 gap-7 justify-center lg:justify-center">
              {(() => {
                // Find max interactions (wasInteracted true and count)
                const maxInteracted =
                  recommendations.filter((p) => p.wasInteracted).length > 0;
                return recommendations.map((product, idx) => (
                  <div key={product.id} className="relative">
                    {product.wasInteracted && maxInteracted && (
                      <span className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Highly Recommended
                      </span>
                    )}
                    <ProductCard product={product} />
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-2">No recommendations yet.</p>
              <Link
                href="/product"
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition"
              >
                See All Products
              </Link>
            </div>
          )}
        </div>
      )}
      <Products />
    </>
  );
}
