import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Cart, CartItem, ProductVariant, Design } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

function buildGuestCart(items: CartItem[]): Cart {
  const total = items.reduce(
    (sum, item) => sum + Number(item.variant.base_price) * item.quantity,
    0,
  );
  return { id: "guest", items, total };
}

export function useCart() {
  const setCart = useCartStore((state) => state.setCart);
  const guestItems = useCartStore((state) => state.guestItems);
  const { isAuthenticated } = useAuthStore();

  const serverQuery = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      setCart(data);
      return data;
    },
    enabled: isAuthenticated,
    retry: false,
  });

  if (isAuthenticated) return serverQuery;

  // Invitado: el carrito vive en Zustand/localStorage, no hay fetch real
  return {
    ...serverQuery,
    data: buildGuestCart(guestItems),
    isLoading: false,
    isError: false,
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { openCart, addGuestItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: {
      variantId: string;
      designId?: string;
      quantity: number;
      // Requeridos solo para invitado — el objeto completo, ya que no hay
      // backend que lo enriquezca por nosotros
      variant?: ProductVariant;
      design?: Design | null;
    }) => {
      if (!isAuthenticated) {
        if (!payload.variant) {
          throw new Error(
            "Falta el objeto variant para agregar al carrito de invitado",
          );
        }
        addGuestItem({
          variant: payload.variant,
          design: payload.design ?? null,
          quantity: payload.quantity,
        });
        return null;
      }

      const { data } = await api.post("/cart/items", {
        variantId: payload.variantId,
        designId: payload.designId,
        quantity: payload.quantity,
      });
      return data as Cart;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      openCart();
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { updateGuestItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      if (!isAuthenticated) {
        updateGuestItem(itemId, quantity);
        return null;
      }
      const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
      return data as Cart;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);
  const { removeGuestItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!isAuthenticated) {
        removeGuestItem(itemId);
        return null;
      }
      await api.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { clearCart, clearGuestCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        clearGuestCart();
        return null;
      }
      await api.delete("/cart");
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.setQueryData(["cart"], null);
        clearCart();
      }
    },
  });
}
