export const formatDataForModal = (data) => {
  if (!data) return null;
  const isFilled = data.status === "Mengisi";
  return {
    nama: data.name,
    sekolah: data.school,
    tanggal: data.date,
    jam: data.time,
    judulGambar: isFilled ? data.judulGambar : "Jurnal Kosong",
    suratUrl: isFilled ? data.suratUrl : "/assets/img/HumanResearch.png",
    deskripsi: isFilled
      ? data.deskripsi || "Tidak ada deskripsi."
      : "Tidak Mengisi Jurnal",
  };
};
