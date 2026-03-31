import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Badge from "../../Badge";
import { useState, useEffect } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('https://picsum.photos/v2/list?page=1&limit=8');
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error('Gagal fetch gambar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 relative overflow-hidden">
        <div className="flex justify-center flex-col gap-4 sm:gap-6">
          <div className="mx-auto">
            <Badge>Internship Showcase</Badge>
          </div>
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl text-slate-800 font-bold leading-tight">
            Loading Gallery...
          </h1>
        </div>
        <div className="py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-70 rounded-lg bg-gray-300 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white mt-25 lg:mt-30 md:mt-35 xl:mt-40 py-30 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -right-2 -top-8 sm:-top-12 md:-top-16 lg:-top-19 opacity-50 lg:opacity-100">
        <img src="assets/icons/dot_shape_4.png" alt="" className="w-16 sm:w-20 md:w-24 lg:w-auto" />
      </div>
      
      {/* Header Section */}
      <div className="flex justify-center flex-col gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
        <div className="mx-auto">
          <Badge>Internship Showcase</Badge>
        </div>
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-800 font-bold leading-tight max-w-4xl mx-auto">
          Discover the Internship Experience
        </h1>
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-2 sm:mt-4">
          Lihat dokumentasi pengalaman magang yang telah dilakukan oleh para peserta kami
        </p>
      </div>

      {/* Gallery Swiper */}
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={16}
          loop={images.length > 1}
          slidesPerGroup={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          breakpoints={{
            // Mobile (< 640px)
            320: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            // Small tablet (640px - 768px)
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // Medium tablet (768px - 1024px)
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            // Large tablet (1024px - 1280px)
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            // Desktop (1280px+)
            1280: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="w-full max-w-7xl mx-auto"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <ImageWithSkeleton 
                src={image.download_url} 
                alt={`Gallery image ${index + 1}`} 
                author={image.author}
              />
            </SwiperSlide>
          ))}

          <div className="flex justify-center mt-5">
            <div className="custom-pagination"></div>
          </div>
        </Swiper>
      </div>

      {/* Background decorative elements */}
      <div className="hidden lg:block absolute bottom-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-60"></div>
      <div className="hidden lg:block absolute top-1/3 left-0 w-16 h-16 bg-indigo-100 rounded-full opacity-40"></div>
    </section>
  );
};

// Enhanced ImageWithSkeleton Component
const ImageWithSkeleton = ({ src, alt, author }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative group">
      {/* Main Image Container */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group-hover:scale-105">
        {/* Skeleton Loader */}
        {!loaded && !error && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg sm:rounded-xl z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center rounded-lg sm:rounded-xl z-10">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">Image not available</p>
          </div>
        )}
        
        {/* Actual Image */}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        
      </div>
    </div>
  );
};

export default Gallery;