import { useRegistrasiPeserta } from "../../hooks/siswa/registrasi/useRegistrasiPeserta";
import { dataDiriFieldConfig } from "../../schema/siswa/data-diri/validationSchema";
import FormField from "../../components/form/siswa/FormField";
import PrimaryButton from "../../components/button/PrimaryButton";
import { toast } from "react-toastify";

const fieldMap = dataDiriFieldConfig.reduce((acc, field) => {
  acc[field.name] = field;
  return acc;
}, {});

const leftColumnFieldRows = [
  ["nama"],
  ["alamat"],
  ["jenis_kelamin", "telepon"],
  ["tempat_lahir", "tanggal_lahir"],
  ["sekolah", "nomor_identitas"],
  ["jurusan"],
];

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function UploadDropzone({
  label,
  accept,
  note,
  onChange,
  hasError = false,
  error = "",
  previewUrl = "",
  fileName = "",
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">{label}</label>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview Foto"
            className="hidden sm:block h-16 w-16 rounded-full border border-slate-200 object-cover"
          />
        ) : null}

        <div
          className={`relative min-h-[130px] w-full rounded-2xl border border-dashed ${
            hasError ? "border-red-300 bg-red-50/30" : "border-blue-300 bg-blue-50/50"
          } flex flex-col items-center justify-center px-4 text-center`}
        >
          <div className="mb-2 text-blue-500">
            <UploadIcon />
          </div>
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-blue-600">{note}</p>
          {fileName ? (
            <p className="mt-2 text-xs font-medium text-green-600">File: {fileName}</p>
          ) : null}

          <input
            type="file"
            accept={accept}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={onChange}
          />
        </div>
      </div>
      {hasError ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function StudentRegistrationForm() {
  const {
    isSubmitting,
    errors,
    previewUrl,
    cvFileName,
    handleSubmit,
    register,
    handlePhotoUpload,
    handleCvUpload,
    getFieldError,
    hasFieldError,
  } = useRegistrasiPeserta({
    onSuccess: () => {
      toast.success("Berhasil mengisi data diri");
    },
  });

  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePhotoUpload(file);
  };

  const onCvChange = (e) => {
    const file = e.target.files[0];
    if (file) handleCvUpload(file);
  };

  return (
    <div className="w-full rounded-2xl bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-800">Data Diri</h1>
        <p className="text-sm text-slate-500">Silahkan Lengkapi Data diri anda</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full space-y-5 px-5 py-5 sm:px-6 lg:w-1/2">
            {leftColumnFieldRows.map((row) => {
              const isSingle = row.length === 1;
              return (
                <div
                  key={row.join("-")}
                  className={isSingle ? "grid grid-cols-1" : "grid grid-cols-1 gap-4 md:grid-cols-2"}
                >
                  {row.map((fieldName) => (
                    <FormField
                      key={fieldName}
                      field={fieldMap[fieldName]}
                      register={register}
                      error={errors[fieldName]?.message}
                      className={fieldName === "alamat" ? "md:col-span-1" : ""}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block w-px self-stretch bg-slate-200" />

          <div className="w-full px-5 py-5 sm:px-6 lg:w-1/2">
            <div className="space-y-8">
              <UploadDropzone
                label="Masukkan Foto Diri Disini"
                accept="image/jpeg,image/jpg,image/png"
                note="JPEG, JPG, PNG (max 5MB)"
                previewUrl={previewUrl}
                hasError={hasFieldError("profile")}
                error={getFieldError("profile")}
                onChange={onPhotoChange}
              />

              <UploadDropzone
                label="Masukkan CV Disini"
                accept="application/pdf"
                note="PDF (max 10MB)"
                fileName={cvFileName}
                hasError={hasFieldError("cv")}
                error={getFieldError("cv")}
                onChange={onCvChange}
              />

              <div className="flex justify-end pt-2">
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  rounded="rounded-xl"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                      <span>Menyimpan...</span>
                    </span>
                  ) : (
                    <span>Simpan</span>
                  )}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
