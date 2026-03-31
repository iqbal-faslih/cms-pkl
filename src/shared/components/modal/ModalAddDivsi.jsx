//ModalAddDvisi ga dipake kata mas putra, pake page divisi langsung
import WrapperAddDivisi from "../wrapper/WrapperAddDivisi";
import useDivisionFrom from "../../../hooks/useAddDivisi";
import MultiSelect from "../input/MultiselectField";
import { useState } from "react";
import UploadFile from "../ui/UploadFile";
import { useFileUpload } from "../../hooks/useFileUpload";

export default function ModalAddDivisi({
  show,
  setShow,
  editingDivision,
  onSuccess,
}) {
  const f = useDivisionFrom(editingDivision, (d) => {
    onSuccess(d);
    setShow(false);
  });

  const handleClose = () => {
    f.reset();
    upload.deleteFile();
    setShow(false);
  };

  // Multiselect
  const [kategoriDipilih, setKategoriDipilih] = useState([]);
  const kategori = [
    { id: 1, name: "Tahap Pengenalan" },
    { id: 2, name: "Tahap Dasar" },
    { id: 3, name: "Tahap Pre Mini Project" },
    { id: 4, name: "Tahap Mini Project" },
    { id: 5, name: "Tahap Big Project" },
    { id: 6, name: "Tahap Real Project" },

  ];

  const upload = useFileUpload({
    //validasi file
    validate: (file) => {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        return "Format file harus PNG atau JPG";
      }
      if (file.size > 2 * 1024 * 1024) {
        return "Ukuran maksimal 2MB";
      }
      return null;
    },
  });

  const fileState = upload.fileState;

  // Integrasi final ke form utama
  const handleSubmit = () => {
    if (fileState.status !== "success" && fileState.status !== "done") {
      f.setErrors({ ...f.errors, file: "File belum berhasil diupload" });
      return;
    }

    f.setData({
      ...f.data,
      categories: kategoriDipilih.map((k) => ({ id: k.id, name: k.name })),
      file: fileState.file, // file final
    });

    f.submit(fileState.file);
  };

  return (
    <WrapperAddDivisi
      show={show}
      onClose={handleClose}
      title={editingDivision ? "Edit Data Divisi" : "Tambah Data Divisi"}
      footer={[
        <div key="footer-button-group" className="flex justify-end space-x-2.5">
          <button
            key="cancel"
            className="px-6 py-2 bg-white border border-gray-700   text-gray-500 w-full rounded-2xl"
            onClick={handleClose}
          >
            Batal
          </button>

          <button
            key="save"
            onClick={handleSubmit}
            disabled={f.loading}
            onCancel={handleClose}
            className="px-6 py-2 bg-blue-500 text-white w-full rounded-2xl"
          >
            {f.loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>,
      ]}
    >
      {/* Input Nama Divisi */}
      <label className="text-md font-semibold text-gray-800">Nama Divisi</label>
      <input
        type="text"
        value={f.data.name}
        onChange={(e) => f.setData({ ...f.data, name: e.target.value })}
        className={`w-full px-4 py-3 rounded-lg border mt-2 ${
          f.errors.name ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Masukan Nama Divisi"
      />
      {f.errors.name && (
        <p className="text-red-500 text-sm mt-1">{f.errors.name}</p>
      )}

      {/* MultiSelect */}
      <div className="mt-4 flex-col gap-2">
        <MultiSelect
          label="Kategori Project"
          placeholder="1 Selected"
          selectedItems={kategoriDipilih}
          onSelectionChange={setKategoriDipilih}
          options={kategori}
          error={f.errors.categories}
        />
      </div>

      {/* Upload File (Baru) */}
      <div className="mt-4">
        <label className="text-md font-semibold text-gray-800">Foto Cover</label>

        <UploadFile
          fileState={fileState}
          onSelectFile={upload.selectFile}
          onRetry={upload.retry}
          onDelete={upload.deleteFile}
        />

        {f.errors.file && (
          <p className="text-red-500 text-sm mt-1">{f.errors.file}</p>
        )}
      </div>
    </WrapperAddDivisi>
  );
}
