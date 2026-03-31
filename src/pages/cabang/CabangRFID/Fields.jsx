export const getRfidFields = (pesertaOptions = [], loading = false) => [
  {
    name: "peserta_id",
    label: "Nama Peserta",
    placeholder: "Pilih siswa",
    type: "select",
    options: pesertaOptions,
    required: true,
    disabled: loading,
  },
];
