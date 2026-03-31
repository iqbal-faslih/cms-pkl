export const ProfileMentorFields = [
  {
    name: "nama",
    label: "Nama",
    type: "input",
    placeholder: "Masukkan Nama Anda",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "input",
    placeholder: "Masukan Email Anda",
    required: true,
  },

  {
    name: "nohp",
    label: "Nomor Hp",
    type: "input",
    placeholder: "Masukan Nomor Anda",
    required: true,
  },

  {
    name: "password",
    label: "Password",
    type: "input",
    placeholder: "Masukan Password",
    required: true,
  },

  {
    name: "divisi",
    label: "Divisi",
    type: "select",
    options: [
      { label: "Front End", value: "Front End" },
      { label: "Back End", value: "Back End" },
      { label: "UI/UX Designer", value: "UI/UX Designer" },
      { label: "Mobile", value: "Mobile" },
      { label: "Quality Assurance", value: "Quality Assurance" },
      { label: "Digital Marketing", value: "Digital Marketing" },
      { label: "Project Manager", value: "Project Manager" },
    ],
    required: true,
  },
];
