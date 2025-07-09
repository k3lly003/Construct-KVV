import { Category } from "@/types/category";

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown";
};