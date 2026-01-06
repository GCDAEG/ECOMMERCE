import { StateCreator } from "zustand";

export interface LoadingSlice {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const createLoadingSlice: StateCreator<LoadingSlice> = (set) => ({
  loading: false,
  setLoading: (v) => set({ loading: v }),
});
