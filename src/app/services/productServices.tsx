import { Product } from "@/types/product";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Types for AI recommendation API response
interface RecommendationItem {
  id: string;
  product_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  user_id: string;
  interaction_weight: number;
  interaction_type: string;
  similarity_score: number;
}

interface AIRecommendationResponse {
  success: boolean;
  data: {
    user_id: string;
    type: string;
    recommendations: RecommendationItem[];
    based_on_products: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const RECOMMENDATION_API_URL = process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL;

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<{ data: Product[] }>(
        `${API_URL}/api/v1/products?page=1&limit=10&active=true&sort=createdAt&order=desc`
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error("Error fetching products:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  /**
   * Create a new product (seller/admin)
   * @param formData - FormData with:
   *   - data: JSON string of product info
   *   - imageData: JSON string array describing images
   *   - image files: keys matching fileKey in imageData
   * @param authToken - Bearer token
   * @returns Product
   */
  async createProduct(formData: FormData, authToken: string): Promise<Product> {
    try {
      // Debug: Log what's being sent
      console.log("=== PRODUCT SERVICE DEBUG ===");
      console.log("API URL:", `${API_URL}/api/v1/products`);
      console.log("Auth Token:", authToken ? "Present" : "Missing");
      // Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
          );
        } else {
          console.log(`${key}:`, value);
        }
      }
      const response = await axios.post<{ success: boolean; data: Product }>(
        `${API_URL}/api/v1/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Unwrap product from response.data.data
      return response.data.data;
    } catch (error) {
      console.error("Error creating product:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as any).isAxiosError &&
        "response" in error &&
        (error as any).response
      ) {
        const errResponse = (error as any).response;
        console.error("API Error Response:", errResponse.data);
        console.error("API Error Status:", errResponse.status);
      }
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/products/${id}`);
      return (response.data as any).data as Product;
    } catch (error: unknown) {
      console.error("Error fetching product by id:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async updateProduct(
    id: string,
    formData: FormData,
    authToken: string
  ): Promise<Product> {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data as Product;
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async deleteProduct(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/slug/${slug}`
      );
      return response.data as Product;
    } catch (error: unknown) {
      console.error("Error fetching product by slug:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getProductsBySellerId(
    sellerId: string,
    authToken: string
  ): Promise<Product[]> {
    try {
      const response = await axios.get<{ data: Product[] }>(
        `${API_URL}/api/v1/products/seller/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error("Error fetching products by seller ID:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  /**
   * Get products for the authenticated seller (NEW ENDPOINT)
   * @param authToken - Bearer token
   * @param page - Page number (default: 1)
   * @param limit - Number of products per page (default: 10)
   * @returns Array of products belonging to the authenticated seller
   */
  async getMyProducts(
    authToken: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Product[]> {
    try {
      console.log("=== GET MY PRODUCTS DEBUG ===");
      console.log("API URL:", `${API_URL}/api/v1/products/seller/my-products`);
      console.log("Page:", page, "Limit:", limit);
      
      const response = await axios.get<{ data: Product[] }>(
        `${API_URL}/api/v1/products/seller/my-products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log("My Products API Response:", response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error("Error fetching my products:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error &&
        (error as any).isAxiosError &&
        "response" in error &&
        (error as any).response
      ) {
        const errResponse = (error as any).response;
        console.error("API Error Response:", errResponse.data);
        console.error("API Error Status:", errResponse.status);
      }
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getPaidOrdersForUser(
    page = 1,
    limit = 10,
    authToken?: string
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/orders/user/orders?page=${page}&limit=${limit}&status=PAID&sort=createdAt&order=desc`,
        authToken
          ? { headers: { Authorization: `Bearer ${authToken}` } }
          : undefined
      );
      // The orders may be in response.data.data.orders or response.data.orders
      const data = response.data as any;
      return data.data?.orders || data.orders || [];
    } catch (error) {
      console.error("Error fetching paid orders for user:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getProductsByCategorySlug(
    categorySlug: string,
    page = 1,
    limit = 10
  ): Promise<Product[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/category/${categorySlug}?page=${page}&limit=${limit}`
      );
      const data = response.data as any;
      return data.data || [];
    } catch (error) {
      console.error("Error fetching products by category slug:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<Product[]> {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/reviews/product/${productId}?page=${page}&limit=${limit}`
      );
      const data = response.data as any;
      return data.data?.reviews || [];
    } catch (error) {
      console.error("Error fetching reviews for product:", error);
      return [];
    }
  },
  async getProductsByShopId(shopId: string): Promise<Product[]> {
    try {
      const response = await axios.get<{ data: Product[] }>(
        `${API_URL}/api/v1/products?shopId=${shopId}`
      );
      console.log("Response from getProductsByShopId:", response.data);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      console.error("Error fetching products by shop ID:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  /**
   * Record a product interaction (click, view, etc)
   * @param params - { userId, productId, type, timeSpent, token }
   * @returns API response data
   */
  async postProductInteraction({
    userId,
    productId,
    type,
    timeSpent,
    token,
  }: {
    userId: string;
    productId: string;
    type: string;
    timeSpent: number;
    token: string;
  }) {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/products/interactions`,
        { userId, productId, type, timeSpent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting product interaction:", error);
      throw error;
    }
  },

  /**
   * Fetch recommended products for a user using AI API, fallback to cheapest products if none.
   * Accepts either a userId string or a user object with an id property.
   * @param userId - The user ID (string) or user object
   * @param token - Auth token
   * @returns Array of product objects
   */
  async fetchRecommendedProducts(
    userId: string | { id?: string } | undefined | null,
    token: string
  ): Promise<Product[]> {
    // Extract userId if a user object is passed
    let id: string | undefined;
    if (typeof userId === "string") {
      id = userId;
      console.log("[fetchRecommendedProducts] userId is a string:", id);
    } else if (
      userId &&
      typeof userId === "object" &&
      "id" in userId &&
      userId.id
    ) {
      id = userId.id;
      console.log(
        "[fetchRecommendedProducts] userId is an object with id:",
        id
      );
    } else {
      id = undefined;
      console.warn(
        "[fetchRecommendedProducts] userId is missing or invalid:",
        userId
      );
    }
    console.log("[fetchRecommendedProducts] Extracted userId:", id);
    if (!id) {
      console.warn(
        "[fetchRecommendedProducts] No userId provided, returning []"
      );
      return [];
    }
    try {
      // 1. Fetch recommendations from AI API
      console.log("[NEXT_AI_RECOMMENDATION_URL] ", RECOMMENDATION_API_URL);
      const aiUrl = `${RECOMMENDATION_API_URL}/api/v1/users/${id}/recommendations?top_n=8`;
      console.log(
        "[fetchRecommendedProducts] Fetching AI recommendations from:",
        aiUrl
      );
      const aiRes = await axios.get<AIRecommendationResponse>(aiUrl, {
        headers: { accept: "application/json" },
      });
      console.log("[fetchRecommendedProducts] AI API response:", aiRes.data);
      // Fix: recommendations are inside aiRes.data.data.recommendations
      let recommendationsRaw: RecommendationItem[] = [];
      if (
        aiRes.data &&
        aiRes.data.data &&
        Array.isArray(aiRes.data.data.recommendations)
      ) {
        recommendationsRaw = aiRes.data.data.recommendations;
        console.log(
          "[fetchRecommendedProducts] Found recommendations in aiRes.data.data.recommendations"
        );
      } else if (
        aiRes.data &&
        Array.isArray((aiRes.data as any).recommendations)
      ) {
        recommendationsRaw = (aiRes.data as any).recommendations;
        console.log(
          "[fetchRecommendedProducts] Found recommendations in aiRes.data.recommendations"
        );
      } else {
        recommendationsRaw = [];
        console.warn(
          "[fetchRecommendedProducts] No recommendations found in AI API response"
        );
      }
      const recommendations: Array<{ product_id: string }> = Array.isArray(
        recommendationsRaw
      )
        ? recommendationsRaw
        : [];
      console.log(
        "[fetchRecommendedProducts] AI recommendations:",
        recommendations
      );

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        // No recommendations, return empty array (no fallback)
        console.log(
          "[fetchRecommendedProducts] No AI recommendations, returning []"
        );
        return [];
      }

      // 3. Fetch product details for each recommended product
      const productIds: string[] = recommendations
        .map((r) => r.product_id)
        .filter(Boolean);
      console.log(
        "[fetchRecommendedProducts] Fetching details for productIds:",
        productIds
      );
      const productPromises = productIds.map(async (pid) => {
        const productUrl = `${API_URL}/api/v1/products/${pid}`;
        console.log(
          `[fetchRecommendedProducts] Fetching product from:`,
          productUrl
        );
        try {
          const res = await axios.get<{ data: Product } | Product>(productUrl, {
            headers: { accept: "application/json" },
          });
          console.log(
            `[fetchRecommendedProducts] Product API response for ${pid}:`,
            res.data
          );
          // Support both { data: Product } and direct Product
          return (res.data as any)?.data || res.data;
        } catch (err) {
          console.warn(
            `[fetchRecommendedProducts] Failed to fetch product ${pid}:`,
            err
          );
          return undefined;
        }
      });
      const productsRaw = (await Promise.all(productPromises)) as (
        | Product
        | undefined
      )[];
      const products: Product[] = productsRaw.filter((p): p is Product =>
        Boolean(p)
      );
      console.log(
        "[fetchRecommendedProducts] Final recommended products:",
        products
      );
      return products;
    } catch (error) {
      console.error("[fetchRecommendedProducts] Error:", error);
      return [];
    }
  },
};
