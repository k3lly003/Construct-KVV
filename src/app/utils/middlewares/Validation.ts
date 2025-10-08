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
  description: z.string().optional(),
  price: z.string().nonempty({ message: "Price is required" }),
  stock: z.number().min(0, { message: "Stock cannot be negative" }),
  inventory: z.number().min(0, { message: "Inventory cannot be negative" }),
  sku: z.string().nonempty({ message: "SKU is required" }),
  slug: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  sellerId: z.string().nonempty({ message: "Seller ID is required" }),
  categoryId: z.string().optional(),
  shopId: z.string().optional(), // Made optional - sellers can create products without shops
  discountedPrice: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  images: z.array(z.object({
    url: z.string().optional(),
    alt: z.string().optional(),
    isDefault: z.boolean().default(false),
    fileKey: z.string().optional(),
    file: z.any().optional(), // File object for upload
  })).optional(), // Made optional - products can be created without images initially
});

export type CreateProductInput = z.infer<typeof createProductSchema>;