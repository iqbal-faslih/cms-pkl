export default function ContactSection({
  formData,
  handleChange,
  errors,
  provinces,
  cities,
  districts,
  selectedProvince,
  selectedCity,
  handleProvinceChange,
  handleCityChange,
  handleDistrictChange
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Kontak Perusahaan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Provinsi */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Provinsi<span className="text-red-500">*</span>
          </label>
          <select
            name="provinsi"
            className={`w-full p-2 border ${errors.provinsi ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            required
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.provinsi && (
            <p className="text-red-500 text-xs mt-1">{errors.provinsi}</p>
          )}
        </div>

        {/* Kabupaten/Kota */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kabupaten/Kota<span className="text-red-500">*</span>
          </label>
          <select
            name="kota"
            className={`w-full p-2 border ${errors.kota ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            required
            disabled={!selectedProvince}
          >
            <option value="">Pilih Kabupaten/Kota</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.kota && (
            <p className="text-red-500 text-xs mt-1">{errors.kota}</p>
          )}
        </div>

        {/* Kecamatan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kecamatan<span className="text-red-500">*</span>
          </label>
          <select
            name="kecamatan"
            className={`w-full p-2 border ${errors.kecamatan ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            value={formData.kecamatan}
            onChange={(e) => handleDistrictChange(e.target.value)}
            required
            disabled={!selectedCity}
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          {errors.kecamatan && (
            <p className="text-red-500 text-xs mt-1">{errors.kecamatan}</p>
          )}
        </div>

        {/* Kode Pos */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kode Pos<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kode_pos"
            placeholder="Masukkan Kode Pos"
            className={`w-full p-2 border ${errors.kode_pos ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.kode_pos}
            onChange={handleChange}
            required
            maxLength={5}
            pattern="[0-9]{5}"
          />
          {errors.kode_pos && (
            <p className="text-red-500 text-xs mt-1">{errors.kode_pos}</p>
          )}
        </div>

        {/* Nomor Telepon Perusahaan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nomor Telepon Perusahaan<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="telepon"
            placeholder="Masukkan Nomor Telepon"
            className={`w-full p-2 border ${errors.telepon ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.telepon}
            onChange={handleChange}
            required
          />
          {errors.telepon && (
            <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>
          )}
        </div>

        {/* Website Perusahaan */}
        <div className="space-y-2 mb-5">
          <label className="block text-sm font-medium text-gray-700">
            Website Perusahaan<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://website-perusahaan.com"
            className={`w-full p-2 border ${errors.website ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.website}
            onChange={handleChange}
            required
          />
          {errors.website && (
            <p className="text-red-500 text-xs mt-1">{errors.website}</p>
          )}
        </div>
      </div>

      {/* Alamat Perusahaan */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alamat Perusahaan<span className="text-red-500">*</span>
        </label>
        <div>
          <textarea
            className={`w-full p-2 border ${errors.alamat ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            name="alamat"
            placeholder="Alamat Perusahaan"
            value={formData.alamat}
            onChange={handleChange}
            rows={4}
            required
          ></textarea>
          {errors.alamat && (
            <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>
          )}
        </div>
      </div>
    </div>
  );
}
