import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPosts, deletePost } from '../helpers/apiClient';
import useFilterStore from '../stores/useFilterStore';

export default function usePostManagement() {
  const [dataPostingan, setDataPostingan] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState("newest");

  const searchTerm = useFilterStore((state) => state.searchTerm);
  const selectedCategory = useFilterStore((state) => state.selectedCategory);
  const setSearchTerm = useFilterStore((state) => state.setSearchTerm);
  const setSelectedCategory = useFilterStore((state) => state.setSelectedCategory);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPosts();
      setDataPostingan(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data postingan:", error);
      setError(error.response?.data?.message || "Gagal memuat data postingan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    if (!dataPostingan.length) return [];

    return dataPostingan.filter(item => {
      const matchSearch =
        searchTerm === "" ||
        item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.konten?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "" ||
        (Array.isArray(item.tags) && item.tags.includes(selectedCategory)) ||
        (typeof item.tag === "string" && item.tag === selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [dataPostingan, searchTerm, selectedCategory]);

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.tanggal_publikasi) - new Date(a.tanggal_publikasi));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.tanggal_publikasi) - new Date(b.tanggal_publikasi));
    } else if (sortOption === "az") {
      sorted.sort((a, b) => a.judul_postingan.localeCompare(b.judul_postingan));
    } else if (sortOption === "za") {
      sorted.sort((a, b) => b.judul_postingan.localeCompare(a.judul_postingan));
    }
    return sorted;
  }, [filteredData, sortOption]);

  const allCategories = useMemo(() => {
    if (!dataPostingan.length) return [];
    const tags = dataPostingan.flatMap(item => item.tags || []);
    return [...new Set(tags)];
  }, [dataPostingan]);

  const handleEditClick = useCallback((id) => {
    const editUrl = `/superadmin/edit-post/${id}`;
    window.location.href = editUrl;
  }, []);

  const handleDeleteClick = useCallback(async (id) => {
    try {
      if (!window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
        return;
      }
      setIsLoading(true);
      await deletePost(id);
      await fetchData();
      console.log("Post berhasil dihapus");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError(error.response?.data?.message || "Gagal menghapus postingan");
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / postsPerPage);
  }, [sortedData, postsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, postsPerPage]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    // State
    dataPostingan,
    filteredData,
    sortedData,
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    searchTerm,
    selectedCategory,
    sortOption,
    showFilterMenu,
    isLoading,
    error,

    // Categories
    allCategories,

    // Setters
    setSearchTerm,
    setSelectedCategory,
    setSortOption,
    setShowFilterMenu,

    // Actions
    clearFilters,
    handleEditClick,
    handleDeleteClick,
    refreshData
  };
}
