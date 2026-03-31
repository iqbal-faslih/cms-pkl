import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DetailSurat() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.detail;

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        
        {/* HEADER COMPANY LOGO */}
        <div className="  flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-10 text-center mb-8">
          <img
            src="/assets/img/logoperusahaan.png"
            className="w-24 md:w-40 h-auto"
            alt="Logo"
          />

          <div>
            <h2 className="font-semibold text-sm md:text-lg tracking-wide mb-1">
              SMK HUMMATECH MALANG
            </h2>
            <h1 className="font-semibold text-xl md:text-3xl mb-1">
              "SMK 2 HUMMATECH" MALANG
            </h1>
            <p className="text-sm md:text-base">
              SMK 2 HUMMATECH MALANG AKREDITASI A
            </p>
            <p className="max-w-xl mt-2 text-xs md:text-sm text-center mx-auto">
              Perum. Permata Regency Blok 10, Karangploso, Malang -
              No Telp +628517677785
            </p>
          </div>
        </div>

        {/* GARIS */}
        <div className="w-full">
          <div className="h-[5px] bg-black mb-1"></div>
          <div className="h-[2px] bg-black"></div>
        </div>

        {/* === FORM DETAIL === */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-y-6">

          {/* === NAMA === */}
          <div>
            <label className="font-medium mb-2 block">Nama</label>
            <input
              readOnly
              value={data?.nama}
              className="font-semibold border border-gray-300 rounded-lg px-4 py-2 w-[500px]"
            />
          </div>

          {/* === SEKOLAH === */}
          <div>
            <label className="font-medium mb-2 block">Sekolah</label>
            <input
              readOnly
              value={data?.sekolah}
              className="font-semibold border border-gray-300 rounded-lg px-4 py-2 w-[500px]"
            />
          </div>

          {/* === KETERANGAN SP === */}
          <div>
            <label className="font-medium mb-2 block">Keterangan SP</label>
            <input
              readOnly
              value={data?.keterangan}
              className="font-semibold border border-gray-300 rounded-lg px-4 py-2 w-[500px]"
            />
          </div>

          {/* === STATUS SP === */}
          <div>
            <label className="font-medium mb-2 block">Status SP</label>
            <input
              readOnly
              value={data?.status}
              className="font-semibold border border-gray-300 rounded-lg px-4 py-2 w-[500px]"
            />
          </div>

          {/* === TANGGAL === */}
          <div>
            <label className="font-medium mb-2 block">Tanggal</label>
            <input
              readOnly
              value={data?.tanggal}
              className="font-semibold border border-gray-300 rounded-lg px-4 py-2 w-[500px]"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-50 transition"
          >
            Kembali
          </button>

          <button
            className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
