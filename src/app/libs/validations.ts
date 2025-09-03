import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only .pdf, .jpg, .jpeg, .png files are accepted."
  );

export const fileListSchema = z
  .array(fileSchema)
  .max(5, "Maximum 5 files allowed")
  .optional();

export const baseRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const constructorRegistrationSchema = baseRegistrationSchema.extend({
  certifications: fileListSchema,
  licenses: fileListSchema,
  specializations: z.string().min(10, "Please describe your specializations (minimum 10 characters)"),
  yearsOfExperience: z.number().min(0, "Years of experience must be 0 or greater"),
   name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  location: z.string().min(2, "Location is required"), // Add this line
  district: z.string().min(2, "District is required"), // Add this line
  cell: z.string().min(2, "Cell is required"), // Add this line
});

export const architectRegistrationSchema = baseRegistrationSchema.extend({
  licenses: fileListSchema,
  portfolio: fileListSchema,
  designSpecialty: z.string().min(10, "Please describe your design specialty (minimum 10 characters)"),
  registrationNumber: z.string().min(1, "Registration number is required"),
});

// Supplier (Seller) registration aligned to Swagger
export const supplierRegistrationSchema = baseRegistrationSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  businessAddress: z.string().min(2, "Business address is required"),
  businessPhone: z.string().min(10, "Business phone must be at least 10 digits"),
  businessEmail: z.string().email("Invalid business email"),
  deliveryRadius: z.number().min(1, "Delivery radius must be at least 1 mile"),
  location: z.string().min(2, "Location is required"),
  shopImage: z.union([fileSchema, z.string().url("Shop image must be a valid URL")]),
  shopDescription: z
    .string()
    .min(10, "Please describe your shop (minimum 10 characters)"),
  documents: z
    .array(fileSchema)
    .max(10, "Maximum 10 documents allowed"),
  taxId: z.string().min(2, "Tax ID is required"),
});

export type ConstructorRegistration = z.infer<typeof constructorRegistrationSchema>;
export type ArchitectRegistration = z.infer<typeof architectRegistrationSchema>;
export type SupplierRegistration = z.infer<typeof supplierRegistrationSchema>;
