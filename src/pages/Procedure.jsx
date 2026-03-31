import Banner from "../components/Banner";
import { procedures, StudentSteps, CompanySteps, FloatingElements } from "../components/procedure-page";
import { useState, useEffect } from "react";

const MotionDiv = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 200);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div className={`transition-all duration-700 ease-out ${
      isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
    } ${className}`}>
      {children}
    </div>
  );
};

export default function RegistrationProcedure() {
  return (
    <>
      <Banner
        title="Prosedur"
        subtitle="Beranda → Prosedur"
        backgroundImage="/assets/img/banner/study_tim.jpg"
        possitionIlustration="right-0 top-18 w-full h-screen z-10"
        ilustration="ilustration_blue"
      />

      <div className="py-16 bg-white min-h-screen relative">
        <FloatingElements />

        <div className="absolute top-10 right-10 text-4xl animate-bounce z-10">🔔</div>

        <section className="max-w-7xl mx-auto px-4 mb-24 relative z-10">
          <MotionDiv delay={0} className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-b from-[#0069AB] to-[#C635FF] bg-clip-text text-transparent">
              Prosedur Pendaftaran Perusahaan
            </h2>
          </MotionDiv>
          <div className="py-16">
            <CompanySteps procedures={procedures} MotionDiv={MotionDiv} />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 relative z-10">
          <MotionDiv delay={0} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Prosedur Pendaftaran Magang
            </h2>
          </MotionDiv>
          <div className="py-12">
            <StudentSteps procedures={procedures} MotionDiv={MotionDiv} />
          </div>
        </section>
      </div>
    </>
  );
}
