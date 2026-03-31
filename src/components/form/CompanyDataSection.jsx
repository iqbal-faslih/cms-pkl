export default function CompanyDataSection({ formData, handleChange, errors }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Data Umum Perusahaan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nama Penanggung Jawab */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nama Penanggung Jawab<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama_penanggung_jawab"
            placeholder="Masukkan Nama"
            className={`w-full p-2 border ${errors.nama_penanggung_jawab ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.nama_penanggung_jawab}
            onChange={handleChange}
            required
          />
          {errors.nama_penanggung_jawab && (
            <p className="text-red-500 text-xs mt-1">{errors.nama_penanggung_jawab}</p>
          )}
        </div>

        {/* Nomor HP Penanggung Jawab */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nomor HP Penanggung Jawab<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="nomor_penanggung_jawab"
            placeholder="Masukkan Nomor HP"
            className={`w-full p-2 border ${errors.nomor_penanggung_jawab ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.nomor_penanggung_jawab}
            onChange={handleChange}
            required
            maxLength={13}
          />
          {errors.nomor_penanggung_jawab && (
            <p className="text-red-500 text-xs mt-1">{errors.nomor_penanggung_jawab}</p>
          )}
        </div>

        {/* Jabatan Penanggung Jawab */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Jabatan Penanggung Jawab<span className="text-red-500">*</span>
          </label>
          <select
            name="jabatan_penanggung_jawab"
            className={`w-full p-2 border ${errors.jabatan_penanggung_jawab ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            value={formData.jabatan_penanggung_jawab}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Jabatan</option>
            <option value="direktur">Direktur</option>
            <option value="manager">Manager</option>
            <option value="supervisor">Supervisor</option>
          </select>
          {errors.jabatan_penanggung_jawab && (
            <p className="text-red-500 text-xs mt-1">{errors.jabatan_penanggung_jawab}</p>
          )}
        </div>

        {/* Email Penanggung Jawab */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Penanggung Jawab<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email_penanggung_jawab"
            placeholder="Masukkan Email"
            className={`w-full p-2 border ${errors.email_penanggung_jawab ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.email_penanggung_jawab}
            onChange={handleChange}
            required
          />
          {errors.email_penanggung_jawab && (
            <p className="text-red-500 text-xs mt-1">{errors.email_penanggung_jawab}</p>
          )}
        </div>

        {/* Nama Perusahaan */}
        <div className="space-y-2 mb-5">
          <label className="block text-sm font-medium text-gray-700">
            Nama Perusahaan<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan Nama Perusahaan"
            className={`w-full p-2 border ${errors.nama ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={formData.nama}
            onChange={handleChange}
            required
          />
          {errors.nama && (
            <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
          )}
        </div>

        {/* Tanggal Berdiri */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal Berdiri<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="tanggal_berdiri"
              className={`w-full p-2 border ${errors.tanggal_berdiri ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={formData.tanggal_berdiri}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]} // Tanggal tidak boleh di masa depan
            />
          </div>
          {errors.tanggal_berdiri && (
            <p className="text-red-500 text-xs mt-1">{errors.tanggal_berdiri}</p>
          )}
        </div>
      </div>

      {/* Deskripsi Perusahaan */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Deskripsi Perusahaan<span className="text-red-500">*</span>
        </label>
        <div>
          <textarea
            className={`w-full p-2 border ${errors.deskripsi ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
            name="deskripsi"
            placeholder="Deskripsi Perusahaan"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={4}
          ></textarea>
          {errors.deskripsi && (
            <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>
          )}
        </div>
      </div>
    </div>
  );
}
