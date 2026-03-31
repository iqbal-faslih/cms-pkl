import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelectRole } from "../../hooks";

const SelectAuth = () => {

   const { selected, loading, handleSelect, handleNext } = useSelectRole();


  const cardData = [
    {
      title: "Daftar sebagai Perusahaan",
      description:
        "Akses dashboard untuk kelola siswa magang, pantau progress dan komunikasi langsung.",
      illustration: "/assets/icons/Company-rafiki.svg",
      type: "perusahaan",
    },
    {
      title: "Daftar sebagai Siswa Magang",
      description:
        "Dapatkan pengalaman magang, kelola tugas dan interaksi dengan pembimbing perusahaan.",
      illustration: "/assets/icons/students-amico.svg",
      type: "peserta",
    },
  ];

  return (
    <div className="max-h-screen flex flex-col justify-between bg-white relative px-6 pt-10 pb-8">
      <div className="text-center mt-10 mb-10">
        <h1 className="text-4xl font-bold text-sky-800">Pilih Jenis Akun</h1>
      </div>

      <div className="flex justify-center items-center gap-8 flex-wrap">
        {cardData.map((card) => (
          <motion.div
            key={card.type}
            onClick={() => handleSelect(card.type)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-[320px] p-6 rounded-2xl shadow-md cursor-pointer border-2 ${
              selected === card.type
                ? "border-sky-700 bg-blue-50 border-dotted"
                : "border-gray-200 bg-white"
            }`}
          >
            <img src={card.illustration} alt={card.title} className="w-42 h-42 mx-auto mb-4" />
            <h2 className="text-sm font-semibold text-center text-sky-800 mb-2">
              {card.title}
            </h2>
            <p className="text-sm font-light text-gray-600 text-center">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center items-center mt-12 px-6">
        <button
          onClick={handleNext}
          disabled={!selected || loading}
          className={`text-lg font-medium rounded-full px-10 py-2 ${
            !selected ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {loading ? "Loading..." : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default SelectAuth;
