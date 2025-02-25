import { create } from "zustand";

interface AuthState {
  number: string;
  setNumber: (number: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  number: "",
  setNumber: (number) => set({ number }),
}));
