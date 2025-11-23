import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "https://construct-kvv-bn-fork.onrender.com/api/v1";

export interface OrderResponse {
  success: boolean;
  message: string;
  data: any;
}

class OrderService {
  async placeOrder(
    cartId: string,
    paymentIntent: string,
    token: string
  ): Promise<OrderResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/orders`,
      {
        cartId,
        paymentIntent,
      },
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data as OrderResponse;
  }

  async getMyOrders(
    token: string,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc"
  ) {
    const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
      params: { page, limit, sort, order },
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string, token: string) {
    const response = await axios.patch(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { status },
      {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

export const orderService = new OrderService();
