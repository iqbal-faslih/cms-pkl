import React from "react";

export const CompanyFormSections = ({ formData, handleChange }) => {
  return (
    <>
      {/* Penanggung Jawab Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Nama Penanggung Jawab", name: "nama_penanggung_jawab" },
          {
            label: "Nomor HP Penanggung Jawab",
            name: "nomor_penanggung_jawab",
          },
          { label: "Email Penanggung Jawab", name: "email_penanggung_jawab" },
        ].map((field) => (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
        <div className="w-full">
          <label className="block text-sm font-medium text-black mb-1">
            Jabatan Penanggung Jawab
          </label>
          <select
            name="jabatan_penanggung_jawab"
            value={formData.jabatan_penanggung_jawab}
            onChange={handleChange}
            className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Pilih Jabatan</option>
            <option value="Direktur">Direktur</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Staff">Staff</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Company Basic Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Nama Perusahaan", name: "nama" },
          { label: "Tanggal Berdiri", name: "tanggal_berdiri" },
        ].map((field) => (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-black mb-1">
              {field.label}
            </label>
            <input
              type={field.name === "tanggal_berdiri" ? "date" : "text"}
              name={field.name}
              value={
                field.name === "tanggal_berdiri"
                  ? formData[field.name]?.split("T")[0] || ""
                  : formData[field.name]
              }
              onChange={handleChange}
              placeholder={field.label}
              className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-black mb-1">
          Deskripsi Perusahaan
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          placeholder="Tuliskan deskripsi perusahaan"
          rows={4}
          className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
    </>
  );
};
