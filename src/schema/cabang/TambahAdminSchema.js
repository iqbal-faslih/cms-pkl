import { z } from "zod";
import AdminCabang from "../../pages/cabang/AdminCabang";

export const TambahAdminSchema = z.object({
  Nama: z.string().min(1, "Nama wajib diisi!"),

  Foto: z.string().min(1, "Foto Admin wajib diisi!"),
  Nomor: z.string().min(1, "Nomor HP wajib diisi!"),
  Email: z.string().min(1, "Email wajib diisi!"),

  Password: z.string().min(1, "Password wajib diisi!"),

 Description: z.string().min(1,"Description wajib diisi!"),
});