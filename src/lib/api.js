import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

export async function csrf() {
  return api.get("/sanctum/csrf-cookie");
}
