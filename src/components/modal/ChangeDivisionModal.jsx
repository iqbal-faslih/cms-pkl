import React from "react";
import { ArrowRightLeft } from "lucide-react";
import { useChangeDivisionModal } from "./hooks/useChangeDivisionModal";

const ChangeDivisionModal = ({ isOpen, onClose, student, onSuccess }) => {
  const {
    divisions,
    error,
    handleSubmit,
    loading,
    loadingDivisions,
    loadingMentors,
    selectedDivision,
    selectedMentor,
    selectedMentorName,
    setSelectedDivision,
  } = useChangeDivisionModal({
    isOpen,
    student,
    onSuccess,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] p-4">
      <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-[640px]">
        <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 mb-3">
          <ArrowRightLeft size={18} />
        </div>
        <h3 className="text-[28px] font-semibold text-gray-800 leading-none">Pindah Divisi</h3>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Divisi<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full h-10 rounded-xl border border-gray-300 px-3.5 pr-10 text-[15px] text-gray-800 appearance-none bg-white disabled:bg-gray-50"
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                  }}
                  disabled={loadingDivisions}
                  required
                >
                  <option value="">
                    {loadingDivisions ? "Memuat divisi..." : "Pilih Divisi"}
                  </option>
                  {divisions.map((division) => (
                    <option key={division.id || division.id_divisi} value={division.id || division.id_divisi}>
                      {division.nama || division.nama_divisi || division.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mentor<span className="text-red-500">*</span>
              </label>
              <div className="w-full h-10 rounded-xl border border-gray-300 px-3.5 text-[15px] text-gray-800 bg-gray-50 flex items-center">
                {loadingMentors
                  ? "Memuat mentor..."
                  : selectedDivision
                  ? selectedMentorName || "Tidak ada mentor untuk divisi ini"
                  : "Pilih divisi dulu"}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-10 rounded-xl border border-gray-300 text-base font-semibold text-gray-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-xl bg-[#1652F0] hover:bg-[#1448d5] text-white text-base font-semibold disabled:opacity-60"
              disabled={loading || !selectedDivision || !selectedMentor}
            >
              {loading ? "Proses..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeDivisionModal;
