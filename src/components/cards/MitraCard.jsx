import { Trash2, Edit, Eye } from "lucide-react";

const MitraCard = ({ university, baseUrl, onDelete, onEdit, onView }) => {
  const coverImage = university.foto?.find((f) => f.type === "foto_header");
  const logoImage = university.foto?.find((f) => f.type === "logo");

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        <img
          src={
            coverImage
              ? `${baseUrl}/${coverImage.path}`
              : "/assets/img/Cover.png"
          }
          alt="Cover"
          className="w-full h-32 object-cover"
        />
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
          <img
            src={
              logoImage
                ? `${baseUrl}/${logoImage.path}`
                : "/assets/img/logoperusahaan.png"
            }
            alt="Logo"
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
      </div>
      <div className="pt-8 px-3 text-center flex-grow">
        <h3 className="font-bold text-base mb-2">{university.nama}</h3>
        <p className="text-gray-500 text-sm mb-2">{university.alamat}</p>
        <p className="text-xs text-gray-700 mb-4 line-clamp-3">
          Tempat para pemimpin masa depan tumbuh, belajar, dan berkontribusi
          untuk dunia
        </p>
      </div>
      <div className="mt-auto flex border-t border-gray-200">
        <button
          className="flex-1 py-2 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-50 transition duration-200"
          onClick={() => onDelete(university)}
        >
          <Trash2 size={14} className="mr-1" /> Hapus
        </button>
        <div className="w-px bg-gray-200" />
        <button
          className="flex-1 py-2 flex items-center justify-center text-blue-500 text-sm hover:bg-gray-50 transition duration-200"
          onClick={() => onView(university)}
        >
          <Eye size={14} className="mr-1" /> Lihat
        </button>
        <div className="w-px bg-gray-200" />
        <button
          className="flex-1 py-2 flex items-center justify-center text-yellow-500 text-xs hover:bg-gray-50 transition duration-200"
          onClick={() => onEdit(university)}
        >
          <Edit size={14} className="mr-1" /> Edit
        </button>
      </div>
    </div>
  );
};

export default MitraCard;