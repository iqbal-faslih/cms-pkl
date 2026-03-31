import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";
import { useSearch } from "../../../../shared/hooks/useSearch";
import { buildQuery } from "../../../../shared/helpers/buildQuery";
import { SORT_SCHEMA } from "../../../../shared/schema/querySchemas";

export const useDaftarCabang = (options = {}) => {
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
        aktif: appliedFilters.map((f) => (f === "Aktif" ? "true" : "false")),
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
  } = useFetch(`/superadmin-daftar-cabang?${queryString}`);

  const transformedData = useMemo(() => {
    if (!apiData?.data) return [];

    return apiData.data.map((item, index) => {
      const logoCabang = item.foto?.find((f) => f.type === "logo");

      return {
        no: (currentPage - 1) * itemsPerPage + index + 1,
        originalId: item.id,
        img: logoCabang
          ? `${import.meta.env.VITE_FILE_URL}/${logoCabang.path}`
          : null,
        lokasi: `${item.kota}, ${item.provinsi}`,
        nama: item.nama || "N/A",
        status: item.aktif === true ? "Aktif" : "Non Aktif",
        jumlah_peserta: item.total_peserta?.toString() || "0",
      };
    });
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
