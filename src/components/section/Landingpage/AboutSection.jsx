import { useRef } from "react";
import Badge from "../../Badge";
import PrimaryButton from "../../button/PrimaryButton";

const AboutSection = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };
  const data = [
    {
      title: "Misi Kami",
      text: "Menyediakan solusi digital untuk mengelola magang dengan lebih efektif, membantu perusahaan dan peserta mendapatkan pengalaman terbaik.",
      icon: "assets/icons/About/1.png",
    },
    {
      title: "Visi Kami",
      text: "Menjadi platform unggulan dalam manajemen magang yang fleksibel dan mudah digunakan oleh berbagai jenis perusahaan.",
      icon: "assets/icons/About/2.png",
    },
    {
      title: "Tujuan Kami",
      text: "Meningkatkan efisiensi program magang dengan sistem yang terstruktur, transparan, dan otomatis.",
      icon: "assets/icons/About/3.png",
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 lg:py-32 xl:py-44 overflow-hidden px-10 sm:px-12 md:px-14 lg:px-16 xl:px-18 xl:mt-0 mt-25">
      {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-16 xl:gap-40 justify-center items-center xl:items-start relative">
          {/* Image Section */}
            <div className="relative w-72 sm:w-80 lg:w-96">
              <img
                src="assets/img/about_v1.png"
                alt="Hero"
                className="w-full rounded-xl shadow-xl"
              />
              <img
                src="assets/img/about_v2.png"
                alt="Hero 2"
                className="absolute -right-6 sm:-right-8 lg:-right-35 top-16 sm:top-20 lg:top-25 w-32 sm:w-40 lg:w-62 rounded-xl shadow-md bg-white p-1.5"
              />
            </div>

          {/* Text Content */}
          <div className="text-center xl:text-left max-w-xl">
            <Badge>Lebih Lanjut Tentang Kami</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 leading-snug">
              Sistem Manajemen Magang <br className="hidden sm:block" /> 
              Terintegrasi untuk Perusahaan Anda
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed text-sm sm:text-base mx-auto lg:mx-0">
              Kelola seluruh proses magang dalam satu platform, mulai dari
              pendaftaran, pemantauan, hingga evaluasi. Proses rekrutmen lebih
              efisien, tugas peserta lebih terorganisir, dan evaluasi menjadi
              lebih mudah dengan sistem otomatis.
            </p>
            <div className="flex items-center mt-6">
              <PrimaryButton 
                to={"/tentang"}
              icon="bi-arrow-right">
                Pelajari lebih lanjut
              </PrimaryButton>
            </div>
          </div>

        <div className="xl:flex items-center gap-5 hidden absolute z-50 -bottom-10 left-1/2 -translate-x-1/2">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg w-[350px] h-56 px-5 flex-col flex justify-center items-center gap-5 shadow border border-blue-300/50"
            >
              <div className="flex gap-4 justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <h1 className="uppercase text-lg text-gray-900 font-semibold">
                  {item.title}
                </h1>
              </div>
              <p className="text-gray-500 text-sm text-center">{item.text}</p>
            </div>
          ))}
        </div>
        </div>

      {/* Feature Cards - Desktop (lg+) */}
      

      {/* Feature Cards - Carousel for Mobile & Tablet (below lg) */}
      <div className="xl:hidden mt-12 sm:mt-16 md:mt-20">
        <div className="px-4 sm:px-6 md:px-8">
          {/* Section Header with Navigation */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              Mengapa Memilih Kami?
            </h3>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg min-w-[280px] sm:min-w-[320px] md:min-w-[360px] p-5 sm:p-6 flex flex-col justify-center items-center gap-4 sm:gap-5 shadow-lg border border-blue-300/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-200 flex items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    />
                  </div>
                  <h1 className="uppercase text-base sm:text-lg text-gray-900 font-semibold text-center">
                    {item.title}
                  </h1>
                </div>
                <p className="text-gray-500 text-sm sm:text-base text-center leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

         
        </div>
      </div>

      {/* Background decorative elements - only visible on larger screens */}
      <div className="hidden lg:block absolute top-1/4 right-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 -z-10"></div>
      <div className="hidden lg:block absolute bottom-1/4 left-0 w-24 h-24 bg-indigo-50 rounded-full opacity-50 -z-10"></div>
    </section>
  );
};

export default AboutSection;