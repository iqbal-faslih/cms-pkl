import { create } from "zustand";


const useTermsModal = create((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));


export default useTermsModal;