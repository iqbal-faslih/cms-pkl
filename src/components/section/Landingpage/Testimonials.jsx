import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Testimonials = () => {
  const testimonials = [
    {
      text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate aliquam ex odio omnis eaque dignissimos...",
      author: "John Doe",
      job: "Software Engineer",
      location: "San Francisco, USA",
      image: "/assets/icons/testimonials/girl1.png",
    },
    {
      text: "A wonderful experience! Highly recommended.",
      author: "Jane Smith",
      job: "Product Designer",
      location: "Berlin, Germany",
      image: "/assets/icons/testimonials/girl2.png",
    },
    {
      text: "Fantastic service and great quality!",
      author: "Emily Brown",
      job: "Marketing Manager",
      location: "London, UK",
      image: "/assets/icons/testimonials/man1.png",
    },
  ];

  return (
    <section className="w-full bg-white pt-10 pb-20 px-4 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden">
      {/* Background Decorative Images */}
      <div className="absolute right-0 -top-40 hidden md:block">
        <img
          src="/assets/icons/testimonials/gradient_purple.png"
          alt="gradient_purple"
        />
      </div>
      <div className="absolute right-0 top-60 hidden md:block">
        <img src="/assets/icons/testimonials/thunder.png" alt="thunder" />
      </div>
      <div className="absolute left-0 top-60 hidden md:block">
        <img src="/assets/icons/testimonials/gradient_pink.png" alt="pink" />
      </div>
      <div className="absolute left-0 top-[460px] hidden md:block">
        <img
          src="/assets/icons/testimonials/annoucement.png"
          alt="annoucement"
          className="w-36"
        />
      </div>

      {/* Section Title */}
      <div className="flex justify-center">
        <div className="py-2 px-5 text-center rounded-full bg-indigo-50">
          <span className="bg-gradient-to-r from-indigo-500 to-green-500 bg-clip-text text-transparent">
            Testimoni
          </span>
        </div>
      </div>
      <h1 className="text-xl sm:text-2xl lg:text-5xl text-center font-bold mt-6">
        Apa yang dikatakan pelanggan kami
      </h1>

      {/* Testimonial Card */}
      <div className="w-full text-white rounded-3xl border border-slate-300/[0.5] shadow mt-14 py-8 px-4 sm:py-10 sm:px-6 md:px-12 relative bg-transparent">
        {/* Floating Avatars */}
        <img
          src="/assets/icons/testimonials/girl1.png"
          alt="girl1"
          className="absolute top-5 left-3 md:left-12 w-12 md:w-16 rounded-full hidden sm:block"
        />
        <img
          src="/assets/icons/testimonials/girl2.png"
          alt="girl2"
          className="absolute top-5 right-3 md:right-12 w-10 md:w-12 rounded-full hidden sm:block"
        />
        <img
          src="/assets/icons/testimonials/man2.png"
          alt="man2"
          className="absolute bottom-5 left-3 md:left-12 w-10 md:w-12 rounded-full hidden sm:block"
        />
        <img
          src="/assets/icons/testimonials/man1.png"
          alt="man1"
          className="absolute bottom-5 right-3 md:right-12 w-12 md:w-16 rounded-full hidden sm:block"
        />

        {/* Quote Icon */}
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img
              src="/assets/icons/testimonials/Paraf.png"
              alt="Quote"
              className="w-8 md:w-10"
            />
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".custom-pagination" }}
          className="w-full max-w-4xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="px-2">
              <p className="text-center text-base sm:text-lg italic text-gray-500 mb-5 font-normal">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-500"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm font-light text-gray-400">
                    {testimonial.job}, {testimonial.location}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="flex justify-center mt-5">
            <div className="custom-pagination"></div>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
