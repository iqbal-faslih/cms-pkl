import React from "react";
import { BsX } from "react-icons/bs";
import { statusColors } from "../../utils/revisionUtils";

const DetailRevisionModal = ({ isOpen, onClose, revisi }) => {
  if (!isOpen) return null;

  const statusKey = revisi.isLate ? "terlambat" : revisi.status.toLowerCase();
  const statusInfo = statusColors[statusKey] || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-xl">

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Revisi {revisi.id}</h2>
            <p className="text-gray-600 text-sm mb-1">{revisi.tanggal}</p>
            <p className="text-xs text-gray-400">Terakhir diedit {revisi.tanggal}</p>
          </div>

          <div className="flex flex-col items-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mb-2">
              <BsX size={24} />
            </button>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow`}>
                <div className={`w-4 h-4 rounded-full ${statusInfo.backgroundClass}`}></div>
            </div>
            <p className={`mt-2 text-sm font-semibold capitalize text-gray-800`}>{statusInfo.statusText}</p>
          </div>
        </div>

        <hr className="my-6" />
        <div className="mb-6">
          <p className="text-gray-800 text-lg font-semibold">{revisi.description || "Tulis deskripsi tugas..."}</p>
        </div>

        <div className="space-y-4">
          {revisi.tugas.length > 0 ? (
            revisi.tugas.map((task, index) => (
              <div key={task.id || index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={task.selesai}
                  readOnly
                  className="mt-1 h-5 w-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
                />
                <p className={`ml-3 text-gray-800 flex-1 ${task.selesai ? "line-through text-gray-500" : ""}`}>
                  {task.deskripsi || "Sampaikan atau ketik detail tugas..."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Tidak ada tugas untuk revisi ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailRevisionModal;