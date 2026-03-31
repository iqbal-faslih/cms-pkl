import { useState } from "react";

/**
 * @param {Array} data - Array data yang akan dipaginasi
 * @param {number} rowsPerPage - Jumlah data per halaman
 * @returns {Object} { currentPage, setCurrentPage, currentData, totalPages, startIndex, endIndex, getPaginationRange }
 */
export const usePagination = (data = [], rowsPerPage = 6) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const getPaginationRange = (delta = 2) => {
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push("...");
    }
    rangeWithDots.unshift(1);
    rangeWithDots.push(...range);
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...");
    }
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return {
    currentPage,
    setCurrentPage,
    currentData,
    totalPages,
    startIndex,
    endIndex,
    getPaginationRange,
  };
};
