import axios from 'axios';
import { CreateBidDTO, Bid } from '@/types/bid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const bidService = {
  async createBid(bidData: CreateBidDTO, authToken: string): Promise<Bid> {
    const response = await axios.post(`${API_URL}/api/v1/bids`, bidData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  },

  async getProjectBids(projectId: string, authToken: string): Promise<Bid[]> {
    const response = await axios.get(`${API_URL}/api/v1/bids/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.data;
  },

  async getBidById(bidId: string, authToken: string): Promise<Bid> {
    const response = await axios.get(`${API_URL}/api/v1/bids/${bidId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  },

  // TODO: Implement getSellerBids
  async getSellerBids(authToken: string): Promise<Bid[]> {
    const response = await axios.get(`${API_URL}/api/v1/bids/seller`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.data;
  },

  async acceptBid(bidId: string, finalAmount: number, authToken: string): Promise<void> {
    await axios.post(`${API_URL}/api/v1/bids/${bidId}/accept`, 
      { finalAmount }, 
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  },
}; 