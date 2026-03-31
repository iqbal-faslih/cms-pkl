import { useState, useEffect } from "react";

const useApprovalFilters = (activeTab) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });
  const [filterBy, setFilterBy] = useState([]);
  const [selectedAlasanIzin, setSelectedAlasanIzin] = useState([]);

  // Temp states for filter dropdown
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);
  const [tempSelectedAlasanIzin, setTempSelectedAlasanIzin] = useState([]);

  // ==================== FILTER HANDLERS ====================
  const handleApplyFilter = (filters) => {
    setFilterBy(tempSelectedStatuses);
    setSelectedDate({ start: filters.dateFrom, end: filters.dateTo });
    setSelectedAlasanIzin(tempSelectedAlasanIzin);
  };

  const handleStatusChange = (status) => {
    setTempSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleAlasanIzinChange = (alasan) => {
    setTempSelectedAlasanIzin((prev) =>
      prev.includes(alasan) ? prev.filter((a) => a !== alasan) : [...prev, alasan]
    );
  };

  // Sync temp states when filter changes or tab switches
  useEffect(() => {
    setTempSelectedStatuses(filterBy);
    setTempSelectedAlasanIzin(selectedAlasanIzin);
  }, [activeTab, filterBy, selectedAlasanIzin]);

  return {
    // States
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    filterBy,
    setFilterBy,
    selectedAlasanIzin,
    setSelectedAlasanIzin,
    tempSelectedStatuses,
    tempSelectedAlasanIzin,

    // Handlers
    handleApplyFilter,
    handleStatusChange,
    handleAlasanIzinChange,
  };
};

export { useApprovalFilters };
