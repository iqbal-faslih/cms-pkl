import { create } from "zustand";

const useModalEditStore = create((set) => ({
  isOpen: false,
  jurnalData: null,
  openModal: (data) => set({ isOpen: true, jurnalData: data }),
  closeModal: () => set({ isOpen: false, jurnalData: null }),
}));

export default useModalEditStore;
