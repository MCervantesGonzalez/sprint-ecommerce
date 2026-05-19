import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

//Dashboard

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard");
      return data;
    },
  });
}

export function useAdminOrders(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "orders", status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      params.append("page", String(page));
      params.append("limit", String(limit));
      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      return data;
    },
  });
}

export function useLowStock(threshold = 10) {
  return useQuery({
    queryKey: ["admin", "low-stock", threshold],
    queryFn: async () => {
      const { data } = await api.get(
        `/admin/products/low-stock?threshold=${threshold}`,
      );
      return data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// PRODUCTS

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description?: string;
    }) => {
      const { data: res } = await api.post("/products", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        category?: string;
        description?: string;
        active?: boolean;
      };
    }) => {
      const { data: res } = await api.patch(`/products/${id}`, data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// VARIANTS

export function useCreateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: string;
      data: {
        size: string;
        color: string;
        stock: number;
        base_price: number;
      };
    }) => {
      const { data: res } = await api.post(
        `/products/${productId}/variants`,
        data,
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      data,
    }: {
      productId: string;
      variantId: string;
      data: {
        size?: string;
        color?: string;
        stock?: number;
        base_price?: number;
        active?: boolean;
      };
    }) => {
      const { data: res } = await api.patch(
        `/products/${productId}/variants/${variantId}`,
        data,
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId: string;
    }) => {
      const { data } = await api.delete(
        `/products/${productId}/variants/${variantId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// DESIGNS

export function useCreateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/designs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}

export function useUpdateDesign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const { data } = await api.patch(`/designs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });
}
