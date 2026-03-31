import { useRef } from "react";
import { useModalLock } from "../../../../hooks";
import { CheckCircle2, ImagePlus, UploadCloud, X } from "lucide-react";

const ModalUpdateProfile = ({
  showUploadModal,
  handleCloseModal,
  handleSaveImages,
  tempProfilePreview,
  profileFileName,
  profileImage,
  profileInputRef,
  handleImageSelect,
  handleDrop,
  handleDragOver,
  resetTempImage,
  isUploading,
  isDisabled,
  hasChanges,
}) => {
  const modalRef = useRef(null);

  useModalLock(modalRef, showUploadModal);

  if (!showUploadModal) return null;

  const handleFileChange = (e) => {
    handleImageSelect(e, "profile");
  };

  const handleDropEvent = (e) => {
    handleDrop(e, "profile");
  };

  const hasSelectedImage = Boolean(
    tempProfilePreview && tempProfilePreview !== profileImage
  );

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] flex justify-center items-center z-[999] p-4">
      <div
        ref={modalRef}
        className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
              Edit Foto Profil
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Unggah foto baru agar profil terlihat lebih profesional.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center"
            aria-label="Tutup modal"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-5 md:p-6 transition-colors duration-200 cursor-pointer ${
              hasSelectedImage
                ? "border-blue-300 bg-blue-50/50"
                : "border-slate-300 bg-slate-50 hover:border-blue-300"
            }`}
            onClick={() => profileInputRef.current?.click()}
            onDrop={handleDropEvent}
            onDragOver={handleDragOver}
            role="button"
            tabIndex={0}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative shrink-0">
                <div className="h-40 w-40 md:h-48 md:w-48 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
                  {(tempProfilePreview || profileImage) && (
                    <img
                      src={tempProfilePreview || profileImage}
                      alt="Preview Profile"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                {hasSelectedImage && (
                  <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white shadow">
                    <CheckCircle2 size={12} />
                    Baru
                  </span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200">
                  <UploadCloud className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mt-3 text-sm md:text-base font-medium text-slate-800">
                  Klik area ini atau drag & drop untuk ganti foto profil
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Format: JPG/JPEG/PNG, ukuran maksimal 5MB
                </p>
                {profileFileName && (
                  <p className="mt-3 text-xs text-slate-600 rounded-lg bg-white border border-slate-200 px-3 py-2 truncate inline-flex max-w-full">
                    {profileFileName}
                  </p>
                )}
              </div>
            </div>

            {!tempProfilePreview && !profileImage && (
              <div className="mt-5 flex flex-col items-center justify-center text-slate-500">
                <ImagePlus className="h-8 w-8" />
                <p className="text-xs mt-1">Belum ada foto</p>
              </div>
            )}

            <input
              type="file"
              ref={profileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />
          </div>

          {hasSelectedImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetTempImage("profile");
              }}
              className="mt-4 text-sm text-slate-600 hover:text-slate-800 underline underline-offset-2"
            >
              Batalkan foto yang dipilih
            </button>
          )}

          {hasChanges && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-700">
                <CheckCircle2 size={14} className="inline mr-2" />
                Foto siap diupload
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveImages}
            disabled={isDisabled}
            className={`px-5 py-2.5 rounded-lg min-w-[140px] font-medium text-white transition-colors ${
              isDisabled
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </button>
        </div>

        <p className="px-6 pb-5 text-xs text-slate-500">
          Tip: gunakan foto square dengan wajah/logo jelas untuk hasil terbaik.
        </p>
      </div>
    </div>
  );
};

export default ModalUpdateProfile;
