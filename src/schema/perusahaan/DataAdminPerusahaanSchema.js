import { z } from "zod";

export const adminSchema = z
  .object({
    nama: z.string().nonempty("Nama wajib diisi!"),
    email: z.string().email("Email tidak valid!"),
    password: z.string().optional(),
    passwordBaru: z.string().optional(),
    nomorHp: z.string().nonempty("Nomor HP wajib diisi!"),
  })
  .superRefine((data, ctx) => {
    const oldPassword = String(data?.password || "").trim();
    const newPassword = String(data?.passwordBaru || "").trim();

    if (oldPassword && !newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passwordBaru"],
        message: "Password Baru wajib diisi!",
      });
    }

    if (!oldPassword && newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password Lama wajib diisi!",
      });
    }
  });
