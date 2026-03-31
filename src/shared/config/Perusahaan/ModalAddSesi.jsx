import React, { useState } from "react";
import MultiSelect from "../../../shared/components/input/MultiselectField";
import UploadFile from "../../../shared/components/ui/UploadFile";
import { useFileUpload } from "../../../shared/hooks/useFileUpload";
import InputField from "../../components/input/InputField";

export default function ModalAddSesi({ open, onClose, onSave }) {
  const [namaSesi, setNamaSesi] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [errors, setErrors] = useState({});

  const siswaOptions = [
    { id: 1, name: "Reivan Elsyafir Pratama" },
    { id: 2, name: "Reivan Elsyafir Pratama" },
    { id: 3, name: "Reivan Elsyafir Pratama" },
  ];

  const upload = useFileUpload({
    validate: (file) => {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        return "Format harus PNG atau JPG";
      }
      if (file.size > 2 * 1024 * 1024) {
        return "Maksimal 2MB";
      }
      return null;
    },
  });

  const fileState = upload.fileState;

  if (!open) return null;

  const handleSubmit = () => {
    const newErrors = {};

    // validasi nama sesi
    if (!namaSesi.trim()) {
      newErrors.namaSesi = "Nama sesi wajib diisi";
    }

    // validasi siswa wajib dipilih
    if (selectedSiswa.length === 0) {
      newErrors.siswa = "Minimal pilih 1 siswa";
    }

    // validasi upload wajib
    if (fileState.status !== "success" && fileState.status !== "done") {
      newErrors.foto = "Gambar wajib diupload";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSave({
      namaSesi,
      siswa: selectedSiswa.map((s) => s.id),
      foto: fileState.file,
    });

    setNamaSesi("");
    setSelectedSiswa([]);
    upload.deleteFile();
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="p-2 bg-white rounded-2xl shadow-2xl w-full max-w-[750px] max-h-[90vh] flex flex-col overflow-hidden animate-[fadeIn_0.2s]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Tambah Sesi
            </h2>
            <p className="text-sm text-slate-500">
              Silakan isi detail sesi yang ingin ditambahkan
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
          {/* input nama sesi */}
          <div>
            <InputField
                label="Nama Sesi"
                required={true}
                name="namaSesi"
                type="text"
                value={namaSesi}
                placeholder="Masukkan nama sesi..."
                onChange={(e) => setNamaSesi(e.target.value)}
                error={errors.namaSesi}
                maxLength={100}
            />

            {/* counter 18/100 */}
            <div className="text-right text-xs font-semibold text-gray-400 -mt-3 mb-1">
                {namaSesi.length} / 100
            </div>
            </div>

          {/* grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="force-one-column">
              <MultiSelect
                label="Pilih Siswa"
                required={true}
                selectedItems={selectedSiswa}
                onSelectionChange={setSelectedSiswa}
                options={siswaOptions}
                placeholder="Pilih Siswa"
              />

              {errors.siswa && (
                <p className="text-red-500 text-sm mt-1">{errors.siswa}</p>
              )}

              <style>
                {`
                  .force-one-column .grid {
                    grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                  }
                `}
              </style>
            </div>

            {/* upload foto */}
            <div>
              <label className="font-medium text-slate-900 flex items-center">
              Masukkan Gambar <span className="text-red-500">*</span>
            </label>

              <UploadFile
                fileState={fileState}
                onSelectFile={upload.selectFile}
                onRetry={upload.retry}
                onDelete={upload.deleteFile}
                accept="image/*"
              />

              {errors.foto && (
                <p className="text-red-500 text-sm mt-1">{errors.foto}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 bg-white">
          <button
            className="px-8 py-2 rounded-lg duration-300 hover:duration-300 border border-gray-300 text-gray-700 hover:bg-gray-300 hover:scale-105"
            onClick={onClose}
          >
            Batal
          </button>

          <button
            className="px-8 py-2 rounded-lg duration-300 hover:duration-300 bg-blue-600 text-white hover:bg-blue-800 hover:scale-105"
            onClick={handleSubmit}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
