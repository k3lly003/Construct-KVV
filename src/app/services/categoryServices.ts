/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { Category } from "@/types/category";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryService = {
  async createCategory(
    category: Omit<Category, "id">,
    authToken: string
  ): Promise<Category> {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/categories`,
        category,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("CREATED-CATEGORY-DATA-CONSOLE", response.data);
      // Ensure the returned data matches the Category type
      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return response.data as Category;
      } else {
        throw new Error("Invalid response data when creating category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/categories`);
      // response.data is of type unknown, so we need to check its structure
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data &&
        Array.isArray((response.data as any).data)
      ) {
        return (response.data as { data: Category[] }).data;
      } else {
        throw new Error("Invalid response data when fetching categories");
      }
    } catch (error: unknown) {
      console.error("Error fetching categories:", error);
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

  async deleteCategory(id: string, authToken: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/v1/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  async updateCategory(
    id: string,
    updates: Partial<Omit<Category, "id">>,
    authToken: string
  ): Promise<Category> {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/categories/${id}`,
        updates,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Handle both possible shapes: { id, ... } or { data: { ... } }
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data &&
        response.data.data
      ) {
        return response.data.data as Category;
      }

      if (
        response.data &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        return response.data as Category;
      }

      throw new Error("Invalid response data when updating category");
    } catch (error) {
      console.error("Error updating category:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  },

  async getCategoryById(id: string, authToken?: string): Promise<Category> {
    try {
      const response = await axios.get(`${API_URL}/api/v1/categories/${id}`, {
        headers: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : undefined,
      });
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        return response.data.data as Category;
      } else {
        throw new Error("Invalid response data when fetching category by ID");
      }
    } catch (error) {
      console.error("Error getting category:", error);
      throw error;
    }
  }
};
