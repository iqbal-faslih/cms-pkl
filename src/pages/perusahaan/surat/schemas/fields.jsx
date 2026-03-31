export const spFields = [
  {
    name: "nomor-surat",
    label: "Nomor Surat",
    required: true,
    placeholder: "Masukkan Nomor Surat",
    type: "input",
  },
  {
    name: "keterangan-sp",
    label: "Keterangan SP",
    required: true,
    type: "select",
    placeholder: "Pilih status sp",
    options: [
      { value: "SP_1", label: "SP 1" },
      { value: "SP_2", label: "SP 2" },
      { value: "SP_3", label: "SP 3" },
    ],
  },
  {
    name: "nama",
    label: "Nama",
    required: true,
    placeholder: "Masukkan Nama",
    type: "input",
  },
  {
    name: "tgl_surat",
    label: "Tanggal Surat",
    required: true,
    placeholder: "Pilih tanggal",
    type: "calendar",
  },
  {
    name: "sekolah",
    label: "Sekolah/Universitas",
    required: true,
    placeholder: "Masukkan sekolah/universitas",
    type: "input",
  },
  {
    name: "alasan_sp",
    label: "Alasan SP",
    required: true,
    placeholder: "Masukkan Nama",
    type: "textarea",
  },
];
