export default function DocumentsSection({ handleFileChange, errors }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Dokumen Pendukung (Opsional)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Dokumen Perusahaan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dokumen Perusahaan
          </label>
          <div className={`flex items-center space-x-2 border ${errors.legalitas_perusahaan ? "border-red-500" : "border-slate-400/[0.5]"} rounded-lg overflow-hidden`}>
            <input
              type="file"
              id="legalitas_perusahaan"
              name="legalitas_perusahaan"
              accept=".pdf,.docx,.jpeg,.png,.jpg"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="legalitas_perusahaan"
              className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-500 truncate px-2">
              No File Chosen
            </span>
          </div>
          {errors.legalitas_perusahaan && (
            <p className="text-red-500 text-xs mt-1">{errors.legalitas_perusahaan}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            *File harus berformat .pdf, .doc, .jpg, .jpeg, atau .png (maks. 2MB)
          </p>
        </div>

        {/* NPWP Perusahaan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            NPWP Perusahaan
          </label>
          <div className={`flex items-center space-x-2 border ${errors.npwp_perusahaan ? "border-red-500" : "border-slate-400/[0.5]"} rounded-lg overflow-hidden`}>
            <input
              type="file"
              id="npwp_perusahaan"
              name="npwp_perusahaan"
              accept=".pdf,.docx,.jpeg,.png,.jpg"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="npwp_perusahaan"
              className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-500 truncate px-2">
              No File Chosen
            </span>
          </div>
          {errors.npwp_perusahaan && (
            <p className="text-red-500 text-xs mt-1">{errors.npwp_perusahaan}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            *File harus berformat .pdf, .doc, .jpg, .jpeg, atau .png (maks. 2MB)
          </p>
        </div>

        {/* Logo Perusahaan */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Logo Perusahaan
          </label>
          <div className={`flex items-center space-x-2 border ${errors.profil_background ? "border-red-500" : "border-slate-400/[0.5]"} rounded-lg overflow-hidden`}>
            <input
              type="file"
              id="profil_background"
              name="profil_background"
              accept=".jpeg,.png,.jpg"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="profil_background"
              className="cursor-pointer px-3 py-2 bg-slate-100 text-slate-700 border-r border-r-slate-300"
            >
              Choose File
            </label>
            <span className="text-sm text-gray-500 truncate px-2">
              No File Chosen
            </span>
          </div>
          {errors.profil_background && (
            <p className="text-red-500 text-xs mt-1">{errors.profil_background}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            *File harus berformat .jpg, .jpeg, atau .png (maks. 2MB)
          </p>
        </div>
      </div>
    </div>
  );
}
