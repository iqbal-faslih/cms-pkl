import { create } from "zustand";

export const useAbsensiStore = create((set) => ({
  loading:false,
  pdfLoading: false,
  successMessage: "",
  tableKey: 0,

  absensiData: [],
  paginationInfo: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },

  setLoading: (loading) => set({ loading }),

  setPdfLoading: (pdfLoading) => set({ pdfLoading }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),
  incrementTableKey: () => set((state) => ({ tableKey: state.tableKey + 1 })),
  setAbsensiData: (data) => set({ absensiData: data }),
  setPaginationInfo: (info) =>
  set((state) => ({ paginationInfo: { ...state.paginationInfo, ...info } })),
}));