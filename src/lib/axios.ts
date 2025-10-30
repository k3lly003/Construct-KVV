import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com',
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
