import { useState, useEffect, useMemo } from "react";
import { useFetch } from "@/shared/hooks/requests/useFetch";
import { useSearch } from "@/shared/hooks/useSearch";
import { SORT_SCHEMA } from "@/shared/schema/querySchemas";
import { buildQuery } from "@/shared/helpers/buildQuery";

const mapApiToRow = (item, index, currentPage, perPage) => ({
  no: (currentPage - 1) * perPage + index + 1,
  originalId: item.id,
  name: item.nama,
  image: `${import.meta.env.VITE_FILE_URL}/${item.foto_profile?.path}`,
  asal_sekolah: item.sekolah,
  project: item.project || "N/A",
  progress: item.progress,
  raw: item,
});

export const useDaftarPesertaMentor = (options = {}) => {
  const { itemsPerPage = 10, searchDelay = 800 } = options;

  const { keyword: searchTerm, debouncedKeyword, setKeyword: setSearchTerm } = useSearch(searchDelay);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });

  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);

  const queryString = useMemo(() => {
    return buildQuery({
      search: debouncedKeyword,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
      },
      sort: sortOption,
      sortSchema: SORT_SCHEMA,
      filters: {
        progress: appliedFilters,
      },
      date: dateFilter,
    });
  }, [debouncedKeyword, currentPage, itemsPerPage, sortOption, appliedFilters, dateFilter]);

  const { data: apiData, loading, error, refetch } = useFetch(`/mentor-manage-peserta/daftar-peserta?${queryString}`);

  const data = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((item, index) => mapApiToRow(item, index, currentPage, itemsPerPage));
  }, [apiData, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const meta = apiData?.meta || {};
    return {
      totalPages: meta.last_page || 1,
      totalItems: meta.total || 0,
      itemsPerPage: meta.per_page || itemsPerPage,
      currentPage: meta.current_page || 1,
    };
  }, [apiData, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, sortOption, appliedFilters, dateFilter]);

  const toggleFilter = (value) => {
    setSelectedFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const applyFilters = ({ dateFrom, dateTo }) => {
    setAppliedFilters(selectedFilters);

    setDateFilter({
      from: dateFrom ? new Date(dateFrom) : undefined,
      to: dateTo ? new Date(dateTo) : undefined,
    });

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
    setDateFilter({ from: null, to: null });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > paginationInfo.totalPages) return;
    setCurrentPage(page);
  };

  return {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    resetFilters,
    sortOption,
    setSortOption,
    currentPage,
    ...paginationInfo,
    handlePageChange,
    refetch,
  };
};
