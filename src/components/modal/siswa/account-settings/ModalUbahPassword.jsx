import { useRef } from "react";
import { X } from "lucide-react";
import { useModalLock } from "../../../../hooks";
import PasswordPeserta from "../../../cards/PasswordPeserta";

const ModalUbahPassword = ({ showModal, handleCloseModal }) => {
  const modalRef = useRef(null);

  useModalLock(modalRef, showModal);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <div
        ref={modalRef}
        className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
              Ubah Kata Sandi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pastikan kata sandi baru sulit ditebak dan tidak sama dengan sebelumnya.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            aria-label="Tutup modal ubah kata sandi"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6 md:p-7">
          <PasswordPeserta isModal onClose={handleCloseModal} showIntro={false} />
        </div>
      </div>
    </div>
  );
};

export default ModalUbahPassword;
