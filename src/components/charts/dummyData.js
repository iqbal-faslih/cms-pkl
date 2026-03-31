// Dummy data untuk semua chart components

export const statistikPendaftarDummy = {
  1: [5, 110, 160, 210, 150, 210, 180, 160, 180, 80, 15, 5],
  2: [10, 90, 140, 190, 130, 180, 150, 130, 150, 70, 10, 2],
  3: [8, 100, 150, 200, 140, 200, 170, 150, 170, 75, 12, 3],
};

export const statistikJurnalDummy = {
  1: {
    mengisi: [65, 75, 58, 68, 45, 60, 70],
    tidak: [20, 18, 22, 38, 30, 28, 32],
  },
  2: {
    mengisi: [50, 68, 60, 72, 55, 62, 58],
    tidak: [25, 22, 20, 35, 28, 30, 26],
  },
  3: {
    mengisi: [72, 80, 78, 70, 65, 75, 82],
    tidak: [18, 15, 20, 25, 22, 20, 18],
  },
};

export const absensiPerusahaanDummy = {
  1: [
    { name: "Hadir", data: [4, 5, 3, 7, 4, 13, 5, 9, 3, 7, 4, 6] },
    { name: "Izin", data: [4, 8, 7, 16, 8, 19, 9, 15, 7, 12, 7, 10] },
    { name: "Tidak Hadir", data: [4, 4, 3, 6, 3, 12, 4, 8, 2, 7, 3, 5] },
  ],
  2: [
    { name: "Hadir", data: [3, 4, 2, 6, 3, 10, 4, 7, 2, 5, 3, 4] },
    { name: "Izin", data: [2, 5, 4, 10, 5, 15, 6, 10, 4, 8, 4, 7] },
    { name: "Tidak Hadir", data: [3, 3, 2, 5, 2, 9, 3, 6, 2, 4, 2, 4] },
  ],
  3: [
    { name: "Hadir", data: [2, 3, 2, 5, 2, 8, 3, 5, 2, 4, 2, 3] },
    { name: "Izin", data: [1, 4, 3, 8, 4, 12, 5, 8, 3, 6, 3, 5] },
    { name: "Tidak Hadir", data: [2, 2, 1, 4, 1, 7, 2, 4, 1, 3, 1, 2] },
  ],
};

export const pesertaMagangDummy = {
  1: {
    name: "Cabang A",
    aktif: [42, 53, 40, 48, 36, 41, 49, 43, 54, 39, 50, 38],
    alumni: [25, 22, 19, 39, 30, 28, 30, 26, 22, 20, 35, 29],
  },
  2: {
    name: "Cabang B",
    aktif: [30, 40, 35, 44, 32, 35, 45, 40, 48, 33, 42, 31],
    alumni: [20, 18, 17, 26, 20, 22, 21, 19, 18, 17, 24, 20],
  },
  3: {
    name: "Cabang C",
    aktif: [20, 25, 22, 30, 27, 34, 31, 29, 40, 35, 33, 28],
    alumni: [10, 12, 11, 15, 14, 18, 16, 13, 19, 17, 15, 12],
  },
};

// Common categories untuk chart
export const monthCategories = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const weekCategories = ["S", "M", "T", "W", "T", "F", "S"];