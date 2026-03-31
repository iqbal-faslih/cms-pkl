import { useState, useEffect, useMemo, useCallback } from "react";
import { useFetch } from "@/shared/hooks/requests/useFetch";
import { useSearch } from "@/shared/hooks/useSearch";
import { buildQuery } from "@/shared/helpers/buildQuery";
import { SORT_SCHEMA } from "@/shared/schema/querySchemas";

export const useJurnalCabang = (options = {}) => {
  const { itemsPerPage = 10, searchDelay = 500 } = options;

  const {
    keyword: searchTerm,
    debouncedKeyword,
    setKeyword: setSearchTerm,
  } = useSearch(searchDelay);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);

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
        status: appliedFilters.map((f) =>
          f === "mengisi" ? "Mengisi" : "Kosong"
        ),
      },
    });
  }, [debouncedKeyword, currentPage, itemsPerPage, sortOption, appliedFilters]);

  const { data: apiData, loading, error, refetch } = useFetch(
    `/jurnal-cabang?${queryString}`
  );

  const data = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((item, index) => ({
      number: (currentPage - 1) * itemsPerPage + index + 1,
      id: item.id,
      name: item.nama,
      school: item.sekolah,
      date: item.tanggal,
      status: item.status,
      judulGambar: item.judul,
      deskripsi: item.deskripsi,
      suratUrl: `${import.meta.env.VITE_FILE_URL}/${item.bukti}`,
    }));
  }, [apiData, currentPage, itemsPerPage]);

  const meta = apiData?.meta || {};

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const applyFilters = () => {
    setAppliedFilters(selectedFilters);
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > meta.last_page) return;
    setCurrentPage(page);
  };

  const onExport = useCallback(
    async (type) => {
      setExportLoading(true);
      try {
        const endpoint =
          type === "pdf"
            ? `/api/cabang-export/pdf?${queryString}`
            : `/api/cabang-export/excel?${queryString}`;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download =
          type === "pdf"
            ? "jurnal-cabang.pdf"
            : "jurnal-cabang.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      } finally {
        setExportLoading(false);
      }
    },
    [queryString]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, sortOption, appliedFilters]);

  return {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    sortOption,
    setSortOption,
    currentPage,
    totalPages: meta.last_page || 1,
    totalItems: meta.total || 0,
    itemsPerPage,
    handlePageChange,
    resetFilters,
    refetch,
    onExport,
    exportLoading,
  };
};
