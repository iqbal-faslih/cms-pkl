import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/Button";
import AbsensiTable from "../../components/AbsensiTable";
import ModalIzin from "../../components/modal/ModalIzin";
import ModalTanggalFilter from "../../components/modal/ModalFilterTanggal";
import { useAbsensiStore } from "../../stores/useAbsensiStore";
import useAbsensi from "../../hooks/useAbsensi";
import { formatDateForDisplay } from "../../helpers/dateFormatterHelper";

const Absensi = () => {
  const [isIzinModalOpen, setIsIzinModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { loading, pdfLoading, absensiData, paginationInfo } = useAbsensiStore();
  const { handleAbsen, handleDownloadPDF, getAbsensiList } = useAbsensi();

  const handleApplyFilter = useCallback((start, end) => {
    setStartDate(start);
    setEndDate(end);
    getAbsensiList({ page: 1, startDate: start, endDate: end });
    setIsFilterModalOpen(false);
  }, [getAbsensiList]);

  useEffect(() => {
    getAbsensiList({ page: 1, startDate, endDate });
  }, [getAbsensiList, startDate, endDate]);

  return (
    <section className="w-full">
      <div className="px-10">
        <div className="flex justify-between items-center mb-6">
          {/* Kiri: Download PDF dan Filter Tanggal */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                pdfLoading ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              <i className="bi bi-download"></i>
              <span>Download PDF</span>
            </Button>
            <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors"
              aria-haspopup="dialog"
              aria-expanded={isFilterModalOpen}
            >
              <i className="bi bi-calendar-range" />
              <span>
                {startDate && endDate
                  ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                  : "Filter Tanggal"}
              </span>
              <i className="bi bi-caret-down-fill text-xs" />
            </button>
            <ModalTanggalFilter
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              onApplyFilter={handleApplyFilter}
            />
            </div>
          </div>

          {/* Kanan: Tombol Absen dan Izin */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleAbsen}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                loading ? "bg-blue-500 cursor-not-allowed" : "bg-[#306BFF] hover:bg-blue-600"
              }`}
            >
              Absen
            </Button>
            <Button
              onClick={() => setIsIzinModalOpen(true)}
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-[#FF8C00] hover:bg-orange-500"
              }`}
            >
              Izin
            </Button>
          </div>
        </div>

        <AbsensiTable
          data={absensiData}
          loading={loading}
          page={paginationInfo.currentPage}
          lastPage={paginationInfo.lastPage}
          total={paginationInfo.total}
          onPageChange={(newPage) => getAbsensiList({ page: newPage, startDate, endDate })}
        />
      </div>

      <ModalIzin
        isOpen={isIzinModalOpen}
        onClose={() => setIsIzinModalOpen(false)}
      />
    </section>
  );
};

export default Absensi;