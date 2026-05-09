import { create } from "zustand";
import { Cart } from "@/types";

interface CartState {
  isOpen: boolean;
  cart: Cart | null;
  openCart: () => void;
  closeCart: () => void;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  isOpen: false,
  cart: null,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
}));
