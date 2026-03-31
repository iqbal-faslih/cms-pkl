export default function WrapperAddDivisi({
  show,
  onClose,
  title,
  children,
  footer,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm space-x-y.5">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold sticky top-2 text-gray-600 mb-2">{title}</h2>
        </div>
        <div className="overflow-y-auto  max-h-[84vh]">

        <div className="px-6 pb-4">{children}</div>
        <div className="flex justify-end gap-3 pt-4 p-6">{footer}</div>
        </div>
      </div>
    </div>
  );
}
