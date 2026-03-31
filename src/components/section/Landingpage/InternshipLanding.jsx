import PrimaryButton from "../../button/PrimaryButton";
const InternshipLanding = () => {

  return (
    <section className="w-full bg-white pt-32 pb-10 relative px-20">
      <div className="absolute left-0 -top-25">
        <img src="assets/icons/line_4.png" alt="Line_4" />
      </div>
      <div className="absolute left-0">
        <img
          src="assets/icons/line_4.png"
          alt="Line_4"
          className="z-10 opacity-80"
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
          <div className="max-w-4xl space-y-3">

            <h1 className="text-slate-800 text-3xl text-center font-bold">
            Mulai Perjalanan Magangmu Sekarang!
          </h1>
          <p className="text-slate-600 text-sm text-center">
            Ingin mendapatkan pengalaman kerja nyata? Atau mencari talenta
            terbaik untuk tim Anda? Kami menyediakan platform yang menghubungkan
            siswa dengan perusahaan untuk magang terbaik.
          </p>
          </div>
          <div className="flex flex-col xl:flex-row md:gap-10 gap-5 justify-center items-center">

            <div className="flex flex-col md:flex-row justify-center items-center gap-5">
              <div className="bg-[#F3F7FB] shadow-lg rounded-2xl px-3 py-6 flex flex-col gap-5 w-[275px] h-[350px] justify-center items-center">
              <img
                src="assets/icons/feature_1_4.png"
                alt="feature_1_4"
                className="w-12 h-12 mx-auto"
              />
              <h1 className="text-slate-900 font-semibold text-lg text-center">
                Daftarkan Perusahaan
              </h1>
              <p className="text-slate-500 text-sm text-center">
                Daftarkan perusahaan Anda untuk mengelola magang secara
                otomatis. Buka lowongan, kelola pelamar, dan temukan kandidat
                terbaik dengan mudah!
              </p>
              <PrimaryButton
              icon="bi-rocket-takeoff"
              to="/auth/register"
              iconPosition="left"
              >
                Daftar
              </PrimaryButton>
            </div>
            <div className="bg-[#F3F7FB] shadow-lg rounded-2xl px-3 py-6 flex flex-col gap-5 w-[275px] h-[350px] justify-center items-center">
              <img
                src="assets/icons/feature_1_4.png"
                alt="feature_1_4"
                className="w-12 h-12 mx-auto"
              />
              <h1 className="text-slate-900 font-semibold text-lg text-center">
                Daftar Magang Siswa
              </h1>
              <p className="text-slate-500 text-sm text-center">
                Tingkatkan pengalaman dan keterampilan dengan magang di berbagai
                perusahaan ternama. Persiapkan diri untuk dunia kerja!
              </p>
              <PrimaryButton
              icon="bi-rocket-takeoff"
              to="/auth/register"
              iconPosition="left"
              >
                Daftar
              </PrimaryButton>
            </div>
            </div>

            
          <img src="assets/img/IntershipLanding.png" alt="IntershipLanding" className="max-w-[450px]" />

        </div>

      </div>

        
    </section>
  );
};

export default InternshipLanding;
