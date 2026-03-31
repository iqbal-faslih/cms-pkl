import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";
import { useSearch } from "../../../../shared/hooks/useSearch";
import { buildQuery } from "../../../../shared/helpers/buildQuery";
import { SORT_SCHEMA } from "../../../../shared/schema/querySchemas";

export const usePerusahaan = (options = {}) => {
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

  const [dateFilter, setDateFilter] = useState({
    from: null,
    to: null,
  });

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
        filter_kondisi: appliedFilters.map((f) => (f === "aktif" ? "1" : "0")),
      },
      date: dateFilter,
    });
  }, [
    debouncedKeyword,
    currentPage,
    itemsPerPage,
    sortOption,
    appliedFilters,
    dateFilter,
  ]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch(`/dashboard-superadmin/daftar-perusahaan?${queryString}`);

  const transformedData = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((item, index) => ({
      id: (currentPage - 1) * itemsPerPage + index + 1,
      originalId: item.id,
      nama: item.nama_perusahaan?.nama || "N/A",
      img: `${import.meta.env.VITE_FILE_URL}/${item.nama_perusahaan?.profil}`,
      lokasi: item.lokasi?.kota
        ? `${item.lokasi.kota}, ${item.lokasi.provinsi}`
        : "N/A",
      kondisi: item.kondisi === true ? "Aktif" : "Non Aktif",
      jml_cabang: item.total_cabang?.toString() || "0",
      jml_peserta: item.total_peserta?.toString() || "0",
      rawData: item,
    }));
  }, [apiData, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const meta = apiData?.meta || {};
    return {
      totalPages: meta.last_page || 1,
      totalItems: meta.total || 0,
      itemsPerPage: meta.per_page || itemsPerPage,
      from: meta.from || 0,
      to: meta.to || 0,
    };
  }, [apiData, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedKeyword, sortOption, appliedFilters, dateFilter]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const applyFilters = ({ dateFrom, dateTo }) => {
    setDateFilter({ from: dateFrom, to: dateTo });
    setAppliedFilters(selectedFilters);
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    setAppliedFilters([]);
    setDateFilter({ from: null, to: null });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > paginationInfo.totalPages) return;
    setCurrentPage(page);
  };

  return {
    data: transformedData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    currentPage,
    toggleFilter,
    applyFilters,
    sortOption,
    resetFilters,
    setSortOption,
    ...paginationInfo,
    handlePageChange,
    refetch,
  };
};
