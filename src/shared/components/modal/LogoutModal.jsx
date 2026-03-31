import { Icon } from "@iconify/react";
import Button from "@/shared/components/button/Button";

const LogoutModal = ({
  show = false,
  onClose = () => {},
  onConfirm = () => {},
  title = "Anda Yakin?",
  message,
  image = "/assets/img/roket.png",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  width = "500px",
  loading = false,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-[9999]">
      <div
        className={`bg-white rounded-2xl shadow-lg max-w-[90vw]`}
        style={{ width }}
      >
        <div className="mx-auto pt-8 pb-4 flex items-center justify-center">
          <img
            src={image}
            width={150}
            height={150}
          />
        </div>

        <div className="px-6 pb-6">
          <h5 className="text-center font-semibold text-[28px] leading-snug">
            {title}
          </h5>

          {message && (
            <p className="text-center font-medium mb-6 text-[18px] leading-snug">
              {message}
            </p>
          )}

          <div className="flex gap-4 justify-center items-center mt-4">
            <Button
              onClick={onConfirm}
              className={`min-w-[100px] bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-2 px-5 text-white rounded-xl transition duration-300 ease-in-out ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
            <Button
              onClick={onClose}
              className={`min-w-[100px] bg-white border border-red-600 hover:bg-red-600 hover:text-white py-2 px-5 text-red-600 rounded-xl transition duration-300 ease-in-out ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={loading}
            >
              {cancelText}
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
