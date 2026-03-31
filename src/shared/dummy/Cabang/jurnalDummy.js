const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const jurnalDummyData = Array.from({ length: 258 }, (_, i) => ({
  id: i + 1,
  number: `100${i + 1}`,
  name: `Reivan Elsyafit Pratama ${i + 1}`,
  school: `SMK ${(i % 5) + 1} Muhammadiyah Rogojampi`,
  date: new Date(2025, 8, (i % 30) + 1).toLocaleDateString('id-ID'),
  time: generateRandomTime(),
  description: i % 7 === 0 ? 'Title Deskripsi' : '-',
  status: i % 5 === 0 ? 'Mengisi' : 'Kosong',
  activity:
    i % 5 === 0
      ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eu risus convallis, viverra nunc ut, feugiat libero. Integer rhoncus mauris mi, quis viverra sem pulvinar vel. Aenean finibus ac turpis non elementum.'
      : '',
}));

// Export juga fungsi generateRandomTime jika diperlukan di tempat lain
export { generateRandomTime };