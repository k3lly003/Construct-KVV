import { Product } from "@/types/product";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    }
  },
  async getProductsByShopId(shopId: string): Promise<Product[]> {
    try {
      const response = await axios.get<{ data: Product[] }>(
        `${API_URL}/api/v1/products?shopId=${shopId}`
      );
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
   * Get product recommendations for a user
   * @param userId - string
   * @param token - string
   * @returns API response data
   */
  async getProductRecommendations(userId: string, token: string) {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/products/recommendations/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product recommendations:", error);
      throw error;
    }
  },
};
