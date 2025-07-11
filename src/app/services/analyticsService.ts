// src/app/services/analyticsService.ts
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();



const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const analyticsService = {
  async getAdminAnalytics(token: string) {
    const response = await axios.get(`${API_URL}/api/v1/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};