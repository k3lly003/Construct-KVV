import axios from "axios";
import { RENDER_API_URL } from "./apiConfig";

const instance = axios.create({
  baseURL: RENDER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from localStorage for every request (client-side only)
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;
