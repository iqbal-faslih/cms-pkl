import { useState, useEffect, useMemo } from "react";
import { useFetch } from "@/shared/hooks/requests/useFetch";
import { useSearch } from "@/shared/hooks/useSearch";
import { buildQuery } from "@/shared/helpers/buildQuery";
import { SORT_SCHEMA } from "@/shared/schema/querySchemas";

const formatApiDate = (d) => {
  if (!d) return "-";
  if (d.includes("/")) return d;
  const p = d.split("-");
  if (p.length !== 3) return d;
  return `${p[2]}/${p[1]}/${p[0]}`;
};

const mapApiToRow = (item, index, currentPage, perPage) => ({
  id: (currentPage - 1) * perPage + index + 1,
  originalId: item.id_peserta,
  nama: item.nama_peserta,
  tanggal: item.tanggal ? formatApiDate(item.tanggal) : "-",
  masuk: item.jam_masuk ? item.jam_masuk.slice(0, 5) : "-",
  istirahat: item.jam_istirahat ? item.jam_istirahat.slice(0, 5) : "-",
  pulang: item.jam_pulang ? item.jam_pulang.slice(0, 5) : "-",
  status: item.status || (item.status_kehadiran === 1 ? "Hadir" : "Alpa"),
  raw: item,
});

export const useAbsensi = (options = {}) => {
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
      filters: { status: appliedFilters },
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

  const exportQueryString = useMemo(() => {
    return buildQuery({
      search: debouncedKeyword,
      sort: sortOption,
      sortSchema: SORT_SCHEMA,
      filters: { status: appliedFilters },
      date: dateFilter,
    });
  }, [debouncedKeyword, sortOption, appliedFilters, dateFilter]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch(`/perusahaan-absensi/data?${queryString}`);

  const absensiList = useMemo(() => {
    if (!apiData?.data?.data_absensi) return [];
    return apiData.data.data_absensi.map((item, idx) =>
      mapApiToRow(item, idx, currentPage, itemsPerPage)
    );
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

  const handleExport = async (type = "pdf") => {
    const endpoint = 
      type === "excel"
        ? `/perusahaan-export/excel`
        : `/perusahaan-export/pdf`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Gagal export data");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `absensi.${type === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("EXPORT ERROR:", err);
    }
  };

  return {
    absensiList,
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
    handleExport,
  };
};
