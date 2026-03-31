import React, { useState, useEffect } from "react";
import { BsX } from "react-icons/bs";
import { statusColors } from "../../utils/revisionUtils";

const EditRevisionModal = ({ isOpen, onClose, revisi, onSave }) => {
  const [editedRevisi, setEditedRevisi] = useState(revisi);

  useEffect(() => {
    if (isOpen) {
      setEditedRevisi(revisi);
    }
  }, [isOpen, revisi]);

  const handleTaskChange = (index, newDescription) => {
    const newTugas = [...editedRevisi.tugas];
    newTugas[index] = { ...newTugas[index], deskripsi: newDescription };
    setEditedRevisi({ ...editedRevisi, tugas: newTugas });
  };

  const handleTaskStatusChange = (index) => {
    const newTugas = [...editedRevisi.tugas];
    newTugas[index] = { ...newTugas[index], selesai: !newTugas[index].selesai };
    setEditedRevisi({ ...editedRevisi, tugas: newTugas });
  };

  const handleStatusChange = () => {
    let nextStatus = "belum dikerjakan";
    if (editedRevisi.status === "belum dikerjakan") {
      nextStatus = "dalam proses";
    } else if (editedRevisi.status === "dalam proses") {
      nextStatus = "selesai";
    } else if (editedRevisi.status === "selesai") {
        nextStatus = "selesai";
      }
      setEditedRevisi({ ...editedRevisi, status: nextStatus, isLate: false });
  };
  
  const handleSave = () => {
    onSave(editedRevisi);
    onClose();
  };

  if (!isOpen) return null;

  const statusKey = editedRevisi.isLate ? "terlambat" : editedRevisi.status.toLowerCase();
  const statusInfo = statusColors[statusKey] || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-xl">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Edit Revisi {revisi.id}</h2>
            <p className="text-gray-600 text-sm mb-1">{revisi.tanggal}</p>
            <p className="text-xs text-gray-400">Terakhir diedit {revisi.tanggal}</p>
          </div>

          <div className="flex flex-col items-end">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mb-2">
              <BsX size={24} />
            </button>
            <div className={`flex flex-col items-center cursor-pointer`} onClick={handleStatusChange}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-300`}>
                <div className={`w-4 h-4 rounded-full ${statusInfo.backgroundClass}`}></div>
              </div>
              <p className="mt-2 text-sm font-semibold capitalize text-gray-700">{statusInfo.statusText}</p>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          {editedRevisi.tugas.length > 0 ? (
            editedRevisi.tugas.map((task, index) => (
              <div key={task.id || index} className="flex items-start">
                <input
                  type="checkbox"
                  checked={task.selesai}
                  onChange={() => handleTaskStatusChange(index)}
                  className="mt-1 h-5 w-5 text-gray-400 rounded focus:ring-blue-500 border-gray-300"
                />
                <textarea
                  className="ml-3 flex-1 p-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="3"
                  value={task.deskripsi}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  placeholder="Sampaikan atau ketik detail tugas..."
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Tidak ada tugas untuk revisi ini.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className={`px-6 py-2 text-base font-medium text-white ${statusColors.selesai.backgroundClass} rounded-md hover:opacity-90 transition-opacity`}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRevisionModal;