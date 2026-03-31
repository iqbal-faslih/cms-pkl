import { useState, useEffect, useMemo } from "react";
import { useFetch } from "@/shared/hooks/requests/useFetch";
import { useSearch } from "@/shared/hooks/useSearch";
import { SORT_SCHEMA } from "@/shared/schema/querySchemas";
import { buildQuery } from "@/shared/helpers/buildQuery";

const mapApiToRow = (item, index, currentPage, perPage) => ({
  id: (currentPage - 1) * perPage + index + 1,
  originalId: item.id,
  nama: item.nama,
  sekolah: item.asal_sekolah,
  jurusan: item.jurusan,
  status: item.status,
  raw: item,
});

export const usePesertaMagangCabang = (options = {}) => {
  const {
    itemsPerPage = 10,
    searchDelay = 800,
    idCabang,
  } = options;

  const {
    keyword: searchTerm,
    debouncedKeyword,
    setKeyword: setSearchTerm,
  } = useSearch(searchDelay);

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
        status: appliedFilters, 
      },
      date: dateFilter,
      customParams: {
        id_cabang: idCabang,
      },
    });
  }, [
    debouncedKeyword,
    currentPage,
    itemsPerPage,
    sortOption,
    appliedFilters,
    dateFilter,
    idCabang,
  ]);

  const { data: apiData, loading, error, refetch } = useFetch(
    `/cabang-peserta-magang?${queryString}`
  );

  const data = useMemo(() => {
    if (!apiData?.data?.items) return [];
    return apiData.data.items.map((item, index) =>
      mapApiToRow(item, index, currentPage, itemsPerPage)
    );
  }, [apiData, currentPage, itemsPerPage]);

  const paginationInfo = useMemo(() => {
    const meta = apiData?.meta?.meta || {};
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
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
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