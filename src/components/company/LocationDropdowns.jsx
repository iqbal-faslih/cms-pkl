import React from "react";

export const LocationDropdowns = ({
  formData,
  provinces,
  cities,
  districts,
  handleProvinceChange,
  handleCityChange,
  handleDistrictChange,
  handleChange,
}) => {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">Kontak Perusahaan</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Provinsi
          </label>
          <select
            name="provinsi"
            value={formData.provinsi}
            onChange={handleProvinceChange}
            className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Kabupaten/Kota
          </label>
          <select
            name="kota"
            value={formData.kota}
            onChange={handleCityChange}
            disabled={!formData.provinsi}
            className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Pilih Kota</option>
            {cities.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Kecamatan
          </label>
          <select
            name="kecamatan"
            value={formData.kecamatan}
            onChange={handleDistrictChange}
            disabled={!formData.kota}
            className="w-full p-2 border border-[#D5DBE7] rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Kode Pos
          </label>
          <input
            type="text"
            name="kode_pos"
            value={formData.kode_pos}
            onChange={handleChange}
            placeholder="Kode Pos"
            className="w-full p-2 border border-[#D5DBE7] rounded placeholder-[#667797] focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
};
