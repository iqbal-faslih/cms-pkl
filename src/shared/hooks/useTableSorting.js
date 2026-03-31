import { useState } from "react";

export const useTableSorting = () => {
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortOptions = [
    { label: "Terbaru-Terlama", value: "created_at desc" },
    { label: "Terlama-Terbaru", value: "created_at asc" },
    { label: "Nama A-Z", value: "nama asc" },
    { label: "Nama Z-A", value: "nama desc" },
  ];

  const handleSortChange = (value) => {
    const [field, direction] = value.split(' ');
    setSortBy(field);
    setSortDirection(direction);
  };

  // Note: Sorting is now handled by backend, so sortedData function is removed

  return {
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    sortOptions,
    handleSortChange,
  };
};
