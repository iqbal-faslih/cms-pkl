import React, { useState } from "react";
import { Download, X, FileSpreadsheet, FileText } from "lucide-react";

const ExportButton = ({ className = "", onExport, loading = false }) => {
  const [showModal, setShowModal] = useState(false);

  const handleExport = async (type) => {
    if (!onExport) return;
    await onExport(type);
    setShowModal(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg
          bg-[#00c8b3] text-white disabled:opacity-50 ${className}`}
      >
        <Download size={18} />
        Export
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-6">Export Data</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleExport("excel")}
                className="flex flex-col items-center gap-3 p-6 bg-green-600 hover:bg-green-700 rounded-xl text-white"
              >
                <FileSpreadsheet size={48} />
                Export Excel
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="flex flex-col items-center gap-3 p-6 bg-red-600 hover:bg-red-700 rounded-xl text-white"
              >
                <FileText size={48} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportButton;