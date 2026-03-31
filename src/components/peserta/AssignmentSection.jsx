import React from "react";

export const AssignmentSection = ({ dataPeserta }) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-0.5">
        Pemberitasan
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        Silahkan lengkapi pemberitasan dibawah ini
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Perusahaan
          </label>
          <input
            type="text"
            value={dataPeserta?.perusahaan || ""}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Cabang Perusahaan
          </label>
          <input
            type="text"
            value={dataPeserta?.cabang || ""}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Divisi yang dipilih
          </label>
          <input
            type="text"
            value={dataPeserta?.divisi || ""}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mulai Magang
          </label>
          <input
            type="text"
            value={dataPeserta?.mulai_magang || ""}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Selesai Magang
          </label>
          <input
            type="text"
            value={dataPeserta?.selesai_magang || ""}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};
