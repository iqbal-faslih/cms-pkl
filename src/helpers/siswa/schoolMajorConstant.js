// Constants untuk dropdown sekolah dan jurusan
export const SEKOLAH_OPTIONS = [
  { value: "", label: "Pilih sekolah/universitas" },
  { value: "SMK WIJAYA PUTRA", label: "SMK WIJAYA PUTRA" },
  { value: "SMKN 1 MALANG", label: "SMKN 1 MALANG" },
  { value: "UNESA", label: "UNESA" },
  { value: "SMKN 2 MALANG", label: "SMKN 2 MALANG" },
  { value: "SMKN 8 MALANG", label: "SMKN 8 MALANG" },
  { value: "SMKN 1 DLANGGU", label: "SMKN 1  DLANGGU" },
];

export const JURUSAN_OPTIONS = [
  { value: "", label: "Pilih jurusan" },
  { value: "TKJ", label: "TKJ (Teknik Komputer dan Jaringan)" },
  { value: "RPL", label: "RPL (Rekayasa Perangkat Lunak)" },
  { value: "DKV", label: "DKV (Desain Komunikasi Visual)" },
  { value: "SIJA", label: "SIJA (Sistem Informasi Jaringan dan Aplikasi)" },
];

// Valid values untuk validasi
export const VALID_SEKOLAH = SEKOLAH_OPTIONS.filter(opt => opt.value !== "").map(opt => opt.value);
export const VALID_JURUSAN = JURUSAN_OPTIONS.filter(opt => opt.value !== "").map(opt => opt.value);

// Utility function untuk mendapatkan label berdasarkan value
export const getSekolahLabel = (value) => {
  const option = SEKOLAH_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

export const getJurusanLabel = (value) => {
  const option = JURUSAN_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Utility function untuk validasi
export const isValidSekolah = (value) => VALID_SEKOLAH.includes(value);
export const isValidJurusan = (value) => VALID_JURUSAN.includes(value);