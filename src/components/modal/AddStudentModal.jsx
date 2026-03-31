import React from "react";
import { ChevronDown, FolderPlus } from "lucide-react";
import { useAddStudentModal } from "./hooks/useAddStudentModal";

export default function AddStudentModal({
  isOpen,
  onClose,
  mentorId,
  divisionId,
  divisionName = "",
  companyId = "",
  mentorName = "Mentor",
  onSuccess,
}) {
  const {
    loading,
    saving,
    error,
    students,
    selectedStudentId,
    selectedStudents,
    selectedStudentIds,
    handleSelectStudent,
    handleRemoveStudent,
    handleSubmit,
  } = useAddStudentModal({
    isOpen,
    mentorId,
    divisionId,
    divisionName,
    companyId,
    onClose,
    onSuccess,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] p-4 md:p-5">
        <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 mb-3">
          <FolderPlus size={18} />
        </div>

        <h3 className="text-[28px] font-semibold text-gray-800 leading-none">Tambah Siswa</h3>
        <p className="mt-1.5 text-[13px] text-gray-500">Add new student's on this participant</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Siswa<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={handleSelectStudent}
                disabled={loading || students.length === 0}
                className="w-full h-10 rounded-xl border border-gray-300 px-3.5 pr-10 text-[15px] text-gray-800 appearance-none disabled:bg-gray-50"
              >
                <option value="">
                  {loading
                    ? "Memuat siswa..."
                    : students.length > 0
                      ? "Pilih Siswa"
                      : "Tidak ada siswa tanpa mentor"}
                </option>
                {students
                  .filter((student) => !selectedStudentIds.has(student.id))
                  .map((student) => (
                    <option key={student.id} value={student.optionValue}>
                      {student.name}
                    </option>
                  ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mentor<span className="text-red-500">*</span>
            </label>
            <div className="w-full h-10 rounded-xl border border-gray-300 px-3.5 text-[15px] text-gray-800 bg-gray-50 flex items-center">
              {mentorName || "Mentor"}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Preview Siswa Pilihan</p>
          <div className="space-y-2 max-h-40 overflow-auto pr-1">
            {selectedStudents.length > 0 ? (
              selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="h-8 border border-gray-300 rounded-md flex items-center justify-between px-3 text-sm text-blue-600"
                >
                  <span>{student.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(student.id)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`Hapus ${student.name}`}
                  >
                    x
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">Belum ada siswa yang dipilih.</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-xl border border-gray-300 text-base font-semibold text-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="h-10 rounded-xl bg-[#1652F0] hover:bg-[#1448d5] text-white text-base font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

