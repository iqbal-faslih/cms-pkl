import { useState, useRef } from "react";
import PrimaryButton from "../../button/PrimaryButton";

const HeroSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
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

  return (
    <div
      className="relative px-14 md:py-20 lg:py-40 py-40 lg:flex lg:flex-row flex flex-col-reverse items-center justify-center gap-15 w-full bg-gradient-to-br from-blue-100 to-white"
      id="hero"
    >
      <div className="sm:text-left text-center flex flex-col sm:justify-start sm:items-start justify-center items-center max-w-5xl">
        <h1 className="md:text-4xl sm:text-xl text-lg font-extrabold text-gray-900">
          Sistem Manajemen Magang Terbaik untuk Perusahaan Anda
        </h1>
        <p className="md:text-2xl text-[16px] text-blue-600 font-bold mt-2">
          Kelola Program Magang dengan Mudah & Efektif
        </p>
        <p className="text-gray-600 mt-4 md:text-lg text-sm font-normal">
          Bantu perusahaan Anda mengelola program magang dengan sistem yang
          terintegrasi. Dari pendaftaran, pemantauan, hingga evaluasi, semuanya
          dapat dilakukan dalam satu platform.
        </p>
        <div className="mt-6">
            <PrimaryButton 
            icon="bi-rocket-takeoff" 
            textSize="text-base"
            to="/auth/register"
            rounded="rounded-2xl"
            >
              Coba Sekarang!
            </PrimaryButton>
        </div>
      </div>

        <img
          src="assets/img/Hero.png"
          alt="hero"
          className="rounded-lg w-[500px]"
        />

      {/* Desktop Cards (unchanged for lg+) */}

      <div className="hidden absolute z-50 lg:flex justify-center items-center gap-5 left-1/2 -translate-x-1/2 -bottom-15">
        <div
          className={`group min-w-[300px] xl:min-w-[400px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card1")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-1.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-xl group-hover:text-white">
              18+ Juta Siswa
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
            </p>
          </div>
        </div>

        <div
          className={`group min-w-[300px] xl:min-w-[400px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card2")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-2.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 animate-flip"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-lg">6354+ Kursus Online</h1>
            <p className="font-light text-sm">
              Pendidikan online memberikan fleksibilitas dan aksesibilitas bagi para pelajar.
            </p>
          </div>
        </div>

        <div
          className={`group min-w-[300px] xl:min-w-[400px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
          ${
            hoveredCard === "card1" || hoveredCard === "card3"
              ? "bg-white text-gray-900"
              : "hover:bg-blue-600 hover:text-white"
          }`}
          onMouseEnter={() => setHoveredCard("card3")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <img
            src="assets/icons/service-icon-2-3.svg"
            alt="icon"
            className="w-20 h-20 transition-all duration-500 group-hover:rotate-y-180"
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-lg group-hover:text-white">
              Akses Seumur Hidup
            </h1>
            <p className="font-light text-sm group-hover:text-white">
              Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
            </p>
          </div>
        </div>
      </div>


      {/* Mobile/Tablet Carousel Cards (for screens below lg) */}
      <div className="lg:hidden absolute z-50 w-full px-4 right-0 left-0 sm:-bottom-35 -bottom-20">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 -ml-2"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 -mr-2"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div
              className={`group min-w-[300px] md:min-w-[320px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
              ${
                hoveredCard === "card1" || hoveredCard === "card3"
                  ? "bg-white text-gray-900"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredCard("card1")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src="assets/icons/service-icon-2-1.svg"
                alt="icon"
                className="w-16 h-16 md:w-20 md:h-20 transition-all duration-500 group-hover:rotate-y-180 flex-shrink-0"
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="font-semibold text-base md:text-xl group-hover:text-white">
                  Lebih dari 18+ Juta Siswa
                </h1>
                <p className="font-light text-sm group-hover:text-white">
                  Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
                </p>
              </div>
            </div>

            <div
              className={`group min-w-[300px] md:min-w-[320px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
              ${
                hoveredCard === "card1" || hoveredCard === "card3"
                  ? "bg-white text-gray-900"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredCard("card2")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src="assets/icons/service-icon-2-2.svg"
                alt="icon"
                className="w-16 h-16 md:w-20 md:h-20 transition-all duration-500 animate-flip group-hover:rotate-y-180 flex-shrink-0"
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <h1 className="font-semibold text-base sm:text-xl">6354+ Kursus Online</h1>
                <p className="font-light text-sm">
                  Pendidikan online memberikan fleksibilitas dan aksesibilitas bagi para pelajar.
                </p>
              </div>
            </div>

            <div
              className={`group min-w-[300px] md:min-w-[320px] px-4 py-5 rounded-2xl flex items-center gap-6 shadow-lg transition-all duration-300 bg-white text-gray-900 hover:bg-blue-600 hover:text-white
              ${
                hoveredCard === "card1" || hoveredCard === "card3"
                  ? "bg-white text-gray-900"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredCard("card3")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <img
                src="assets/icons/service-icon-2-3.svg"
                alt="icon"
                className="w-16 h-16 md:w-20 md:h-20 transition-all duration-500 group-hover:rotate-y-180 flex-shrink-0"
              />
              <div className="flex flex-col gap-2">
                <h1 className="font-semibold text-base sm:text-xl group-hover:text-white">
                  Akses Seumur Hidup
                </h1>
                <p className="font-light text-sm group-hover:text-white">
                  Kami menyediakan program pembelajaran online yang dapat diakses oleh peserta didik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;