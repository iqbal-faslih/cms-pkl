import { useRef } from "react";
import { X } from "lucide-react";
import { useModalLock } from "../../hooks";
import { useModalDetailJurnal } from "../../hooks/siswa/jurnal";

const ModalDetailJurnal = ({ onEdit }) => {
  const { isOpen, jurnalData, closeModal, handleEdit } = useModalDetailJurnal();
  const modalRef = useRef(null);

  useModalLock(modalRef, isOpen);

  if (!isOpen || !jurnalData) return null;

  const { date, title, image, description } = jurnalData;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-999 modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("modal-overlay") && closeModal()
      }
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full m-4 md:m-8 md:w-[1169px] shadow-lg"
      >
        <div className="flex justify-between items-center p-4 pb-2 md:p-6 md:pb-4">
          <div className="space-y-1">
            <h2 className="text-lg md:text-3xl font-semibold">Detail Jurnal</h2>
            <p className="text-gray-500 text-sm">{date}</p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={25} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-1">Judul Jurnal</h3>
            <div
              className={`w-full border rounded-[10px] px-3 py-4 text-sm md:text-base border-gray-300`}
            >
              {title}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-8">
            <div className="col-span-2">
              <h3 className="text-sm font-medium mb-1">
                Bukti<span className="text-red-500">*</span>
              </h3>
              <img
                src={image}
                alt={`Bukti jurnal ${title}`}
                className="w-full h-40 md:h-58 object-cover rounded-[10px] shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/800x400/E5E7EB/4B5563?text=Gambar+Tidak+Tersedia";
                }}
              />
            </div>

            <div className="col-span-4">
              <h3 className="text-sm font-medium mb-1">
                Deskripsi Kegiatan
              </h3>
              <div
                className={`w-full border-gray-300 border rounded-[10px] px-3 py-2 h-24 md:h-58 max-h-58 text-sm md:text-base overflow-y-auto`}
              >
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 md:p-6 ">
          <button
            type="button"
            className="px-4 py-2 md:px-6 md:py-2 rounded-full bg-yellow-500 text-white text-sm md:text-base font-medium hover:bg-yellow-600 shadow-md transition-colors"
            onClick={() => handleEdit(onEdit)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetailJurnal;
