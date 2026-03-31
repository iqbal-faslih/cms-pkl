import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const isAllowedImageType = (file) => ALLOWED_IMAGE_TYPES.includes(file?.type);

export const companyRegistrationSchema = z.object({
  nama_penanggung_jawab: z
    .string()
    .min(1, "Nama penanggung jawab wajib diisi")
    .regex(/^[A-Za-z\s]+$/, "Nama hanya boleh berisi huruf dan spasi"),

  nomor_penanggung_jawab: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(/^\d+$/, "Nomor HP hanya boleh berisi angka")
    .min(10, "Nomor HP minimal 10 digit")
    .max(13, "Nomor HP maksimal 13 digit"),

  email_penanggung_jawab: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),

  jabatan_penanggung_jawab: z
    .string()
    .min(1, "Jabatan penanggung jawab wajib diisi"),

  nama: z
    .string()
    .min(3, "Nama perusahaan minimal 3 karakter"),

  tanggal_berdiri: z
    .string()
    .min(1, "Tanggal berdiri wajib diisi"),

  deskripsi: z
    .string()
    .max(150, "Deskripsi maksimal 150 karakter")
    .optional(),

logo: z
  .instanceof(File, { message: "Logo perusahaan wajib diisi" })
  .refine((file) => isAllowedImageType(file), {
    message: "Logo harus berupa file gambar (JPG, JPEG, PNG)",
  })
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Ukuran logo maksimal 2MB",
  }),

  telepon: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^\d+$/, "Nomor telepon hanya boleh berisi angka")
    .min(10, "Nomor telepon minimal 10 digit")
    .max(13, "Nomor telepon maksimal 13 digit"),

  email_perusahaan: z.union([
    z.literal(""),
    z.string().email("Format email tidak valid"),
  ]),

  provinsi: z.string().min(1, "Provinsi wajib dipilih"),
  kota: z.string().min(1, "Kabupaten/Kota wajib dipilih"),
  kecamatan: z.string().min(1, "Kecamatan wajib dipilih"),

  alamat: z
  .string()
  .nonempty("Alamat wajib di isi")
  .min(10, "Alamat minimal 10 karakter")
  .max(350, "Alamat maksimal 350 karakter"),

  kode_pos: z
    .string()
    .regex(/^\d{5}$/, "Kode pos harus 5 digit angka"),

  website: z
    .string()
    .min(1, "Website wajib diisi")
    .regex(
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
      "Format website tidak valid (contoh: https://example.com)"
    ),

  npwp_perusahaan: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return isAllowedImageType(file);
    }, "File harus berupa gambar (JPG, JPEG, PNG)")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    }, "Ukuran file maksimal 5MB")
    .optional(),

  legalitas_perusahaan: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return isAllowedImageType(file);
    }, "File harus berupa gambar (JPG, JPEG, PNG)")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    }, "Ukuran file maksimal 5MB")
    .optional(),

  profil_background: z
    .instanceof(File)
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return isAllowedImageType(file);
    }, "File harus berupa gambar (JPG, JPEG, PNG)")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    }, "Ukuran file maksimal 5MB")
    .optional(),
});
