import { create } from "zustand";

interface AppState {
  isImportDrawerOpen: boolean;
  openImportDrawer: () => void;
  closeImportDrawer: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isImportDrawerOpen: false,
  openImportDrawer: () => set({ isImportDrawerOpen: true }),
  closeImportDrawer: () => set({ isImportDrawerOpen: false }),
}));
