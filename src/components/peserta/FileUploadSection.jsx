import React from "react";

export const FileUploadSection = ({ dataPeserta }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Foto Peserta Magang */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Foto Peserta Magang
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {dataPeserta?.foto_peserta ? (
              <img
                src={dataPeserta.foto_peserta}
                alt="Foto Peserta"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] text-gray-500">
              <p>
                <span className="text-blue-600 font-medium">
                  Foto Peserta Magang
                </span>
              </p>
              <p>JPG, PNG • Max 2MB</p>
              <p>Size 500 x 500 PX</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">
              Browse
            </button>
          </div>
        </div>
      </div>

      {/* Bukti CV Peserta */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Bukti CV Peserta
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] text-gray-500">
              <p>
                <span className="text-blue-600 font-medium">
                  {dataPeserta?.cv_peserta
                    ? "CV Uploaded"
                    : "Bukti CV Peserta"}
                </span>
              </p>
              <p>PDF • Max 2MB</p>
              <p>Size A4/Letter, 72 DPI</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">
              Browse
            </button>
          </div>
        </div>
      </div>

      {/* Bukti Surat Pernyataan Diri */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Bukti Surat Pernyataan Diri
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-[10px] text-gray-500">
              <p>
                <span className="text-blue-600 font-medium">
                  {dataPeserta?.surat_pernyataan
                    ? "Surat Uploaded"
                    : "Bukti Surat Pernyataan Diri"}
                </span>
              </p>
              <p>PDF • Max 2MB</p>
              <p>Size A4/Letter, 72 DPI</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 ml-4 whitespace-nowrap">
              Browse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
