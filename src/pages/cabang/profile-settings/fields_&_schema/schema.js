import { z } from "zod";

export const profileAdminSchema = z
  .object({
    nama: z.string().min(1, "Nama wajib diisi"),
    email: z.email("Email tidak valid").min(1, "Email wajib diisi"),
    telepon: z.string().min(8, "Nomor HP minimal 8 digit"),
    deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
    old_password: z.string().optional().or(z.literal("")),
    new_password: z.string().optional().or(z.literal("")),
    confirm_password: z.string().optional().or(z.literal("")),
    avatar: z.any().optional(),
  })
  .refine(
    (data) => {
      // Jika new_password diisi, old_password harus diisi
      if (data.new_password && data.new_password !== "" && (!data.old_password || data.old_password === "")) {
        return false;
      }
      return true;
    },
    {
      message: "Password lama wajib diisi saat mengubah password",
      path: ["old_password"],
    }
  )
  .refine(
    (data) => {
      // Jika new_password diisi, minimal 6 karakter
      if (data.new_password && data.new_password !== "" && data.new_password.length < 8) {
        return false;
      }
      return true;
    },
    {
      message: "Password baru minimal 8 karakter",
      path: ["new_password"],
    }
  )
  .refine(
    (data) => {
      // Jika new_password diisi, confirm harus sama
      if (data.new_password && data.new_password !== "" && data.new_password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "Password baru dan konfirmasi harus sama",
      path: ["confirm_password"],
    }
  );