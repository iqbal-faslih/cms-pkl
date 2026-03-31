import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";
import { useSearch } from "../../../../shared/hooks/useSearch";
import { buildQuery } from "../../../../shared/helpers/buildQuery";
import { formatDateToBackend } from "../../../../utils/dateUtils";

const SORT_SCHEMA = {
  "a-z": { by: "nama_peserta", dir: "asc" },
  "z-a": { by: "nama_peserta", dir: "desc" },
  "terbaru-terlama": { by: "created_at", dir: "desc" },
  "terlama-terbaru": { by: "created_at", dir: "asc" },
};

export const useRfid = (options = {}) => {
  const { itemsPerPage = 10, searchDelay = 500 } = options;

  const {
    keyword: searchTerm,
    debouncedKeyword,
    setKeyword: setSearchTerm,
  } = useSearch(searchDelay);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [currentPage, setCurrentPage] = useState(1);

  const [dateFilter, setDateFilter] = useState({
    from: null,
    to: null,
  });

  const [masaMagangFilter, setMasaMagangFilter] = useState({
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
        selesai_from: formatDateToBackend(masaMagangFilter.from),
        selesai_to: formatDateToBackend(masaMagangFilter.to),
      },
      date: dateFilter,
    });
  }, [
    debouncedKeyword,
    currentPage,
    itemsPerPage,
    sortOption,
    dateFilter,
    masaMagangFilter,
  ]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch(`/cabang-rfid?${queryString}`);

  const transformedData = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data.map((item, index) => ({
      no: (currentPage - 1) * itemsPerPage + index + 1,
      id: item.id,
      nama: item.nama || "N/A",
      email: item.email || "N/A",
      sekolah: item.sekolah || "N/A",
      rfidSiswa: item.rfid_code || "N/A",
      masaMagang:
        item.masa_magang?.mulai && item.masa_magang?.selesai
          ? `${item.masa_magang.mulai} - ${item.masa_magang.selesai}`
          : "N/A",
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
  }, [debouncedKeyword, sortOption, dateFilter, masaMagangFilter]);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const applyFilters = ({ dateFrom, dateTo, magangFrom, magangTo }) => {
    if (dateFrom !== undefined || dateTo !== undefined) {
      setDateFilter({
        from: dateFrom || null,
        to: dateTo || null,
      });
    }

    if (magangFrom !== undefined || magangTo !== undefined) {
      setMasaMagangFilter({
        from: magangFrom || null,
        to: magangTo || null,
      });
    }
  };

  const resetFilters = () => {
    setDateFilter({ from: null, to: null });
    setMasaMagangFilter({ from: null, to: null });
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
    dateFilter,
    masaMagangFilter,
    ...paginationInfo,
    handlePageChange,
    refetch,
  };
};
