import { useRef } from "react";
import { X } from "lucide-react";
import PrimaryButton from "../../../button/PrimaryButton";
import { dataDiriFieldConfig } from "../../../../schema/siswa/data-diri/validationSchema";
import { useModalLock } from "../../../../hooks";
import FormField from "../../../form/siswa/FormField";

const ModalEditDataDiri = ({
  showModal,
  handleCloseModal,
  handleSubmit,
  register,
  isSubmitting,
  errors = {},
  isValid,
  hasChanges,
}) => {
  const modalRef = useRef(null);
  useModalLock(modalRef, showModal);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4  border-b border-[#A2A2A2]">
          <h2 className="text-2xl font-semibold text-gray-900">
            Edit Data Diri
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isSubmitting}
            title="Tutup"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto mb-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataDiriFieldConfig.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  register={register}
                  error={errors[field.name]?.message}
                />
              ))}
            </div>

            {/* Form Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">
                    Terdapat {Object.keys(errors).length} kesalahan pada form
                  </span>
                </div>
                <p className="text-red-700 text-sm">
                  Mohon perbaiki kesalahan di atas sebelum menyimpan data.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {hasChanges && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span>Ada perubahan yang belum disimpan</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={isSubmitting || !isValid || !hasChanges}
              className="px-6 py-2 min-w-[140px]"
              rounded="rounded-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </div>
              ) : (
                "Simpan"
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditDataDiri;
