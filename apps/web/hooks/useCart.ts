import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Cart } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export function useCart() {
  const setCart = useCartStore((state) => state.setCart);
  const { isAuthenticated } = useAuthStore();

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      setCart(data);
      return data;
    },
    enabled: isAuthenticated, // ← solo si está autenticado
    retry: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { openCart } = useCartStore();

  return useMutation({
    mutationFn: async (payload: {
      variantId: string;
      designId?: string;
      quantity: number;
    }) => {
      const { data } = await api.post("/cart/items", payload);
      return data as Cart;
    },
    onSuccess: () => {
      // Refetch el carrito completo con total incluido
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      openCart();
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
      return data as Cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: async () => {
      await api.delete("/cart");
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      clearCart();
    },
  });
}
