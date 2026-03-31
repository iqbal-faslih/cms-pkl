import React from "react";

export default function DataDiriPerusahaan() {
  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen pb-16">
      {/* Container */}
      <div className="bg-white shadow-sm rounded-xl p-6 mx-auto max-w-[1080px] mt-6">
        {/* Title */}
        <h2 className="text-[20px] font-semibold text-slate-900">
          Data Umum Perusahaan
        </h2>
        <p className="text-sm text-slate-500 mb-7">
          Silahkan Lengkapi Data Terlebih Dahulu!
        </p>

        {/* Section 1 */}
        <span className="text-base font-semibold text-slate-800">
          Data Umum Perusahaan
        </span>
        <div className="h-[1px] bg-slate-200 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Nama Penanggung Jawab",
            "Nomor HP Penanggung Jawab",
            "Jabatan Penanggung Jawab",
            "Email Penanggung Jawab",
            "Nama Perusahaan",
            "Tanggal Berdiri",
          ].map((label, i) => (
            <div key={i}>
              <label className="text-sm text-slate-700">{label}</label>
              <input
                type={label === "Tanggal Berdiri" ? "date" : "text"}
                className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Deskripsi */}
        <div className="mt-5">
          <label className="text-sm text-slate-700">Deskripsi Perusahaan</label>
          <textarea
            rows="4"
            className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Section 2 */}
        <span className="text-base font-semibold text-slate-800 block mt-10">
          Kontak Perusahaan
        </span>
        <div className="h-[1px] bg-slate-200 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


          <div>
            <label className="text-sm text-slate-700">Alamat </label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm text-slate-700">Provinsi</label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm text-slate-700">Kabupen/Kota</label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="text-sm text-slate-700">Kode Pos</label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Row 2 - 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="text-sm text-slate-700">Email Perusahaan</label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-700">
              Nomor Telepon Perusahaan
            </label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Website Perusahaan</label>
            <input className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Section 3 */}
        <span className="text-base font-semibold text-slate-800 block mt-10">
          Dokumen Pendukung
        </span>
        <div className="h-[1px] bg-slate-200 my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Bukti Legalitas Perusahaan",
            "Bukti NPWP Perusahaan",
            "Profil Perusahaan Background",
          ].map((title, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center gap-3"
            >
              <div className="w-full h-[140px] bg-slate-100 rounded-lg"></div>
              <p className="font-medium text-sm text-slate-800 text-center">
                {title}
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Upload Dokumen
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-12">
          <button className="px-6 py-2 border border-slate-300 rounded-xl">
            Batal
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
