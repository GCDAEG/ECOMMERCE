import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice, AuthSlice } from "./authSlice";
import { createCartSlice, CartSlice } from "./cartSlice";
import { createLoadingSlice, LoadingSlice } from "./loadingSlice";

type StoreState = AuthSlice & CartSlice & LoadingSlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createCartSlice(...a),
      ...createLoadingSlice(...a),
    }),
    {
      name: "app-store", // nombre en localStorage
      partialize: (state) => ({
        user: state.user, // SOLO guardamos el user
        cart: state.cart, // opcional
      }),
    }
  )
);
