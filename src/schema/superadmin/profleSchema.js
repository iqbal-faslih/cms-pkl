import { z } from "zod";

export const profileAccountSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Email tidak valid"),
  password: z.string().min(1, "Kata Sandi wajib diisi"),
  username: z.string().min(1, "Username wajib diisi"),
});
