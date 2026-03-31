import { z } from "zod";

export const ProfileSchema = z.object({

  nama: z.string().min(1, "Nama Wajib Diisi"),
  email: z.string().min(1, "Email Wajib Diisi"),
  nohp: z.string().min(1, "Nomer HP Wajib Diisi"),

  password: z.string().min(1, "Password Wajib Diisi"),

 divisi: z.string().min(1,"Divisi Wajib Diisi"),
});