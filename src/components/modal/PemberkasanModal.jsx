import { X, Calendar, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { DatePicker } from "../datepicker";
import PrimaryButton from "../button/PrimaryButton";
import DangerButton from "../button/DangerButton";
import { usePemberkasanModal } from "./hooks/usePemberkasanModal";

const formatDateToDdMmYyyy = (value = "") => {
  if (!value) return "";
  const parts = String(value).split("-");
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
};

export default function InternshipModal({ isOpen, onClose, jobData }) {
  const {
    modalRef,
    idLowongan,
    loading,
    fileName,
    handleFileChange,
    startDate,
    endDate,
    minEndDate,
    showStartCalendar,
    showEndCalendar,
    setShowStartCalendar,
    handleCloseClick,
    handleCancelClick,
    handleStartDateChange,
    handleEndInputClick,
    handleEndDateChange,
    downloadTemplate,
    submitApply,
  } = usePemberkasanModal({ isOpen, onClose, jobData });

  if (!isOpen) return null;

  if (!idLowongan) {
    Swal.fire({ icon: "error", title: "ID Lowongan tidak ditemukan" });
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Pemberkasan Magang</h2>
          <button
            onClick={handleCloseClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mulai Magang</label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formatDateToDdMmYyyy(startDate)}
                onClick={() => setShowStartCalendar((prev) => !prev)}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                size={18}
              />
              {showStartCalendar && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={startDate ? new Date(startDate) : new Date()}
                    minDate={new Date()}
                    onChange={handleStartDateChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Selesai Magang</label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={formatDateToDdMmYyyy(endDate)}
                onClick={handleEndInputClick}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 pl-3 pr-10 cursor-pointer"
              />
              <Calendar
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                size={18}
              />
              {showEndCalendar && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                  <DatePicker
                    selectedDate={endDate ? new Date(endDate) : new Date()}
                    minDate={minEndDate ? new Date(minEndDate) : new Date()}
                    onChange={handleEndDateChange}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Surat Pernyataan Diri
            </label>
            <label className="flex flex-col">
              <div className="w-full border border-gray-300 rounded-md p-2 pl-3 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <span className="text-gray-500 truncate">
                  {fileName || "Choose File"}
                </span>
                <Upload size={18} className="text-gray-400" />
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-red-500 text-xs mt-1">
              *Format: pdf, doc, jpg, jpeg, png. Max 2MB
            </p>
            <button
              className="mt-2 text-blue-600 text-sm flex items-center hover:text-blue-800"
              onClick={downloadTemplate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Template Surat Pernyataan Diri
            </button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <DangerButton onClick={handleCancelClick}>Batal</DangerButton>
            <PrimaryButton type="submit" onClick={submitApply} disabled={loading}>
              {loading ? "Memproses..." : "Simpan"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
