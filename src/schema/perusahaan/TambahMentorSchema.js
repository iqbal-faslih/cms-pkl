import { z } from "zod";

export const TambahMentorSchema = z.object({
  Nama: z.string().min(1, "Nama wajib diisi!"),
  Foto: z
    .any()
    .refine(
      (value) =>
        value instanceof File ||
        (typeof value === "string" && value.trim().length > 0),
      "Foto Mentor wajib diisi!"
    ),
  Nomor: z.string().min(1, "Nomor HP wajib diisi!"),
  Email: z.string().min(1, "Email wajib diisi!"),

  Password: z.string().min(1, "Password wajib diisi!"),
  Divisi: z.string().min(1, "Divisi wajib diisi!"),
});
