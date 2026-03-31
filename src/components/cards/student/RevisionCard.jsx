import React, { useState } from "react";
import { BsThreeDots, BsPlus, BsPencil, BsInfoCircle } from "react-icons/bs";
import EditRevisionModal from "../../modal/EditRevisionModal";
import DetailRevisionModal from "../../modal/DetailRevisionModal";

const RevisionCard = ({
  revisi,
  onAddTask,
  onUpdateTask,
  onEditRevision,
  backgroundClass,
  statusText,
  icon,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setShowDropdown(false);
  };

  const handleDetailClick = () => {
    setIsDetailModalOpen(true);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div
        className={`w-full max-w-sm min-h-[320px] flex flex-col rounded-xl shadow-md p-4 border-2 text-white ${backgroundClass}`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center border border-white">
              {icon}
            </div>
            <span className="text-sm font-semibold capitalize">{statusText}</span>
          </div>
          <div className="relative flex items-center space-x-2">
            <button
              className="hover:text-gray-200"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <BsThreeDots size={20} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                <button
                  onClick={handleEditClick}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <BsPencil className="mr-2" /> Edit Revisi
                </button>
                <button
                  onClick={handleDetailClick}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <BsInfoCircle className="mr-2" /> Detail Revisi
                </button>
              </div>
            )}
            <button
              className="hover:text-gray-200"
              onClick={() => onAddTask(revisi.id)}
            >
              <BsPlus size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg p-4 text-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="text-md font-semibold">Revisi {revisi.id}</h4>
              {revisi.isLate && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                  Terlambat
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">{revisi.tanggal}</span>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          <div className="space-y-2">
            {revisi.tugas.map((task, index) => (
              <div key={task.id || index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.selesai}
                  onChange={() =>
                    onUpdateTask(revisi.id, index, { selesai: !task.selesai })
                  }
                  className="h-4 w-4 cursor-pointer accent-blue-500"
                />
                <input
                  type="text"
                  value={task.deskripsi}
                  onChange={(e) =>
                    onUpdateTask(revisi.id, index, { deskripsi: e.target.value })
                  }
                  placeholder="Tulis deskripsi tugas..."
                  className={`flex-1 text-sm bg-transparent border-b focus:outline-none ${
                    task.selesai ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <EditRevisionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        revisi={revisi}
        onSave={onEditRevision}
      />
      <DetailRevisionModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        revisi={revisi}
        statusText={statusText}
        isLate={revisi.isLate}
      />
    </div>
  );
};

export default RevisionCard;