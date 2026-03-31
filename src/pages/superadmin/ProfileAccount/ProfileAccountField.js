const profilAccountFields = [
  {
    name: "email",
    label: "Email",
    type: "input",
    placeholder: "Masukkan email",
    required: true,
  },
  {
    name: "password",
    label: "Kata Sandi",
    type: "password",
    placeholder: "Masukkan kata sandi",
    required: true,
  },
  {
    name: "username",
    label: "Username",
    type: "input",
    placeholder: "Masukkan username",
    required: true,
  },
];

export const profilAccountLayout = [
  ["email"],
  ["password"],
  ["username"],
];

export default profilAccountFields;
