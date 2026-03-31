import React, { useState } from "react";

const ModalDetailIzin = ({ isOpen, onClose, data }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-999 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md md:max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Detail Izin</h2>
            <p className="text-sm text-gray-500">{data.tanggal}</p>
          </div>
        </div>

        {/* Surat */}
       <div className="border rounded-lg overflow-hidden mb-4 bg-gray-50 relative aspect-[16/9] flex items-center justify-center">
  {!isImageLoaded && (
    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
      Memuat gambar...
    </div>
  )}
  <img
    src={data.suratUrl}
    alt="Surat izin"
    onLoad={() => setIsImageLoaded(true)}
    className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
      isImageLoaded ? "opacity-100" : "opacity-0"
    }`}
  />
</div>

        {/* Deskripsi */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Deskripsi</h3>
          <div className="border rounded-lg bg-gray-50 p-3 text-sm text-gray-600 whitespace-pre-line">
            {data.deskripsi}
          </div>
        </div>

        {/* Tombol tutup */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-red-400 text-red-600 hover:bg-red-600 hover:text-white rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailIzin;
