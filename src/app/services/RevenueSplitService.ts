import axios from "axios";

const API_BASE_URL = "https://construct-kvv-bn-fork.onrender.com/api/v1";

export interface SplitCalculation {
  id: string;
  cartId: string;
  sellerId: string;
  sellerName: string;
  grossAmount: number;
  netAmount: number;
  splitRatio: number;
  subaccountId: string;
  checked: boolean;
  platformCommission: number;
  totalAmount: number;
  totalPlatformCommission: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  businessAddress: string;
  taxId: string;
  businessPhone: string;
  status: string;
  commissionRate: number;
  payoutMethod: string | null;
  createdAt: string;
  deliveryRadius: number;
  documents: string[];
  email: string;
  location: string;
  ownerName: string;
  updatedAt: string;
  user: SellerUser;
}

class RevenueSplitService {
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  async getSplitCalculations(token?: string): Promise<SplitCalculation[]> {
    const authToken = token || this.getToken();
    const response = await axios.get<{ data: SplitCalculation[] }>(
      `${API_BASE_URL}/cart/split-calculations`,
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data.data;
  }

  async checkSplitCalculation(
    id: string,
    token?: string
  ): Promise<SplitCalculation> {
    const authToken = token || this.getToken();
    const response = await axios.patch<{ data: SplitCalculation }>(
      `${API_BASE_URL}/cart/split-calculation/${id}/check`,
      {},
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data.data;
  }

  computeTotalPlatformCommission(rows: SplitCalculation[]): number {
    return rows.reduce(
      (sum, row) => sum + (Number(row.platformCommission) || 0),
      0
    );
  }

  async getTotalPlatformCommission(token?: string): Promise<number> {
    const rows = await this.getSplitCalculations(token);
    return this.computeTotalPlatformCommission(rows);
  }

  computeTotalGross(rows: SplitCalculation[]): number {
    return rows.reduce((sum, row) => sum + (Number(row.grossAmount) || 0), 0);
  }

  async getTotalGross(token?: string): Promise<number> {
    const rows = await this.getSplitCalculations(token);
    return this.computeTotalGross(rows);
  }

  async getSellers(
    {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    }: { page?: number; limit?: number; sortBy?: string; order?: string },
    token?: string
  ): Promise<{
    sellers: Seller[];
    total: number;
    pages: number;
    page: number;
    limit: number;
  }> {
    const authToken = token || this.getToken();
    const response = await axios.get<{
      data: {
        sellers: Seller[];
        pagination: {
          total: number;
          pages: number;
          page: number;
          limit: number;
        };
      };
    }>(`${API_BASE_URL}/seller`, {
      params: { page, limit, sortBy, order },
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = response.data?.data || {};
    return {
      sellers: data.sellers || [],
      total: data.pagination?.total || 0,
      pages: data.pagination?.pages || 0,
      page: data.pagination?.page || page,
      limit: data.pagination?.limit || limit,
    };
  }

  async getSellerById(
    sellerId: string,
    token?: string
  ): Promise<Seller | null> {
    // API doesn’t show single-seller endpoint; fetch a larger page and find it client-side
    const { sellers } = await this.getSellers(
      { page: 1, limit: 100, sortBy: "createdAt", order: "desc" },
      token
    );
    return sellers.find((s) => s.id === sellerId) || null;
  }
}

export const revenueSplitService = new RevenueSplitService();
