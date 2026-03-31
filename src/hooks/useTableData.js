import { useEffect } from "react";
import { useSearch } from "./useSearch";
import { useSorting } from "./useSorting";
import { usePagination } from "./usePagination";

/**
 * @param {Array} data - Array data mentah
 * @param {Function} filterFunction - Fungsi untuk memfilter data
 * @param {Object} initialSortConfig - Konfigurasi sort awal
 * @param {number} rowsPerPage - Jumlah data per halaman
 * @returns {Object} Gabungan dari semua hooks
 */
export const useTableData = (
  data = [],
  filterFunction,
  initialSortConfig = { key: "id", order: "asc" },
  rowsPerPage = 6
) => {
  const { search, setSearch, filteredData } = useSearch(data, filterFunction);

  const { sortedData, sortConfig, handleSort } = useSorting(
    filteredData,
    initialSortConfig
  );

  const {
    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    startIndex,
    endIndex,
    getPaginationRange,
  } = usePagination(sortedData, rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortConfig, setCurrentPage]);

  return {
    search,
    setSearch,

    sortConfig,
    handleSort,

    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    startIndex,
    endIndex,
    getPaginationRange,

    totalItems: sortedData.length,
    filteredItems: filteredData.length,
  };
};
