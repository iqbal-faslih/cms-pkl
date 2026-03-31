import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DangerButton from "@/components/button/DangerButton";
import PrimaryButton from "@/components/button/PrimaryButton";
import { dummyDetailSurat } from "../dummies";

export default function DetailSurat() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const data = state?.detail || dummyDetailSurat;

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-sm p-25">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-10 text-center">
          <img
            src="/assets/img/logoperusahaan.png"
            className="w-28 md:w-50 h-auto mb-4 md:mb-8"
            alt="Logo"
          />

          <div>
            <h2 className="font-semibold text-sm lg:text-lg xl:text-2xl tracking-wide mb-1">
              HUMMATECH MALANG
            </h2>

            <h1 className="font-semibold text-xl lg:text-2xl xl:text-5xl mb-3">
              PT HUMMA TEKNOLOGI INDONESIA
            </h1>

            <p className="text-base xl:text-xl mb-3">
              SMK 2 HUMMATECH MALANG AKREDITASI A
            </p>

            <p className="max-w-2xl mt-2 text-sm lg:text-base xl:text-xl text-center mx-auto">
              Perum. Permata Regency 1 Blok 10 No. 28 kec. Karangploso, Kab.
              Malang, Jatim, Indonesia, No Telp +628517677785
            </p>
          </div>
        </div>

        {/* GARIS */}
        <div className="w-full mt-2">
          <div className="h-3 bg-black mb-1"></div>
          <div className="h-1 bg-black"></div>
        </div>

        {/* FORM DETAIL */}
        <div className="mt-17 grid grid-cols-1 md:grid-cols-2 gap-y-12">
          {/* KIRI */}
          <div className="flex flex-col items-start space-y-10">
            <div className="w-full max-w-[550px]">
              <label className="font-medium mb-2 block">Nama</label>
              <input
                readOnly
                value={data.nama}
                className="font-semibold border border-[#ced2d9] rounded-lg px-5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="w-full max-w-[550px]">
              <label className="font-medium mb-2 block">Nomer Surat</label>
              <input
                readOnly
                value={data.no_surat}
                className="font-semibold border border-[#ced2d9] rounded-lg px-5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* KANAN */}
          <div className="flex flex-col items-end space-y-10">
            <div className="w-full max-w-[550px]">
              <label className="font-medium mb-2 block text-left">
                Jurusan
              </label>
              <input
                readOnly
                value={data.jurusan}
                className="font-semibold border border-[#ced2d9] rounded-lg px-5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="w-full max-w-[550px]">
              <label className="font-medium mb-2 block text-left">
                Selesai Magang
              </label>
              <input
                readOnly
                value={data.selesai_magang}
                className="font-semibold border border-[#ced2d9] rounded-lg px-5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end gap-4 mt-12">
          <DangerButton
            onClick={() => navigate(-1)}
            rounded="rounded-xl"
            font="font-normal px-7"
            className="bg-violet-900"
          >
            Kembali
          </DangerButton>

          <PrimaryButton 
          rounded="rounded-xl" 
          font="font-normal px-7"
          >
            Download
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
