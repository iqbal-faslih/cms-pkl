import React, { useState, useEffect } from "react";
import DataTable from "@/shared/components/table/Table.jsx";
import TableHeader from "@/shared/components/table/TableHeader.jsx";
import JurnalModalCabang from "@/components/modal/JurnalModalCabang";
import Modal from "@/components/Modal";
import Calendar from "@/components/Calendar";
import dayjs from "dayjs";
import { JurnalConfig } from "@/shared/config/cabang/jurnalConfig";
import { useJurnalCabang } from "./hooks/useJurnal";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import Card from "../../../components/cards/Card";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";
import { formatDataForModal } from "../../cabang/jurnal/helpers/jurnalHelpers";

const JurnalCabang = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [showError, setShowError] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarRow, setCalendarRow] = useState(null);

  const {
    execute: updateTanggal,
    loading: updatingTanggal,
    error: updateError,
  } = useApiActions("/perusahaan-jurnal", "PUT");

  const {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
    resetFilters,
    refetch,
    onExport,
    exportLoading,
  } = useJurnalCabang({ itemsPerPage: 10, searchDelay: 500 });

  const handleOpenModal = (data) => {
    setSelectedData(data);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  const handleOpenCalendar = (row) => {
    setCalendarRow(row);
    setCalendarOpen(true);
  };

  const handleSaveDate = async (newDate) => {
    if (!calendarRow?.id) return;

    try {
      await updateTanggal(
        { tanggal: newDate.format("YYYY-MM-DD") },
        { url: `/perusahaan-jurnal/${calendarRow.id}` }
      );
      setCalendarOpen(false);
      setCalendarRow(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const { headerConfig, tableConfig, paginationConfig } = JurnalConfig(
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    sortOption,
    setSortOption,
    handleOpenModal,
    handleOpenCalendar,
    "/assets/icons/Rectangle.png",
    resetFilters,
    onExport,
    exportLoading
  );

  useEffect(() => {
    if (error || updateError) setShowError(true);
  }, [error, updateError]);

  return (
    <>
      <div className="w-full">
        <Card className="rounded-2xl">
          <TableHeader config={headerConfig} />

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                {searchTerm
                  ? `Tidak ada hasil untuk "${searchTerm}"`
                  : "Tidak ada data jurnal"}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[800px] sm:min-w-full">
                <DataTable
                  config={tableConfig}
                  data={data}
                  pagination={{
                    currentPage,
                    totalPages,
                    itemsPerPage,
                    totalItems,
                    onPageChange: handlePageChange,
                    label: paginationConfig.label,
                  }}
                />
              </div>
            </div>
          )}
        </Card>
      </div>

      <JurnalModalCabang
        isOpen={modalOpen}
        onClose={handleCloseModal}
        data={formatDataForModal(selectedData)}
      />

      <Modal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        title="Edit Tanggal"
        size="Large"
      >
        <Calendar
          disabled={updatingTanggal}
          currentDate={
            calendarRow?.date
              ? dayjs(calendarRow.date, "D/M/YYYY")
              : undefined
          }
          onSelectDate={handleSaveDate}
        />
      </Modal>

      <ErrorOverlay
        open={showError}
        message={
          updateError?.response?.data?.message ||
          error?.message ||
          "Gagal memproses data"
        }
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
        onClose={() => setShowError(false)}
      />
    </>
  );
};

export default JurnalCabang;