import React from "react";

const FilePreviewCard = ({ title, imageUrl, onOpen }) => {
  return (
    // Card pembungkus tiap file (CV, surat, dll)
    <div className="flex flex-col items-center justify-center bg-white border rounded-xl shadow-md p-3 w-44 hover:shadow-lg transition-all">
      {/* Gambar preview dokumen */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-28 object-cover rounded-md mb-2"
      />

      {/* Nama dokumen */}
      <p className="text-sm font-semibold text-gray-700 text-center">
        {title}
      </p>

      {/* Tombol untuk membuka file */}
      <button
        onClick={onOpen}
        className="text-sm text-blue-600 mt-2 hover:underline"
      >
        Lihat Dokumen
      </button>
    </div>
  );
};

export default FilePreviewCard;