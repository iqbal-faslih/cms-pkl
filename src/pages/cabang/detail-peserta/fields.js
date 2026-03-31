export const divisionFields = [
  {
    name: "division",
    label: "Divisi Baru",
    type: "select",
    placeholder: "Pilih divisi baru",
    options: [
      { value: "ui_ux", label: "UI/UX Designer" },
      { value: "frontend", label: "Frontend Developer" },
      { value: "backend", label: "Backend Developer" },
      { value: "mobile", label: "Mobile Developer" },
      { value: "qa", label: "Quality Assurance" },
    ],
    required: true,
  },
  {
    name: "mentor",
    label: "Mentor Baru",
    type: "select",
    placeholder: "Pilih mentor baru",
    options: [
      { value: "mentor1", label: "John Doe" },
      { value: "mentor2", label: "Jane Smith" },
      { value: "mentor3", label: "Bob Johnson" },
    ],
    required: true,
  },
  {
    name: "description",
    label: "Alasan Perubahan",
    type: "textarea",
    placeholder: "Jelaskan alasan perubahan divisi...",
    required: true,
  },
];

export const journalDetailFields = [
  {
    name: "tgl",
    label: "Tanggal",
    type: "date",
    disabled: true,
  },
  {
    name: "bukti",
    label: "Bukti",
    type: "file",
    disabled: true,
  },
  {
    name: "judul",
    label: "Judul",
    type: "text",
    disabled: true,
  },
  {
    name: "desc",
    label: "Deskripsi",
    type: "textarea",
    disabled: true,
  },
];
