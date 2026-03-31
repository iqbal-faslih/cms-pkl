import { useEffect, useState } from "react";
import { useTableSelection } from "../../../../shared/hooks/useTableSelection";

const FILTER_STATUS_OPTIONS = ["Ditolak", "Diterima", "Pending"];
const SORT_OPTIONS = [
  { value: "terbaru-terlama", label: "Terbaru - Terlama" },
  { value: "terlama-terbaru", label: "Terlama - Terbaru" },
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
  { value: "status-asc", label: "Status A-Z" },
  { value: "status-desc", label: "Status Z-A" },
];

export const useApprovalTableController = ({
  activeTab,
  currentPage,
  filterState,
  onUpdatePendaftaranStatuses,
  onUpdateIzinStatuses,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);
  const [tempSelectedAlasanIzin, setTempSelectedAlasanIzin] = useState([]);
  const [tempDate, setTempDate] = useState({ start: null, end: null });

  const {
    selectedItems,
    setSelectedItems,
    selectedIzinItems,
    setSelectedIzinItems,
    handleSelectItem,
    handleToggleIzinCheckbox,
  } = useTableSelection();

  useEffect(() => {
    setSelectedItems([]);
    setSelectedIzinItems([]);
    setTempSelectedStatuses([]);
    setTempSelectedAlasanIzin([]);
    setTempDate({ start: null, end: null });
    setShowCheckboxes(false);
    setIsActionMenuOpen(false);
  }, [activeTab, currentPage, setSelectedItems, setSelectedIzinItems]);

  const isRowSelectable = (row) => {
    const statusValue = activeTab === "pendaftaran" ? row?.status : row?.status_izin;
    return String(statusValue || "").toLowerCase() === "pending";
  };

  const handleOpenModal = (row) => {
    setSelectedData({ id: row.id });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedData(null);
  };

  const handleApplyFilter = (filters) => {
    filterState.onFilterChange({
      status: tempSelectedStatuses,
      alasan: tempSelectedAlasanIzin,
      masaMagang: {
        from: tempDate.start,
        to: tempDate.end,
      },
      date: {
        from: filters.dateFrom,
        to: filters.dateTo,
      },
    });
  };

  const handleStatusChange = (status) => {
    setTempSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status]
    );
  };

  const handleAlasanIzinChange = (alasan) => {
    setTempSelectedAlasanIzin((prev) =>
      prev.includes(alasan) ? prev.filter((item) => item !== alasan) : [...prev, alasan]
    );
  };

  const handleResetFilter = () => {
    setTempSelectedStatuses([]);
    setTempSelectedAlasanIzin([]);
    setTempDate({ start: null, end: null });
    filterState.reset();
  };

  const clearSelections = () => {
    setSelectedItems([]);
    setSelectedIzinItems([]);
  };

  const handleBatchModeToggle = () => {
    setShowCheckboxes((prev) => {
      if (prev) clearSelections();
      return !prev;
    });
    setIsActionMenuOpen(false);
  };

  const handleBatchModeCancel = () => {
    setShowCheckboxes(false);
    setIsActionMenuOpen(false);
    clearSelections();
  };

  const handleActionMenuToggle = () => {
    setIsActionMenuOpen((prev) => !prev);
  };

  const handleActionMenuClose = () => {
    setIsActionMenuOpen(false);
  };

  const executeBulkAction = async (targetStatus) => {
    let success = false;
    if (activeTab === "pendaftaran") {
      if (selectedItems.length > 0) {
        success = await onUpdatePendaftaranStatuses(selectedItems, targetStatus);
      }
    } else if (selectedIzinItems.length > 0) {
      success = await onUpdateIzinStatuses(selectedIzinItems, targetStatus);
    }

    if (success) handleBatchModeCancel();
    return success;
  };

  const selectedCount =
    activeTab === "pendaftaran" ? selectedItems.length : selectedIzinItems.length;

  return {
    isModalOpen,
    selectedData,
    showCheckboxes,
    isActionMenuOpen,
    selectedCount,
    tempSelectedStatuses,
    tempSelectedAlasanIzin,
    tempDate,
    setTempDate,
    selectedItems,
    selectedIzinItems,
    handleSelectItem,
    handleToggleIzinCheckbox,
    isRowSelectable,
    handleOpenModal,
    handleCloseModal,
    handleApplyFilter,
    handleStatusChange,
    handleAlasanIzinChange,
    handleResetFilter,
    handleBatchModeToggle,
    handleBatchModeCancel,
    handleActionMenuToggle,
    handleActionMenuClose,
    executeBulkAction,
    filterStatusOptions: FILTER_STATUS_OPTIONS,
    sortOptions: SORT_OPTIONS,
  };
};
