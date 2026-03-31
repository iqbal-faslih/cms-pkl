import { useRef, useState } from "react";
import { FaPlay } from "react-icons/fa";
import StatCard from "../../StateCard";

const Counter = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { number: 5000, label: "Projects Done" },
    { number: 4000, label: "Happy Clients" },
    { number: 6000, label: "Team Members" },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="w-full relative bg-white pt-5 pb-40 lg:pb-64">
      {/* Header Section */}
      <div className="bg-[#0069AB] w-full min-h-[500px] px-6 sm:px-10 md:px-16 lg:px-24 pt-10 lg:pt-20">
        <div className="flex flex-col gap-5">
          {/* Badge */}
          <div className="rounded-full px-4 py-2 text-white text-center bg-sky-800 w-fit">
            <h1 className="font-medium text-sm">COUNTER</h1>
          </div>

          {/* Title & Stats */}
          <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-6">
            {/* Title */}
            <div className="font-semibold text-xl sm:text-3xl lg:text-4xl xl:text-5xl lg:w-1/2 text-white text-center lg:text-left">
              Make your marketing more effective
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
              {stats.map((item, i) =>
                // Versi kecil (mobile/tablet)
                <div
                  key={i}
                  className="lg:hidden py-4 px-2 text-center"
                >
                  <h2 className="text-white font-bold text-lg sm:text-xl">{item.number.toLocaleString()}</h2>
                  <p className="text-white mt-1 text-xs sm:text-sm">{item.label}</p>
                </div>
              )}
              {/* Versi besar (desktop) pakai StatCard */}
              {stats.map((item, i) => (
                <div key={`lg-${i}`} className="hidden lg:block">
                  <StatCard number={item.number} label={item.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="absolute z-10 left-0 right-0 md:top-70 top-80 px-4 sm:px-8 md:px-12 lg:px-24">
        <div className="rounded-xl overflow-hidden max-h-[450px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onClick={togglePlay}
          >
            <source src="/video/example.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       backdrop-blur-md bg-white/30 border border-white p-6 rounded-full 
                       shadow-lg flex items-center justify-center"
            >
              <FaPlay className="text-white text-3xl" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Counter;
