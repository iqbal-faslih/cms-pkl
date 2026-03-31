import { create } from "zustand";

const useUiStore = create((set) => ({
  isSectionOpen: {
    categories: true,
    tags: true,
  },

  toggleSection: (sectionName) =>
    set((state) => ({
      isSectionOpen: {
        ...state.isSectionOpen,
        [sectionName]: !state.isSectionOpen[sectionName],
      },
    })),
}));

export default useUiStore;
