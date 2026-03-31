import { useState } from "react";

export const useTableFilters = (data = [], izinData = [], activeTab) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });
  const [filterBy, setFilterBy] = useState([]);
  const [selectedAlasanIzin, setSelectedAlasanIzin] = useState([]);

  const currentData = activeTab === "pendaftaran" ? data : izinData;

  const filteredData = currentData.filter((item) => {
    let matches = true;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matches = matches && (item.nama?.toLowerCase().includes(searchLower) ||
                           item.sekolah?.toLowerCase().includes(searchLower) ||
                           item.jurusan?.toLowerCase().includes(searchLower) ||
                           item.alasan?.toLowerCase().includes(searchLower));
    }

    // Date filter
    if (selectedDate && (selectedDate.start || selectedDate.end)) {
      const itemDate = new Date(item.created_at || item.tanggal_izin);
      if (selectedDate.start && selectedDate.end) {
        matches = matches && itemDate >= selectedDate.start && itemDate <= selectedDate.end;
      } else if (selectedDate.start) {
        matches = matches && itemDate >= selectedDate.start;
      } else if (selectedDate.end) {
        matches = matches && itemDate <= selectedDate.end;
      }
    }

    // Status filter - support multiple status
    if (filterBy.length > 0) {
      if (activeTab === "pendaftaran") {
        matches = matches && filterBy.includes(item.status);
      } else {
        matches = matches && filterBy.includes(item.status_izin);
      }
    }

    // Alasan Izin filter - only for izin tab
    if (activeTab === "izin" && selectedAlasanIzin.length > 0) {
      const alasanLower = item.alasan?.toLowerCase() || "";
      const isIzin = alasanLower.includes("izin") && !alasanLower.includes("sakit");
      const isSakit = alasanLower.includes("sakit");
      matches = matches && (
        (selectedAlasanIzin.includes("izin") && isIzin) ||
        (selectedAlasanIzin.includes("sakit") && isSakit)
      );
    }

    return matches;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    filterBy,
    setFilterBy,
    selectedAlasanIzin,
    setSelectedAlasanIzin,
    filteredData,
  };
};
