import { useState } from "react";

/**
 * @param {Array} data - Array data yang akan disort
 * @param {Object} initialSortConfig - Konfigurasi sort awal { key, order }
 * @returns {Object} { sortedData, sortConfig, handleSort }
 */
export const useSorting = (
  data = [],
  initialSortConfig = { key: "id", order: "asc" }
) => {
  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  const sortedData = [...data].sort((a, b) => {
    const { key, order } = sortConfig;

    if (key === "id") {
      return order === "asc" ? a.id - b.id : b.id - a.id;
    }

    if (key === "tanggal") {
      return order === "asc"
        ? new Date(a.tanggal) - new Date(b.tanggal)
        : new Date(b.tanggal) - new Date(a.tanggal);
    }

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      const comparison = a[key].localeCompare(b[key]);
      return order === "asc" ? comparison : -comparison;
    }

    if (typeof a[key] === "number" && typeof b[key] === "number") {
      return order === "asc" ? a[key] - b[key] : b[key] - a[key];
    }

    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          order: prev.order === "asc" ? "desc" : "asc",
        };
      }
      return { key, order: "asc" };
    });
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
};
