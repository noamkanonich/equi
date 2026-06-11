import { create } from "zustand";

type PaywallStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const usePaywallStore = create<PaywallStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
