import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Password lama harus diisi"),
    password: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password harus mengandung huruf kecil, huruf besar, angka, dan simbol"
      ),
    password_confirmation: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak sama",
    path: ["password_confirmation"],
  });

export const defaultPasswordValues = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export const passwordRequirements = (password) => [
  { key: "length", test: password.length >= 8, label: "Minimal 8 karakter" },
  {
    key: "lowercase",
    test: /[a-z]/.test(password),
    label: "Setidaknya satu huruf kecil",
  },
  {
    key: "uppercase",
    test: /[A-Z]/.test(password),
    label: "Setidaknya satu huruf besar",
  },
  {
    key: "number",
    test: /\d/.test(password),
    label: "Setidaknya satu angka",
  },
  {
    key: "special",
    test: /[\W_]/.test(password),
    label: "Setidaknya satu karakter khusus",
  },
];
