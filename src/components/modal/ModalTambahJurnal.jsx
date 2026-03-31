import { useRef } from "react";
import { X, Images } from "lucide-react";
import { useModalLock } from "../../hooks";
import { useModalTambahJurnal } from "../../hooks/siswa/jurnal";
import { getTodayInfo } from "../../utils/dateUtils";
import PrimaryButton from "../button/PrimaryButton";

const ModalTambahJurnal = ({ onSubmitSuccess }) => {
  const {
    isOpen,
    closeModal,
    formData,
    setFormData,
    previewUrl,
    isSubmitting,
    errors,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDrop,
    handleSubmit,
  } = useModalTambahJurnal(onSubmitSuccess);

  const { formatted: today } = getTodayInfo();

  const modalRef = useRef(null);

  useModalLock(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-999 modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("modal-overlay") && closeModal()
      }
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full m-4 md:m-8 md:w-[1169px] shadow-lg"
      >
        <div className="flex justify-between items-center p-4 pb-2 md:p-6 md:pb-4">
          <div className="space-y-1">
            <h2 className="text-lg md:text-3xl font-semibold">Buat Jurnal</h2>
            <p className="text-gray-500 text-sm">{today}</p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Judul Jurnal<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={`w-full border rounded-[10px] px-3 py-4 text-sm md:text-base focus:outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              placeholder="Masukkan Judul Disini"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-6 gap-x-8">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1">
                Unggah Bukti<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files[0])}
                accept="image/png,image/jpeg"
                className="hidden"
              />
              {previewUrl ? (
                <div className="mb-2 relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-40 md:h-58 object-cover rounded-[10px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileChange(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  className={`border border-gray-200 rounded-[10px] flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer hover:bg-blue-100 transition-colors md:h-58 ${
                    errors.bukti ? "border-red-500" : ""
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Images size={28} className="text-gray-700" />
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-sm text-gray-700">Drag or</span>
                    <span className="text-blue-500 text-sm">Browse</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    PNG, JPEG (max 5MB)
                  </p>
                </div>
              )}
              {errors.bukti && (
                <p className="text-red-500 text-sm mt-1">{errors.bukti}</p>
              )}
            </div>

            <div className="col-span-4">
              <label className="text-sm font-medium mb-1">
                Deskripsi Kegiatan<span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full border rounded-[10px] px-3 py-2 h-24 md:h-50 max-h-50 text-sm md:text-base overflow-y-auto focus:outline-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500`}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Masukkan deskripsi kegiatan..."
              />
              <div className="flex justify-between items-center gap-1 text-xs mt-1">
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Minimal Karakter</span>
                  <span
                    className={
                      formData.description.replace(/\s+/g, "").length < 150
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {formData.description.replace(/\s+/g, "").length}/150
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <PrimaryButton
              type="submit"
              rounded="rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTambahJurnal;
