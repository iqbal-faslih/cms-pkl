import { CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";


export default function ModalTambahCabang({ isOpen, onClose, onSave, getFetchData }) {
  const [formData, setFormData] = useState({
    nama: "",
    logo: null,
    bidang_usaha: "",
    provinsi: "",
    kota: "",
    profil_cover: null,
  });

  const [logoFileName, setLogoFileName] = useState("No File Chosen");
  const [fotoCoverFileName, setFotoCoverFileName] = useState("No File Chosen");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setErrors({});
      setApiError("");
      fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then((res) => res.json())
        .then(setProvinces)
        .catch(() => {
          setApiError("Gagal memuat data provinsi. Silakan coba lagi.");
        });
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nama":
        if (!value.trim()) error = "Nama cabang tidak boleh kosong";
        else if (value.length < 3) error = "Minimal 3 karakter";
        else if (value.length > 50) error = "Maksimal 50 karakter";
        break;
      case "logo":
        if (!value) error = "Logo perusahaan harus diupload";
        else if (value.size > 2 * 1024 * 1024) error = "Ukuran logo maksimal 2MB";
        else if (!value.type.startsWith("image/")) error = "File harus berupa gambar";
        break;
      case "bidang_usaha":
        if (!value.trim()) error = "Bidang usaha harus dipilih";
        break;
      case "provinsi":
        if (!value) error = "Provinsi harus dipilih";
        break;
      case "kota":
        if (!value) error = "Kota harus dipilih";
        break;
      case "profil_cover":
        if (value && value.size > 5 * 1024 * 1024) error = "Ukuran file maksimal 5MB";
        else if (value && !value.type.startsWith("image/")) error = "File harus berupa gambar";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProvinceChange = (e) => {
    const selected = provinces.find((p) => p.name === e.target.value);
    if (!selected) return;

    setFormData((prev) => ({ ...prev, provinsi: selected.name, kota: "" }));
    setCities([]);
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selected.id}.json`)
      .then((res) => res.json())
      .then(setCities)
      .catch(() => setErrors((prev) => ({ ...prev, kota: "Gagal memuat data kota" })));
  };

  const handleCityChange = (e) => {
    setFormData((prev) => ({ ...prev, kota: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const err = validateField(name, file);
    if (err) return setErrors((prev) => ({ ...prev, [name]: err }));

    setFormData((prev) => ({ ...prev, [name]: file }));
    if (name === "logo") setLogoFileName(file.name);
    if (name === "profil_cover") setFotoCoverFileName(file.name);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("nama", formData.nama);
      data.append("logo", formData.logo);
      data.append("bidang_usaha", formData.bidang_usaha);
      data.append("provinsi", formData.provinsi);
      data.append("kota", formData.kota);
      if (formData.profil_cover) data.append("profil_cover", formData.profil_cover);

      await onSave(data);
      resetForm();
      getFetchData();
      onClose();
    } catch {
      setApiError("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      logo: null,
      bidang_usaha: "",
      provinsi: "",
      kota: "",
      profil_cover: null,
    });
    setLogoFileName("No File Chosen");
    setFotoCoverFileName("No File Chosen");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-999">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        <div className="p-6 font-inter text-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Tambah Cabang Perusahaan</h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> */}
                <CircleX size={24} />
              </svg>
            </button>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Nama Cabang */}
            <div>
              <label className="block text-base font-bold font-outfit mb-2">
                Nama Cabang   
              {<span className="text-red-500">*</span>}
              </label> 
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama Cabang Disini"
                className={`w-full p-2 border ${errors.nama ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-300 outline-none`}
              />
              {errors.nama && <p className="mt-1 text-xs text-red-500">{errors.nama}</p>}
            </div>

            {/* Logo Perusahaan */}
            <div>
              <label className="block text-base font-bold font-outfit mb-2">
                Logo Perusahaan<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => document.getElementById("logo-input").click()}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-l-xl hover:bg-gray-50"
                >
                  Choose File
                </button>
                <div className="flex-1 py-2 border border-l-0 border-gray-300 rounded-r-xl flex items-center px-3 text-gray-500 overflow-hidden">
                  {logoFileName}
                </div>
                <input
                  id="logo-input"
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, JPEG (Maks. 2MB)</p>
            </div>

            {/* Bidang Usaha */}
            <div>
              <label className="block text-base font-bold font-outfit mb-2">
                Bidang Usaha<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="bidang_usaha"
                  value={formData.bidang_usaha}
                  onChange={handleChange}
                  className={`w-full p-2 pr-10 border ${errors.bidang_usaha ? 'border-red-500' : 'border-gray-300'} rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-300 outline-none`}
                >
                  <option value="" disabled>Pilih Bidang Usaha</option>
                  <option value="Teknologi">Teknologi</option>
                  <option value="Manufaktur">Manufaktur</option>
                  <option value="Jasa">Jasa</option>
                  <option value="Perdagangan">Perdagangan</option>
                  <option value="Kesehatan">Web Developer</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.bidang_usaha && <p className="mt-1 text-xs text-red-500">{errors.bidang_usaha}</p>}
            </div>

            {/* Foto Cover */}
            <div>
              <label className="block text-base font-bold font-outfit mb-2">
                Foto Cover<span className="text-red-500">*</span>
                </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => document.getElementById("fotoCover-input").click()}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-l-xl hover:bg-gray-50"
                >
                  Choose File
                </button>
                <div className="flex-1 py-2 border border-l-0 border-gray-300 rounded-r-xl flex items-center px-3 text-gray-500 overflow-hidden">
                  {fotoCoverFileName}
                </div>
                <input
                  id="fotoCover-input"
                  type="file"
                  name="profil_cover"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              {errors.profil_cover && <p className="mt-1 text-xs text-red-500">{errors.profil_cover}</p>}
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, JPEG (Maks. 5MB)</p>
            </div>

            {/* Provinsi */}
            <div>
              <label className="blocktext-base font-bold font-outfit mb-2">
                Provinsi<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleProvinceChange}
                  className={`w-full p-2 pr-10 border ${errors.provinsi ? 'border-red-500' : 'border-gray-300'} rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-300 outline-none`}
                >
                  <option value="" disabled>Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.name}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.provinsi && <p className="mt-1 text-xs text-red-500">{errors.provinsi}</p>}
            </div>

            {/* Kota */}
            <div>
              <label className="block text-base font-bold font-outfit mb-2">
                Kota<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="kota"
                  value={formData.kota}
                  onChange={handleCityChange}
                  disabled={!formData.provinsi || cities.length === 0}
                  className={`w-full p-2 pr-10 border ${errors.kota ? 'border-red-500' : 'border-gray-300'} rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-300 outline-none ${!formData.provinsi ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <option value="">
                    {!formData.provinsi
                      ? "Pilih Provinsi Terlebih Dahulu"
                      : cities.length === 0
                      ? "Memuat data kota..."
                      : "Pilih Kota"}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.kota && <p className="mt-1 text-xs text-red-500">{errors.kota}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-3 bg-[#eb5454] text-white rounded-full hover:bg-red-700 transition duration-500 hover:duration-500"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0069ab] text-white rounded-full hover:bg-[#004a78] transition duration-500 hover:duration-500 font-medium disabled:opacity-70"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
