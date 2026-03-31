// stores/useModalTidakMengisiStore.js
import { create } from "zustand";

const useModalTidakMengisiStore = create((set) => ({
  isOpen: false,
  data: null,
  openModal: (modalData) => set({ isOpen: true, data: modalData }),
  closeModal: () => set({ isOpen: false, data: null }),
}));

export default useModalTidakMengisiStore;
