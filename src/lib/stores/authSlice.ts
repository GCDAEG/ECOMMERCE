import { StateCreator } from "zustand";

export interface User {
  id: string;
  email: string;
}

export interface AuthSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,

  setUser: (user) => {
    console.log("se recibe", user)
    set({ user })
  },

  clearUser: () => set({ user: null }),
});
