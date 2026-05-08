import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product, ProductDesign } from "@/types";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
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
