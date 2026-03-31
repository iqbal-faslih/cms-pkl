export const ConfifHeaderInfo = {
  header: {
    company: "CV. NAMA CABANG",
    description:
      "Perusahaan ini bergerak di bidang Informasi dan Teknologi untuk perkembangan Industri",
    location: "Malang, Jawa Timur",
  },
  logo: {
    src: "/assets/img/logoperusahaan.png",
    alt: "Logo Perusahaan",
    sampul: "/assets/img/sampul.png",
  },
};

export const HeaderInfoStyle = {
  container: "max-w-full mx-auto bg-white rounded-2xl",
  sampul: "w-full h-48 sm:h-64 md:h-80 lg:96 object-cover rounded-t-2xl",
  lokasi: "flex flex-row items-center space-x-2 flex-wrap",
  content: {
    wraepper:
      "flex flex-row sm:fle-col items-start sm:item-center py-4 gap-1 sm:px-6",
    content: "flex flex-col px-1 gap-1 sm:gap-2",
  },

  ctx: {
    judul: "text-xl sm:text-2xl lg:text-3xl font-bold",
    description:
      "text-sm sm:text-base lg:text-lg font-light text-gray-600 leading-related",
  },
};
