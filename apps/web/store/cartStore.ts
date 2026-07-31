import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem, ProductVariant, Design } from "@/types";

interface CartState {
  isOpen: boolean;
  cart: Cart | null;
  guestItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  addGuestItem: (item: {
    variant: ProductVariant;
    design: Design | null;
    quantity: number;
  }) => void;
  updateGuestItem: (itemId: string, quantity: number) => void;
  removeGuestItem: (itemId: string) => void;
  clearGuestCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      cart: null,
      guestItems: [],

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setCart: (cart) => set({ cart }),
      clearCart: () => set({ cart: null }),

      addGuestItem: (item) => {
        const existing = get().guestItems.find(
          (i) =>
            i.variant.id === item.variant.id &&
            (i.design?.id ?? null) === (item.design?.id ?? null),
        );

        if (existing) {
          set({
            guestItems: get().guestItems.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({
            guestItems: [
              ...get().guestItems,
              {
                id: crypto.randomUUID(),
                variant: item.variant,
                design: item.design,
                quantity: item.quantity,
              },
            ],
          });
        }
      },

      updateGuestItem: (itemId, quantity) =>
        set({
          guestItems: get().guestItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i,
          ),
        }),

      removeGuestItem: (itemId) =>
        set({ guestItems: get().guestItems.filter((i) => i.id !== itemId) }),

      clearGuestCart: () => set({ guestItems: [] }),
    }),
    {
      name: "guest-cart-storage",
      // Solo persistimos el carrito de invitado — isOpen/cart no tienen
      // sentido guardarlos entre sesiones
      partialize: (state) => ({ guestItems: state.guestItems }),
    },
  ),
);
