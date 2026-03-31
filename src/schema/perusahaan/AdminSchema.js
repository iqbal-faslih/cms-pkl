import { z } from "zod";

export const AdminSchema = z.object({
  nama: z.string().min(1, "Nama Admin wajib diisi"),

  fotoAdmin: z.custom(val => val instanceof File, {
    message: "Foto Admin wajib diisi",
    }),

  noHp: z.string().min(1, "Nomor HP wajib diisi"),

  fotoCover: z.custom(val => val instanceof File, {
    message: "Foto Cover wajib diisi",
    }),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .nonempty("Password wajib diisi"),

  devisi: z.string().min(1, "Devisi wajib diisi"),

  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
});
