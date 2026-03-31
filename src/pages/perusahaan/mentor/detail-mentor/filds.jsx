export const divisionFields = [
  {
    type: "select",
    label: "Divisi",
    name: "division",
    required: true,
    options: [
      { label: "UI/UX", value: "uiux" },
      { label: "Frontend", value: "frontend" },
      { label: "Backend", value: "backend" },
    ],
  },
  {
    type: "select",
    label: "Mentor",
    name: "mentor",
    required: true,
    options: [
      { label: "Wiratama", value: "wiratama" },
      { label: "Dimas", value: "dimas" },
      { label: "Rani", value: "rani" },
    ],
  },
  {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder:
      "You were moved to a new division by your mentor to better match your skills and support the team’s needs.",
    required: true,
    rows: 4,
  },
];
export const tambahSiswaFields = [
  {
    type: "select",
    label: "Siswa",
    name: "siswa",
    required: true,
    options: [
      { label: "Wiratama", value: "wiratama" },
      { label: "Dimas", value: "dimas" },
      { label: "Rani", value: "rani" },
    ],
  },
  {
    type: "multiselect",
    label: "Pilih Siswa",
    previewLabel: "Siswa Pilihan",
    name: "siswapilihan",
    placeholder:
      "Pilih siswa pilihan",
    options: [
      { id: "1", name: "Reivan Elsyafir Pratama" },
      { id: "2", name: "Reivan Elsyafir Pratama" },
      { id: "3", name: "Reivan Elsyafir Pratama" },
      { id: "4", name: "Reivan Elsyafir Pratama" },
      { id: "5", name: "Reivan Elsyafir Pratama" }, 
      { id: "6", name: "Reivan Elsyafir Pratama" },
      { id: "7", name: "Reivan Elsyafir Pratama" },
      { id: "8", name: "Reivan Elsyafir Pratama" },
    ],
    required: true,
    rows: 4,
  },
];