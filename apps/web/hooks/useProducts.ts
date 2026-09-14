import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product, ProductDesign } from "@/types";

export interface ProductFilters {
  category?: string;
  material?: string;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data } = await api.get("/products", { params: filters });
      return data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useProductDesigns(productId: string) {
  return useQuery<ProductDesign[]>({
    queryKey: ["products", productId, "designs"],
    queryFn: async () => {
      const { data } = await api.get(`/designs/product/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data } = await api.get("/products/featured");
      return data;
    },
  });
}
