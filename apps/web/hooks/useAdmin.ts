import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

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
