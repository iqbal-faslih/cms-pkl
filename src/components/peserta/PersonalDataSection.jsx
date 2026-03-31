import React from "react";

export const PersonalDataSection = ({ dataPeserta }) => {
  return (
    <>
      {/* Data Diri Section */}
      <h2 className="text-xl font-semibold mb-0.5">Data Diri</h2>

      <div className="flex flex-col gap-5">
        <div className="border border-gray-300 py-4 px-6 rounded-xl relative">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-full bg-gray-400 overflow-hidden">
              <img src={dataPeserta?.profileImage} alt="Foto Profil" className="size-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-medium capitalize">{dataPeserta?.nama || ""}</p>
              <p className="text-xs opacity-60 capitalize">{dataPeserta?.perusahaan || ""}</p>
            </div>
          </div>
          <div className="px-4 py-2 text-[#0D52EF] bg-[#ECF2FE] rounded-full absolute top-2 right-2">
            <p className="text-sm">{dataPeserta?.divisi || ""}</p>
          </div>
        </div>

        <div className="border border-gray-300 py-8 px-10 rounded-xl relative">
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">nama</p>
                <p className="text-sm capitalize">{dataPeserta?.nama || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">alamat</p>
                <p className="text-sm capitalize">{dataPeserta?.alamat || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">jenis kelamin</p>
                <p className="text-sm capitalize">{dataPeserta?.jenis_kelamin || ""}</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">tempat lahir</p>
                <p className="text-sm capitalize">{dataPeserta?.tempat_lahir || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">tanggal lahir</p>
                <p className="text-sm capitalize">{dataPeserta?.tanggal_lahir || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">no. HP</p>
                <p className="text-sm capitalize">{dataPeserta?.telepon || ""}</p>
              </div>
            </div>
            <div className="flex flex-col gap-5 justify-center">
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 uppercase">nisn/nism</p>
                <p className="text-sm capitalize">{dataPeserta?.nomor_identitas || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">sekolah / universitas</p>
                <p className="text-sm capitalize">{dataPeserta?.sekolah || ""}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm opacity-60 capitalize">jurusan</p>
                <p className="text-sm capitalize">{dataPeserta?.jurusan || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
