import { create } from "zustand";

const useModalTambahStore = create((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useModalTambahStore;
