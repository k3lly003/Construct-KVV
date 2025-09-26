import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com',
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    const token = localStorage.getItem("authToken");

    if (token && config.headers) {
      // AxiosHeaders has 'set' function. TypeScript-safe check
      if (
        typeof (config.headers as unknown) === "object" &&
        "set" in config.headers &&
        typeof (config.headers as { set?: unknown }).set === "function"
      ) {
        (config.headers as { set: (key: string, value: string) => void }).set(
          "Authorization",
          `Bearer ${token}`
        );
      } else {
        // Plain object fallback
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
