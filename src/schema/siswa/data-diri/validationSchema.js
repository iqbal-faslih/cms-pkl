import { z } from "zod";


// Helper functions untuk validasi custom
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
const nisnRegex = /^[0-9]{8,20}$/;

// Schema untuk data diri siswa
export const dataDiriSiswaSchema = z.object({
  nama: z
    .string()
    .min(1, "Nama lengkap harus diisi")
    .min(2, "Nama harus minimal 2 karakter")
    .max(100, "Nama tidak boleh lebih dari 100 karakter")
    .regex(
      /^[a-zA-Z\s'.,-]+$/,
      "Nama hanya boleh berisi huruf, spasi, dan tanda baca"
    ),

  jenis_kelamin: z
    .string()
    .min(1, "Jenis kelamin harus dipilih")
    .refine((val) => ["L", "P"].includes(val), {
      message: "Jenis kelamin tidak valid",
    }),

  tempat_lahir: z
    .string()
    .min(1, "Tempat lahir harus diisi")
    .min(2, "Tempat lahir harus minimal 2 karakter")
    .max(50, "Tempat lahir tidak boleh lebih dari 50 karakter")
    .regex(
      /^[a-zA-Z\s'.,-]+$/,
      "Tempat lahir hanya boleh berisi huruf, spasi, dan tanda baca"
    ),

  tanggal_lahir: z
    .string()
    .min(1, "Tanggal lahir harus diisi")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Format tanggal tidak valid")
    .refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 15;
      }
      return age >= 15;
    }, "Umur minimal 15 tahun")
    .refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 <= 60;
      }
      return age <= 60;
    }, "Umur maksimal 60 tahun"),

  alamat: z
    .string()
    .min(1, "Alamat harus diisi")
    .min(10, "Alamat harus minimal 10 karakter")
    .max(255, "Alamat tidak boleh lebih dari 255 karakter"),

  telepon: z
    .string()
    .min(1, "No HP harus diisi")
    .regex(phoneRegex, "Format nomor HP tidak valid (contoh: 081234567890)")
    .min(10, "Nomor HP minimal 10 digit")
    .max(12, "Nomor HP maksimal 12 digit"),

  nomor_identitas: z
    .string()
    .min(1, "NISN/NIM harus diisi")
    .regex(nisnRegex, "NISN/NIM harus berupa angka 8-20 digit")
    .min(8, "NISN/NIM minimal 8 digit")
    .max(20, "NISN/NIM maksimal 20 digit"),

  sekolah: z
    .string()
    .min(1, "Sekolah / Universitas harus diisi")
    .min(2, "Sekolah / Universitas minimal 2 karakter")
    .max(100, "Sekolah / Universitas maksimal 100 karakter"),

  jurusan: z
    .string()
    .min(1, "Jurusan harus diisi")
    .min(3, "Jurusan minimal 3 karakter")
    .max(100, "Jurusan maksimal 100 karakter"),
});


// Schema untuk upload foto profil
export const uploadPhotoSchema = z.object({
  photo: z
    .any()
    .refine((file) => file instanceof File, "File harus dipilih")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(
          file?.type
        ),
      "Format file harus JPG, JPEG, atau PNG"
    ),
});

// Schema untuk upload dokumen
export const uploadDocumentSchema = z.object({
  document: z
    .any()
    .refine((file) => file instanceof File, "File harus dipilih")
    .refine(
      (file) => file?.size <= 10 * 1024 * 1024,
      "Ukuran file maksimal 10MB"
    )
    .refine(
      (file) =>
        ["application/pdf"].includes(
          file?.type
        ),
      "Format file harus PDF"
    ),
});

// Schema untuk data pemberkasan (readonly, hanya untuk validasi display)
export const pemberkanSchema = z.object({
  perusahaan: z.string().optional(),
  cabang: z.string().optional(),
  mulai_magang: z.string().optional(),
  selesai_magang: z.string().optional(),
  divisi: z.string().optional(),
});

// Utility function untuk format error messages
export const formatZodError = (error) => {
  const formatted = {};
  error.errors?.forEach((err) => {
    const path = err.path[0];
    if (path && !formatted[path]) {
      formatted[path] = err.message;
    }
  });
  return formatted;
};

// Utility function untuk clean data sebelum submit
export const cleanFormData = (data) => {
  const cleaned = {};
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "string") {
      cleaned[key] = data[key].trim();
    } else {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

// Default values untuk form
export const defaultDataDiriValues = {
  nama: "",
  jenis_kelamin: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
  telepon: "",
  nomor_identitas: "",
  sekolah: "",
  jurusan: "",
};

// Field configurations untuk form
export const dataDiriFieldConfig = [
  {
    name: "nama",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukkan nama lengkap",
    required: true,
    autoComplete: "name",
  },
  {
    name: "jenis_kelamin",
    label: "Jenis Kelamin",
    type: "select",
    placeholder: "Pilih jenis kelamin",
    required: true,
    options: [
      { value: "", label: "Pilih jenis kelamin" },
      { value: "L", label: "Laki-laki" },
      { value: "P", label: "Perempuan" },
    ],
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    placeholder: "Masukkan tempat lahir",
    required: true,
    autoComplete: "address-level2",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
    required: true,
    max: new Date().toISOString().split("T")[0], // Today's date as max
  },
  {
    name: "alamat",
    label: "Alamat",
    type: "textarea",
    placeholder: "Masukkan alamat lengkap",
    required: true,
    rows: 3,
    autoComplete: "street-address",
  },
  {
    name: "telepon",
    label: "No HP",
    type: "tel",
    placeholder: "No. hp",
    required: true,
    autoComplete: "tel",
  },
  {
    name: "nomor_identitas",
    label: "NISN/NIM",
    type: "text",
    placeholder: "NISN/NIM",
    required: true,
    maxLength: 20,
  },
  {
    name: "sekolah",
    label: "Sekolah / Universitas",
    type: "text",
    placeholder: "Sekolah/Universitas",
    required: true,
    autoComplete: "organization",
    maxLength: 100,
  },
  {
    name: "jurusan",
    label: "Jurusan",
    type: "text",
    placeholder: "Masukkan jurusan",
    required: true,
    maxLength: 100,
  },
];





