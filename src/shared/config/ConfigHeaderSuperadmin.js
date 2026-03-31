export const HeaderConfigSuperAdmin = {
  company: {
    name: "PT. HUMMA TEKNOLOGI INDONESIA",
    location: "Jawa Timur, Indonesia",
    logo: "/assets/img/logoperusahaan.png",
    veritify: "/assets/img/verify.png",
  },
  greeting: {
    prexix: "Hello",
    suffix: "Welcome to",
  },
  navigation: [
      {
        id: "detail-perusahaan",
        label: "Dashboard",
        path: "detail-perusahaan",
      },
      {
        id: "daftar-cabang",
        label: "Cabang",
        path: "daftar-cabang",
      },
    ],
};

export const HeaderSuperAdminStyle = {
  container: "max-w-full mx-auto bg-white rounded-2xl overflow-x-hidden shadow-md",

  header: {
    wrapper:
      "flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 space-y-2 w-full overflow-x-hideen",
    contet:
      "flex flex-col sm:flex-row items-start sm:items-center space-x-4 w-full lg:w-auto",
  },

  logo: {
    container: "flex-shrink-0",
    image: "w-32 sm:w-36 lg:w-40 h-auto",
  },

  text: {
    wrapper: "flex lg:flex-col md:flex-row space-y-1",
    greeting: "text-lg sm:text-xl font-bold",
    compay: "text-sm md:text-lg lg:text-2xl font-bold",
    location: "flex items-center text-gray-600 space-x-2 mt-2",
    logo: "inline-block ml-1.5",
  },

  button: {
    wrapper: "self-end lg:self-start mr-3 flex items-center gap-3 mt-7",

    labelActive: "text-gray-400 font-medium",
    labelInactive: "text-gray-400 font-medium",

    active:
    "relative w-16 h-8 bg-[#16A34A] rounded-full cursor-pointer transition-all active:scale-95 shadow-[inset_6px_0px_8px_rgba(0,0,0,0.2)]",

    inactive:
      "relative w-16 h-8 bg-gray-300 rounded-full cursor-pointer transition-all active:scale-95 shadow-[inset_6px_0px_8px_rgba(0,0,0,0.2)]",

    circleActive:
      "absolute top-[0.250rem] left-[2.2rem] w-[1.5rem] h-[1.5rem] bg-white rounded-full transition-all shadow-[0_2px_15px_rgba(0,0,0,0.2)]",

    circleInactive:
      "absolute top-[0.25rem] left-1 w-[1.5rem] h-[1.5rem] bg-white rounded-full transition-all shadow-[0_2px_15px_rgba(0,0,0,0.2)]",

      },

  navigation: {
    wrapper: "flex flex-wrap gap-2 sm:gap-4 lg:gap-10 sm:px-6",
    active:
      "bg-[#3E80F8] px-4 sm:px-5 py-2 sm:py-2 rounded-t-2xl text-white font-medium transition-colors",
    inactive:
      "px-4 sm:px-5 py-3 sm:py-4 rounded-md rounded-md hover:bg-gray-100 transition-colors font-medium",
  },
};
