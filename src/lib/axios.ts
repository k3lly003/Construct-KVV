import axios from "axios";

const instance = axios.create({
  // You can add baseURL or headers here if needed
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default instance;
