import z from "zod";

export const loginValidation = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })

})


export const createProductSchema = z.object({
  name: z.string().nonempty({ message: "Product name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  price: z.string().nonempty({ message: "Price is required" }),
  stock: z.number().min(0, { message: "Stock cannot be negative" }),
  inventory: z.number().min(0, { message: "Inventory cannot be negative" }),
  sku: z.string().nonempty({ message: "SKU is required" }),
  slug: z.string().nonempty({ message: "Slug is required" }),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sellerId: z.string().nonempty({ message: "Seller ID is required" }),
  categoryId: z.string().nonempty({ message: "Category ID is required" }),
  shopId: z.string().nonempty({ message: "Shop ID is required" }),
  discountedPrice: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  images: z.array(z.object({
    url: z.string().nonempty({ message: "Image URL is required" }),
    alt: z.string().nonempty({ message: "Alt text is required" }),
    isDefault: z.boolean().default(false),
    fileKey: z.string().optional(),
  })).min(1, { message: "At least one image is required" }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;