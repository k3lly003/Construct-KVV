import axios from "axios";
import { RENDER_API_URL } from "@/lib/apiConfig";

const API_URL = RENDER_API_URL;

export interface GenerateBoqRequest {
  companyName: string;
  companyLogo?: File;
  companyLogoUrl?: string;
  generatePdf: boolean;
}

export interface GenerateBoqResponse {
  success?: boolean;
  message?: string;
  boq?: {
    id?: string;
    pdfUrl?: string;
    companyName?: string;
    companyLogoUrl?: string;
    createdAt?: string;
    totalAmount?: string;
    currency?: string;
  };
  pdfUrl?: string;
  data?: {
    pdfUrl?: string;
    boq?: {
      pdfUrl?: string;
    };
  };
}

export interface BOQItem {
  id: string;
  billOfQuantitiesId: string;
  itemName: string;
  description: string;
  category: string;
  quantity: string;
  unit: string;
  unitRate: string;
  totalAmount: string;
}

export interface BOQDetails {
  id: string;
  finalProjectId: string;
  generatedBy: string;
  companyName: string;
  companyLogoUrl: string;
  totalAmount: string;
  currency: string;
  pdfUrl: string;
  createdAt: string;
  updatedAt: string;
  items: BOQItem[];
  finalProject?: {
    id: string;
    owner?: {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
  };
}

export interface GetBOQResponse {
  success: boolean;
  boq: BOQDetails;
}

/**
 * Upload company logo directly to Cloudinary from frontend
 * @param file - Image file to upload
 * @param authToken - Authentication token (not used for Cloudinary, kept for API consistency)
 * @returns URL of uploaded image
 */
export async function uploadCompanyLogo(
  file: File,
  authToken: string
): Promise<string> {
  // Ensure we're in the browser
  if (typeof window === "undefined") {
    throw new Error("Upload must be performed from the client side");
  }

  // Get Cloudinary configuration from environment variables
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const cloudinaryUploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default";

  if (!cloudinaryCloudName) {
    throw new Error(
      "Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables."
    );
  }

  if (!cloudinaryUploadPreset || cloudinaryUploadPreset === "default") {
    console.warn(
      "Using default upload preset. Consider setting NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET for better security."
    );
  }

  // Create FormData for Cloudinary upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryUploadPreset);

  try {
    // Upload directly to Cloudinary from frontend using fetch
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `Cloudinary upload failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    }

    if (data.url) {
      return data.url;
    }

    throw new Error("No image URL returned from Cloudinary");
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      error.message ||
        "Failed to upload image to Cloudinary. Please check your configuration and try again."
    );
  }
}

/**
 * Generate BOQ PDF for a project
 * @param projectId - Project ID
 * @param payload - BOQ generation request payload
 * @param authToken - Authentication token
 * @returns BOQ response with PDF URL
 */
export async function generateBoq(
  projectId: string,
  payload: GenerateBoqRequest,
  authToken: string
): Promise<GenerateBoqResponse> {
  try {
    const formData = new FormData();
    formData.append("companyName", payload.companyName);
    formData.append("generatePdf", payload.generatePdf.toString());
    
    if (payload.companyLogo) {
      formData.append("companyLogo", payload.companyLogo);
    }
    
    if (payload.companyLogoUrl) {
      formData.append("companyLogoUrl", payload.companyLogoUrl);
    }

    const response = await axios.post<GenerateBoqResponse>(
      `${API_URL}/api/v1/boq/${projectId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error generating BOQ:", error);
    throw new Error(
      error.response?.data?.message || "Failed to generate BOQ PDF"
    );
  }
}

/**
 * Get BOQ details for a project
 * @param projectId - Project ID
 * @param authToken - Authentication token
 * @returns BOQ details with items
 */
export async function getBOQ(
  projectId: string,
  authToken: string
): Promise<BOQDetails> {
  try {
    const response = await axios.get<GetBOQResponse>(
      `${API_URL}/api/v1/boq/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data.boq;
  } catch (error: any) {
    console.error("Error fetching BOQ:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch BOQ"
    );
  }
}
