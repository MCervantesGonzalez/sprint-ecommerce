import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Leer desde localStorage donde Zustand persist guarda el estado
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignorar errores de parseo
    }
  }
  return config;
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const authRoutes = ["/login", "/register"];
        if (!authRoutes.includes(currentPath)) {
          localStorage.removeItem("auth-storage");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
