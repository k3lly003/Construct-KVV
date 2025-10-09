import api from "@/lib/axios";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: ProductImage[];
  isActive?: boolean;
  sellerId?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  discountedPrice?: number;
  sku?: string;
  inventory?: number;
  slug?: string;
  thumbnailUrl?: string;
  attributes?: Record<string, any>;
}

type ProductsApiResponse = {
  success?: boolean;
  data?: Product[];
  products?: Product[];
  items?: Product[];
  meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
};

export async function fetchAllProducts(
  page: number = 1,
  limit: number = 100
): Promise<Product[]> {
  console.log("[sellerOverviewService] fetchAllProducts:start", {
    page,
    limit,
  });
  const response = await api.get<ProductsApiResponse>("/api/v1/products", {
    params: { page, limit },
    headers: { accept: "application/json" },
  });

  const payload = response.data as ProductsApiResponse | Product[];

  if (Array.isArray(payload)) return payload as Product[];

  const list = payload?.data || payload?.products || payload?.items || [];
  console.log("[sellerOverviewService] fetchAllProducts:parsed", {
    count: Array.isArray(list) ? list.length : 0,
    meta: payload?.meta,
  });
  return list as Product[];
}

export function getCurrentSellerId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr || "null");
    // Prefer seller.id from embedded seller object
    const sellerIdFromSeller = user?.seller?.id ?? user?.seller?._id ?? null;
    const fallbackUserId = user?.id ?? user?._id ?? null;
    const finalSellerId = sellerIdFromSeller || fallbackUserId;
    console.log("[sellerOverviewService] getCurrentSellerId:user", user);
    console.log("[sellerOverviewService] getCurrentSellerId:derived", {
      sellerIdFromSeller,
      fallbackUserId,
      finalSellerId,
    });
    return finalSellerId;
  } catch {
    return null;
  }
}

export async function fetchSellerProductsCount(): Promise<number> {
  console.log("[sellerOverviewService] fetchSellerProductsCount:start");
  const sellerId = getCurrentSellerId();
  if (!sellerId) return 0;
  // Fetch first page with a reasonably large limit to cover most cases
  const products = await fetchAllProducts(1, 100);
  const filtered = products.filter((p) => p?.sellerId === sellerId);
  const count = filtered.length;
  console.log("[sellerOverviewService] fetchSellerProductsCount:done", {
    totalFetched: products.length,
    sellerId,
    sellerCount: count,
  });
  return count;
}

// Split calculations types and APIs
export interface SplitCalculationItem {
  id: string;
  cartId: string;
  sellerId: string;
  sellerName?: string;
  grossAmount?: number;
  netAmount?: number;
  splitRatio?: number;
  subaccountId?: string;
  checked?: boolean;
  platformCommission?: number;
  totalAmount?: number;
  totalPlatformCommission?: number;
  createdAt?: string;
  updatedAt?: string;
}

type SplitCalculationsResponse = {
  success?: boolean;
  data?: SplitCalculationItem[];
  items?: SplitCalculationItem[];
  splits?: SplitCalculationItem[];
};

export async function fetchSplitCalculations(): Promise<
  SplitCalculationItem[]
> {
  console.log("[sellerOverviewService] fetchSplitCalculations:start");
  const res = await api.get<SplitCalculationsResponse>(
    "/api/v1/cart/split-calculations",
    {
      headers: { accept: "*/*" },
    }
  );
  const payload = res.data as
    | SplitCalculationsResponse
    | SplitCalculationItem[];
  let list: SplitCalculationItem[] = [];
  if (Array.isArray(payload)) list = payload as SplitCalculationItem[];
  else
    list = (payload?.data ||
      payload?.items ||
      payload?.splits ||
      []) as SplitCalculationItem[];
  console.log("[sellerOverviewService] fetchSplitCalculations:parsed", {
    count: Array.isArray(list) ? list.length : 0,
  });
  return list;
}

export async function fetchSellerRevenueAndOrders(): Promise<{
  totalRevenue: number;
  totalOrders: number;
}> {
  console.log("[sellerOverviewService] fetchSellerRevenueAndOrders:start");
  const sellerId = getCurrentSellerId();
  if (!sellerId) return { totalRevenue: 0, totalOrders: 0 };
  const splits = await fetchSplitCalculations();
  const forSeller = splits.filter((s) => s?.sellerId === sellerId);
  const totalRevenue = forSeller.reduce(
    (sum, s) => sum + (s.netAmount || 0),
    0
  );
  const totalOrders = forSeller.length;
  console.log("[sellerOverviewService] fetchSellerRevenueAndOrders:done", {
    sellerId,
    totalRevenue,
    totalOrders,
  });
  return { totalRevenue, totalOrders };
}

// Orders for the current seller
export async function getSellerOrders(user: any): Promise<any[]> {
  try {
    const sellerId = user?.seller?.id ?? user?.seller?._id ?? null;
    console.log(
      "[sellerOverviewService] getSellerOrders:derivedSellerId",
      sellerId
    );
    if (!sellerId) {
      console.error("[sellerOverviewService] getSellerOrders:no-seller-id");
      return [];
    }
    const res = await api.get(`/api/v1/orders/seller/${sellerId}`, {
      headers: { accept: "application/json" },
    });
    const payload: any = res?.data || {};
    const list: any[] = Array.isArray(payload) ? payload : payload.data || [];
    console.log("[sellerOverviewService] getSellerOrders:fetched", list.length);
    return list;
  } catch (e) {
    console.error("[sellerOverviewService] getSellerOrders:error", e);
    return [];
  }
}
