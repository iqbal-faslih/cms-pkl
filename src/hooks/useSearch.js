import { useState } from "react";

/**
 * @param {Array} data - Array data yang akan difilter
 * @param {Function} filterFunction - Fungsi untuk memfilter data
 * @returns {Object} { search, setSearch, filteredData }
 */
export const useSearch = (data = [], filterFunction) => {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    filterFunction ? filterFunction(item, search) : true
  );

  return {
    search,
    setSearch,
    filteredData,
  };
};
