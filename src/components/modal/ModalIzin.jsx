import React, { useRef, useEffect } from "react";
import useModalIzinStore from "../../stores/useModalIzinStore";
import useIzinSubmission from "../../hooks/useIzinSubmission";

const ModalIzin = () => {
  const tanggalRef = useRef(null);
  const deskripsiRef = useRef(null);

  const { isOpen, closeModal } = useModalIzinStore();
  const { file, loading, handleFileChange, submitIzin } = useIzinSubmission();

  useEffect(() => {
  if (!isOpen) return null;
    if (!isOpen) {
      if (tanggalRef.current) tanggalRef.current.value = "";
      if (deskripsiRef.current) deskripsiRef.current.value = "";
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitIzin({
      tanggal: tanggalRef.current?.value,
      deskripsi: deskripsiRef.current?.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-2xl w-full relative">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">Buat Izin</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none transition-transform duration-200 transform hover:scale-110"
          >
            &times;
          </button>
        </div>

        <form
          id="izinForm"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Tanggal <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                ref={tanggalRef}
                required
                className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#306BFF] focus:border-[#306BFF] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                ref={deskripsiRef}
                rows="5"
                required
                placeholder="Masukkan deskripsi..."
                className="block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#306BFF] focus:border-[#306BFF] transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block mb-2 font-medium">
              Masukkan Bukti Surat <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#306BFF] transition-colors duration-200 flex-1">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="uploadFile"
                accept=".png,.jpg,.jpeg"
              />
              <label
                htmlFor="uploadFile"
                className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
              >
                <img 
                  src="/assets/icons/upload.png" 
                  alt="Upload Icon" 
                  className="h-12 w-12 object-contain mb-2 text-gray-400"
                />
                <span className="text-gray-500">
                  {file ? file.name : "Masukkan Surat"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG (max 5 MB)
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            form="izinForm"
            disabled={loading}
            className={`px-8 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              loading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-[#306BFF] text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalIzin;
