export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug?: string;
  parentId?: string;
  dateCreated?: string;
  items?: Category[];
} 