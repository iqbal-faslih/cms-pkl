import React from "react";

export const getDetailPesertaModalFields = () => [
  {
    name: "judul",
    type: "custom",
    fullWidth: true,
    render: (data) => (
      <div>
        <label className="block text-lg font-semibold text-black mb-2">Judul :</label>
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-base bg-white">
          {data.judul || "-"}
        </div>
      </div>
    ),
  },
  {
    name: "bukti",
    type: "custom",
    render: (data) => (
      <div>
        <label className="block text-lg font-semibold text-black mb-2">Bukti :</label>
        <div className="border border-gray-300 rounded-xl p-2 h-[250px] bg-white flex items-center justify-center overflow-hidden">
          {data.bukti ? (
            <img
              src={data.bukti}
              alt="Bukti Jurnal"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 italic">Tidak ada bukti</span>
          )}
        </div>
      </div>
    ),
  },
  {
    name: "desc",
    type: "custom",
    render: (data) => (
      <div>
        <label className="block text-lg font-semibold text-black mb-2">
          Deskripsi Kegiatan :
        </label>
        <div className="w-full h-[250px] px-4 py-3 border border-gray-300 rounded-xl text-gray-700 text-base bg-white overflow-y-auto">
          {data.desc || "-"}
        </div>
      </div>
    ),
  },
];
