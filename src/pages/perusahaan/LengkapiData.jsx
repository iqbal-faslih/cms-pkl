import React, { useEffect, useState } from "react";

const LengkapiData = () => {
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    setShowNotif(true);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F4F8FF] flex flex-col">

      {/* ===== NOTIFIKASI ==== */}
      {showNotif && (
        <div className="w-full flex justify-center mt-6 px-4">
          <div className="w-full max-w-3xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] px-5 py-3 rounded-lg shadow">
            <p className="font-medium text-center">
              Akses tidak diizinkan. Lengkapi data diri anda!
            </p>
          </div>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <div className="flex flex-1 flex-col justify-center items-center px-4 mt-10 text-center">
        <img
          src="/assets/img/registrasi.png"
          alt="Isi Data Diri"
          className="w-[250px] sm:w-[300px] md:w-[360px] opacity-90"
        />

        <button className="mt-10 bg-[#2563eb] text-white px-8 py-3 rounded-full shadow-md hover:bg-blue-600 transition flex items-center gap-2">
          Isi Data Diri
          <span>→</span>
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center text-xs text-gray-400 py-6">
        © Copyright Ernaste 2024. All Right Reserved
      </div>
    </div>
  );
};

export default LengkapiData;
