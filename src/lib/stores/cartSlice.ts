import { StateCreator } from "zustand";

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface CartSlice {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (product_id: string) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => ({
  cart: [],

  addToCart: (item) =>
    set({
      cart: [...get().cart, item],
    }),

  removeFromCart: (product_id) =>
    set({
      cart: get().cart.filter((i) => i.product_id !== product_id),
    }),

  clearCart: () => set({ cart: [] }),
});
