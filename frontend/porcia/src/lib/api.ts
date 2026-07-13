import axios from "axios";
import { authStorage } from "@/config/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem(authStorage.adminToken) ||
      localStorage.getItem(authStorage.customerToken) ||
      localStorage.getItem(authStorage.legacyCustomerToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
