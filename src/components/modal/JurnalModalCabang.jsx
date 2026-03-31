import React from "react";
import FormModal from "@/shared/components/modal/FormModal";

const JurnalModalCabang = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Format tanggal + jam
  const formatDateTime = (tanggal, jam) => {
    if (!tanggal) return "-";
    const parts = tanggal.split("/");
    if (parts.length !== 3) return tanggal;

    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const y = parts[2];

    return jam ? `${d}-${m}-${y} ${jam}` : `${d}-${m}-${y}`;
  };

  const fields = [
    {
      name: "content",
      type: "custom",
      fullWidth: true,
      render: () => (
        <div className="bg-white rounded-2xl px-6">

          {/* Nama */}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {data.nama}
          </h2>

          {/* Sekolah + Tanggal */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-[15px] font-semibold text-[#667797]">
              {data.sekolah}
            </p>
            <p className="text-[15px] font-semibold text-[#667797]">
              {formatDateTime(data.tanggal)}
            </p>
          </div>

          {/* Status / Judul Gambar */}
          <h3 className="text-[18px] font-semibold text-gray-900 mb-3">
            {data.judulGambar || "Tidak Mengisi Jurnal"}
          </h3>

          {/* Gambar */}
          <div className="border border-[#C5D9FD] rounded-xl overflow-hidden mb-6 flex justify-center">
            <img
              src={data.suratUrl}
              alt="Jurnal"
              className="w-full h-auto object-cover select-none"
            />
          </div>

          {/* Kegiatan */}
          <h3 className="text-[17px] font-semibold text-gray-900 mb-2">
            Kegiatan
          </h3>

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {data.deskripsi || "Tidak Mengisi Jurnal"}
          </p>
        </div>
      ),
    },
  ];

  const layout = [["content"]];

  const actions = [
    {
      label: "Tutup",
      type: "button",
      className:
        "ml-auto px-6 py-2 mb-4 bg-blue-600 text-white hover:bg-blue-800 rounded-lg",
      onClick: onClose,
    },
  ];

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={() => {}}
      title=""      
      subtitle=""
      icon=""          
      showIcon={false}    
      showIconBackground={false}
      fields={fields}
      layout={layout}
      actions={actions}
      initialValues={{}}
      showClose={false}
    />
  );
};

export default JurnalModalCabang;
