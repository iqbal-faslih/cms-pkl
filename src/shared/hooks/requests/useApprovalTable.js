import { useState, useEffect } from "react";
import { usePagination } from "../../../hooks/usePagination";
import { useApprovalData } from "./useApprovalData";

export const useApprovalTable = () => {
  const [activeTab, setActiveTab] = useState("pendaftaran");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState([]);
  const [reasonFilter, setReasonFilter] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  useEffect(() => {
    setSelectedItems([]);
    setShowCheckboxes(false);
  }, [activeTab]);

  // Fetch data from backend with filters
  const {
    pendaftaranData,
    izinData,
    loadingPendaftaran,
    loadingIzin,
    errorPendaftaran,
    errorIzin,
    refetchPendaftaran,
    refetchIzin,
  } = useApprovalData({
    searchTerm,
    sortBy,
    selectedDate,
    filterBy,
    selectedAlasanIzin: reasonFilter,
  });

  const currentData = activeTab === "pendaftaran" ? pendaftaranData : izinData;
  const loading = activeTab === "pendaftaran" ? loadingPendaftaran : loadingIzin;
  const error = activeTab === "pendaftaran" ? errorPendaftaran : errorIzin;

  const pagination = usePagination(currentData, 10);

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const updateStatus = (status) => {
    // Note: Status update logic might need to be handled via API call
    // For now, this is a placeholder
    console.log(`Updating status to ${status} for items:`, selectedItems);
    return true;
  };

  return {
    paginatedData: pagination.currentData,
    pagination,
    activeTab,
    setActiveTab,
    searchTerm, setSearchTerm,
    selectedDate, setSelectedDate,
    sortBy, setSortBy,
    filterBy, setFilterBy,
    reasonFilter,
    setReasonFilter,
    selectedItems,
    setSelectedItems,
    showCheckboxes,
    setShowCheckboxes,
    handleSelectItem,
    updateStatus,
    loading,
    error,
    refetch: activeTab === "pendaftaran" ? refetchPendaftaran : refetchIzin,
  };
};
