export const dashboardDatas = {
  cabang: [
    { id: 1, nama: "Cabang Jakarta", total_peserta: 40 },
    { id: 2, nama: "Cabang Bandung", total_peserta: 25 },
    { id: 3, nama: "Cabang Surabaya", total_peserta: 35 },
  ],
  statsData: [
    {
      title: "Total Cabang",
      value: `20 Cabang`,
      icon: "/assets/icons/absensi/certificateLogo.png",
      color: "#10B981",
      background: "rgba(209, 250, 229, 1)",
      chartColor: "#34D399",
      data: [20, 110, 98, 340, 270, 420, 388, 477, 389, 500],
    },
    {
      title: "Total Peserta Magang",
      value: `120 Peserta`,
      icon: "/assets/icons/absensi/mens.png",
      color: "#F97316",
      background: "rgba(254, 243, 199, 1)",
      chartColor: "#FF3200",
      data: [100, 222, 199, 350, 291, 480, 420, 499, 423, 500],
    },
    {
      title: "Pengisian Jurnal",
      value: `100 Peserta`,
      icon: "/assets/icons/absensi/Container.png",
      color: "#8B5CF6",
      background: "rgba(237, 233, 254, 1)",
      chartColor: "#A78BFA",
      data: [20, 110, 98, 340, 270, 420, 388, 477, 389, 500],
    },
  ],
};
