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
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  stock: z.number().min(0, { message: "Stock cannot be negative" }),
  inventory: z.number().min(0, { message: "Inventory cannot be negative" }),
  sku: z.string().nonempty({ message: "SKU is required" }),
  slug: z.string().nonempty({ message: "Slug is required" }),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sellerId: z.string().nonempty({ message: "Seller ID is required" }),
  categoryId: z.string().nonempty({ message: "Category ID is required" }),
  shopId: z.string().nonempty({ message: "Shop ID is required" }),
  discountedPrice: z.number().min(0, { message: "Discounted price cannot be negative" }).optional(),
  attributes: z.record(z.any()).optional(),
  images: z.array(z.object({
    url: z.string().nonempty({ message: "Image URL is required" }),
    alt: z.string().nonempty({ message: "Alt text is required" }),
    isDefault: z.boolean().default(false),
  })).min(1, { message: "At least one image is required" }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const createServiceSchema = z.object({
  title: z.string().nonempty({ message: "Service title is required" }),
  category: z.string().nonempty({ message: "Category is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  availability: z.string().nonempty({ message: "Availability is required" }),
  features: z.array(z.object({ value: z.string().nonempty() })).min(1, { message: "At least one feature is required" }),
  specifications: z.array(z.object({ value: z.string().nonempty() })).min(1, { message: "At least one specification is required" }),
  provider: z.string().nonempty({ message: "Provider name is required" }),
  pricing: z.string().nonempty({ message: "Price is required" }),
  location: z.string().nonempty({ message: "Address is required" }),
  warranty: z.string().nonempty({ message: "Warranty details are required" }),
  gallery: z.array(z.instanceof(File)).min(1, { message: "At least one image is required" }),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;