import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Order } from "@/types";

export function useMyOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/my-orders");
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
