export default function WrapperAddPiket({
  show,
  onClose,
  title = "Buat Jadwal Piket",
  children,
  footer,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl">

        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>


        <div className="px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
