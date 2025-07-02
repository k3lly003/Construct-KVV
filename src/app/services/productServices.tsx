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
      console.log("CREATED-CATEGORY-DATA", response.data);
      return response.data as Category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<{ data: Category[] }>(
        `${API_URL}/api/v1/categories`
      );
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
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
};
