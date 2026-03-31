import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import InputField from "@/shared/components/input/InputField";
import SelectField from "@/shared/components/input/SelectField";
import TextareaField from "@/shared/components/input/TextAreaField";
import FileField from "@/shared/components/input/FileField";
import CalendarField from "@/shared/components/input/CalendarField";
import Button from "@/shared/components/button/Button";
import PostEditor from "../../../components/PostEditor";
import { companyRegistrationSchema } from "./RegistrasiSchema";
import { registrasiInitialValue } from "./registrasiConsts";
import { useCompanySubmit } from "@/pages/perusahaan/Registrasi/useCompanySubmit";
import Card from "../../../components/cards/Card";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import { useIndonesiaRegions } from "../../../shared/hooks/requests/useRegions";
import { AuthContext } from "../../../contexts/AuthContext";
import { useCompanyRegistrationForm } from "./hooks/useCompanyRegistrationForm";

const IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png";

export default function PerusahaanForm() {
  const navigate = useNavigate();
  const { submitCompanyData, loading } = useCompanySubmit();
  const { user } = useContext(AuthContext);

  const {
    provinces,
    cities,
    districts,
    selectedProvince,
    selectedCity,
    handleProvinceChange,
    handleCityChange,
  } = useIndonesiaRegions();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm({
    resolver: zodResolver(companyRegistrationSchema),
    defaultValues: registrasiInitialValue,
  });

  const {
    alamat,
    deskripsi,
    handleImageFileChange,
    onSubmit,
    setSubmitError,
    submitError,
  } = useCompanyRegistrationForm({
    userEmail: user?.email,
    submitCompanyData,
    setValue,
    clearErrors,
    setError,
    watch,
  });

  const provinceOptions = provinces.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  const cityOptions = cities.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const districtOptions = districts.map((d) => ({
    value: d.name,
    label: d.name,
  }));

  return (
  <>
    {submitError && (
      <ErrorOverlay
        open={Boolean(submitError)}
        message={submitError}
        onRetry={() => setSubmitError(null)}
        onClose={() => setSubmitError(null)}
      />
    )}
    <Card className="mx-auto w-full max-w-[1280px] rounded-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Data Umum Perusahaan
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Silahkan Lengkapi Data Terlebih Dahulu!
          </p>
        </div>
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Section: Data Umum Perusahaan */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Data Umum Perusahaan
          </h2>

          {/* Grid: 4 kolom */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4 mb-6">
            <Controller
              name="nama_penanggung_jawab"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Nama Penanggung Jawab"
                  name="nama_penanggung_jawab"
                  type="text"
                  placeholder="Masukkan Nama"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.nama_penanggung_jawab?.message}
                  required
                />
              )}
            />

            <Controller
              name="nomor_penanggung_jawab"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Nomor HP Penanggung Jawab"
                  name="nomor_penanggung_jawab"
                  type="text"
                  placeholder="Masukkan Nomor HP"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.nomor_penanggung_jawab?.message}
                  required
                />
              )}
            />
            <Controller
              name="jabatan_penanggung_jawab"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Jabatan Penanggung Jawab"
                  name="jabatan_penanggung_jawab"
                    type="text"
                  placeholder="Masukkan Jabatan"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.jabatan_penanggung_jawab?.message}
                  required
                />
              )}
            />
            <Controller
              name="email_penanggung_jawab"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Email Penanggung Jawab"
                  name="email_penanggung_jawab"
                  type="email"
                  placeholder="Masukkan Email"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.email_penanggung_jawab?.message}
                  required
                />
              )}
            />
          </div>

          {/* Grid: 3 kolom */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3 mb-6">
            <Controller
              name="nama"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Nama Perusahaan"
                  name="nama"
                  type="text"
                  placeholder="Masukkan Nama Perusahaan"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.nama?.message}
                  required
                />
              )}
            />

            <Controller
              name="tanggal_berdiri"
              control={control}
              render={({ field }) => (
                <CalendarField
                  label="Tanggal Berdiri"
                  name="tanggal_berdiri"
                  type="date"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.tanggal_berdiri?.message}
                  required
                />
              )}
            />

            <div className="sm:col-span-2 xl:col-span-1">
            <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <FileField
                    label="Bukti Logo Perusahaan"
                    required
                    name="logo"
                    value={field.value}
                    onChange={(file) =>
                      handleImageFileChange("logo", field.onChange, file)
                    }
                    error={errors.logo?.message}
                    placeholder="Tidak ada file yang dipilih"
                    showIcon={true}
                    accept={IMAGE_ACCEPT}
            />
                )}
              />
            </div>
          </div>

          {/* Deskripsi */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Perusahaan
          </label>
          <Controller
            name="deskripsi"
            control={control}
            render={({ field }) => (
              <PostEditor
                content={field.value}
                onContentChange={(val) => field.onChange(val)}
              />
            )}
          />
            {errors.deskripsi && (
              <p className="text-red-500 text-xs mt-1">
                {errors.deskripsi.message}
              </p>
            )}
            <div className="text-right text-xs text-gray-500 mt-1">
              {deskripsi?.length || 0}/150
            </div>
        </div>

        {/* Section: Kontak Perusahaan */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Kontak Perusahaan
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            <Controller
              name="provinsi"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Provinsi"
                  name="provinsi"
                  options={provinceOptions}
                  placeholder="Pilih Provinsi"
                  value={selectedProvince}
                  onChange={(val) => {
                    handleProvinceChange(val);
                    field.onChange(val);
                    setValue("kota", "");
                    setValue("kecamatan", "");
                  }}
                  error={errors.provinsi?.message}
                  required
                />
              )}
            />

            <Controller
              name="kota"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Kabupaten/Kota"
                  name="kota"
                  options={cityOptions}
                  placeholder="Pilih Kabupaten/Kota"
                  value={selectedCity}
                  onChange={(val) => {
                    handleCityChange(val);
                    field.onChange(val);
                    setValue("kecamatan", "");
                  }}
                  error={errors.kota?.message}
                  disabled={!selectedProvince}
                  required
                />
              )}
            />

            <Controller
              name="kecamatan"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Kecamatan"
                  name="kecamatan"
                  options={districtOptions}
                  placeholder="Pilih Kecamatan"
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.kecamatan?.message}
                  disabled={!selectedCity}
                  required
                />
              )}
            />

            <Controller
              name="kode_pos"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Kode Pos"
                  name="kode_pos"
                  type="text"
                  placeholder="Masukkan Kode Pos"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.kode_pos?.message}
                  required
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3 mt-6">
            <Controller
              name="telepon"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Nomor Telepon Perusahaan"
                  name="telepon"
                  type="text"
                  placeholder="Masukkan Nomor Telepon"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.telepon?.message}
                  required
                />
              )}
            />

            <Controller
              name="email_perusahaan"
              control={control}
              render={({ field }) => (
                <div>
                  <InputField
                    label="Email Perusahaan"
                    name="email_perusahaan"
                    type="email"
                    placeholder="Email akun registrasi"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={errors.email_perusahaan?.message}
                    readonly
                    required
                  />
                  <p className="text-xs text-gray-500 -mt-2">
                    Email login akun Anda ditampilkan otomatis dan sementara tidak dapat diubah.
                  </p>
                </div>
              )}
            />

            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Website Perusahaan"
                  name="website"
                  type="text"
                  placeholder="website perusahaan"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.website?.message}
                  required
                />
              )}
            />
          </div>

          {/* Alamat Perusahaan */}
          <Controller
            name="alamat"
            control={control}
            render={({ field }) => (
              <div>
                <TextareaField
                  label="Alamat Perusahaan"
                  name="alamat"
                  placeholder="Masukkan Alamat"
                  rows={4}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={errors.alamat?.message}
                  required
                />
                <div className="text-right text-xs text-gray-500 -mt-3">
                  {alamat?.length || 0}/350
                </div>
              </div>
            )}
          />
        </div>

        {/* Section: Dokumen Pendukung */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Dokumen Pendukung(opsional)
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            <div>
              <Controller
                name="legalitas_perusahaan"
                control={control}
                render={({ field }) => (
                  <FileField
                    label="Bukti Legalitas Perusahaan"
                    name="legalitas_perusahaan"
                    value={field.value}
                    onChange={(file) =>
                      handleImageFileChange(
                        "legalitas_perusahaan",
                        field.onChange,
                        file
                      )
                    }
                    error={errors.legalitas_perusahaan?.message}
                    placeholder="Tidak ada file yang dipilih"
                    showIcon={true}
                    accept={IMAGE_ACCEPT}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="npwp_perusahaan"
                control={control}
                render={({ field }) => (
                  <FileField
                    label="Bukti NPWP Perusahaan"
                    name="npwp_perusahaan"
                    value={field.value}
                    onChange={(file) =>
                      handleImageFileChange(
                        "npwp_perusahaan",
                        field.onChange,
                        file
                      )
                    }
                    error={errors.npwp_perusahaan?.message}
                    placeholder="Tidak ada file yang dipilih"
                    showIcon={true}
                    accept={IMAGE_ACCEPT}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="profil_background"
                control={control}
                render={({ field }) => (
                  <FileField
                    label="Profil Background"
                    name="profil_background"
                    value={field.value}
                    onChange={(file) =>
                      handleImageFileChange(
                        "profil_background",
                        field.onChange,
                        file
                      )
                    }
                    error={errors.profil_background?.message}
                    placeholder="Tidak ada file yang dipilih"
                    showIcon={true}
                    accept={IMAGE_ACCEPT}
                  />
                )}
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-300 pt-6 sm:flex-row sm:justify-end sm:gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full rounded-full bg-gray-100 px-8 py-2.5 font-medium text-gray-700 hover:bg-gray-200 sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Menyimpan..."
              disabled={loading}
              className="w-full rounded-full bg-[#0066CC] px-8 py-2.5 font-medium text-white hover:bg-[#0052A3] sm:w-auto"
            >
              Simpan
          </Button>
          </div>
        </div>
      </form>
    </Card>
  </>
  );
}
