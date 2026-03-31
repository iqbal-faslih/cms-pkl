import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const TambahCabangSchema = z
  .object({
    nama: z.string().min(1, "Nama cabang wajib diisi!"),

    logo: z.custom(val => val instanceof File, {
      message: "Logo perusahaan wajib di isi!"
    }),

    profil_cover: z.custom(val => val instanceof File, {
      message: "Foto cover wajib di isi!"
    }),

    bidang_usaha: z.string().min(1, "Bidang usaha wajib di isi!"),
    provinsi: z.string().min(1, "Provinsi wajib di isi!"),
    kota: z.string().min(1, "Kota wajib di isi!"),

    email: z.string().email("Format email tidak valid!"),

    password: z
      .string()
      .min(1, "Password wajib di isi!")
      .min(
        MIN_PASSWORD_LENGTH,
        `Password minimal ${MIN_PASSWORD_LENGTH} karakter!`
      ),
    password_confirmation: z.string().min(
      1,
      "Konfirmasi password wajib di isi!"
    ),

    telepon: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(/^\d+$/, "Nomor HP hanya boleh berisi angka")
    .min(10, "Nomor HP minimal 10 digit")
    .max(13, "Nomor HP maksimal 13 digit"),
    
    alamat: z.string().min(1, "Alamat wajib di isi!")
  })
  .refine(
    data => data.password === data.password_confirmation,
    {
      path: ["password_confirmation"], 
      message: "Konfirmasi password tidak cocok!"
    }
  );
