import { useState } from "react";

export const useTableSorting = () => {
  const [sortBy, setSortBy] = useState("");

  const sortOptions = [
    { label: "Nama A-Z", value: "nama_asc" },
    { label: "Nama Z-A", value: "nama_desc" },
    { label: "Tanggal Terbaru", value: "tanggal_desc" },
    { label: "Tanggal Terlama", value: "tanggal_asc" },
  ];

  const sortedData = (data) => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case "nama_asc":
          return a.nama.localeCompare(b.nama);
        case "nama_desc":
          return b.nama.localeCompare(a.nama);
        case "tanggal_asc":
          return new Date(a.created_at || a.tanggal_izin) - new Date(b.created_at || b.tanggal_izin);
        case "tanggal_desc":
          return new Date(b.created_at || b.tanggal_izin) - new Date(a.created_at || a.tanggal_izin);
        default:
          return 0;
      }
    });
  };

  return {
    sortBy,
    setSortBy,
    sortOptions,
    sortedData,
  };
};
