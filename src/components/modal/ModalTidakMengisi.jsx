import { X } from "lucide-react";
import { useRef } from "react";
import { useModalLock } from "../../hooks";
import useModalTidakMengisiStore from "../../stores/useModalTidakMengisiStore";
// Use public path for image assets

const ModalTidakMengisi = () => {
  const { isOpen, data, closeModal } = useModalTidakMengisiStore();
  const modalRef = useRef(null);

  useModalLock(modalRef, isOpen);

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] modal-overlay"
      onClick={(e) =>
        e.target.classList.contains("modal-overlay") && closeModal()
      }
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full m-4 md:m-8 md:w-[1169px] p-8 shadow-lg"
      >
        <div className="flex justify-between items-center mb-5">
          <div className="space-y-1">
            <h2 className="text-lg md:text-3xl font-semibold">Detail Jurnal</h2>
            <p className="text-gray-500 text-sm">{data.date}</p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={25} />
          </button>
        </div>
        <div className="px-5 py-6 bg-[#EE0202] rounded-[10px]">
          <p className="text-white text-[21px]">
            Kamu tidak mengisi jurnal
          </p>
        </div>
        <div className="size-96 aspect-square mx-auto">
            <img src="/assets/img/pusing.png" alt="Pusing" className="size-full" />
        </div>
      </div>
    </div>
  );
};

export default ModalTidakMengisi;
