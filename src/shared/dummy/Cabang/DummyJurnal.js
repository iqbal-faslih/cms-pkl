 const dummyData = Array.from({ length: 258 }, (_, i) => ({
    id: i + 1,
    number: `100${i + 1}`,
    name: `Reivan Elsyafit Pratama ${i + 1}`,
    judul: `Membuat nasgor goreng enak`,
    bukti: `/assets/img/Hero.png`,
    school: `SMK ${(i % 5) + 1} Muhammadiyah Rogojampi`,
    date: new Date(2025, 8, (i % 30) + 1).toLocaleDateString("id-ID"),
    description: i % 7 === 0 ? "Title Deskripsi" : "-",
    status: i % 5 === 0 ? "Mengisi" : "Kosong",
  }));