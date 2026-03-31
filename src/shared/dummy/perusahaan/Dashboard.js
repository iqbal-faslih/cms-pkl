const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const totalPesertaMagang = (rekap) =>
  toNumber(
    rekap?.peserta?.total ??
      rekap?.total_peserta ??
      rekap?.peserta_total ??
      rekap?.jumlah_peserta ??
      rekap?.total_peserta_magang ??
      0
  );

export const getStatsData = (rekap) => [
  {
    title: "Total Cabang",
    value: `${rekap?.total_cabang}`,
    icon: "/assets/icons/absensi/book.png",
    color: "#3B82F6",
    data: [10, 15, 12, 18, 14, 20, 22, 19, 17, 25, 21, 23],
    subDetails: {
      premium: 13,
      free: 7,
    },
  },
  {
    title: "Total Peserta Magang",
    value: `${totalPesertaMagang(rekap)}`,
    icon: "/assets/icons/absensi/certificateLogo.png",
    color: "#10B981",
    data: [8, 12, 15, 20, 18, 16, 19, 17, 22, 24, 20, 21],
  },
  {
    title: "Pengisian Jurnal",
    value: `${rekap?.total_jurnal}`,
    icon: "/assets/icons/absensi/graduate.png",
    color: "#6366F1",
    data: [3, 5, 4, 6, 2, 3, 4, 2, 5, 3, 4, 5],
  },
];
