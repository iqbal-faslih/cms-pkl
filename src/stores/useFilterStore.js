import { create } from 'zustand';

const useFilterStore = create((set) => ({
  searchTerm: '',
  selectedCategory: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearFilters: () => set({ searchTerm: '', selectedCategory: '' }),
}));

export default useFilterStore;