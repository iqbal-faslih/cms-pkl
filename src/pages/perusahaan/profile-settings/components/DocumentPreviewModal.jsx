import { X } from "lucide-react";

export function DocumentPreviewModal({
  open,
  onClose,
  data,
  size,
  date,
  onDownload,
}) {
  if (!open || !data) return null;

  const { title, fileUrl, imageSrc } = data;
  const isPDF = fileUrl?.endsWith(".pdf");

  return (
    <div className="fixed inset-0 bg-black/50 z-9999 backdrop-blur-xs flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4">
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">{title}</h2>
            {size ? <p className="text-sm text-gray-500">Size: {size}</p> : null}
            {date ? <p className="text-sm text-gray-500">Date Added: {date}</p> : null}
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {isPDF ? (
            <iframe
              src={fileUrl}
              title="Preview PDF"
              className="w-full h-[80vh]"
            />
          ) : (
            <img
              src={fileUrl || imageSrc}
              alt={title}
              className="max-w-full mx-auto"
            />
          )}
        </div>

        <div className="p-4 flex justify-between px-7 items-center">
          {onDownload ? (
            <div className="flex items-center gap-2">
              <span className="text-sm ">Download File:</span>
              <button
                type="button"
                onClick={onDownload}
                className="bg-[#0077C0] hover:bg-blue-700 text-white text-[10px] font-medium px-3 py-1 rounded-full transition-colors"
              >
                Download
              </button>
            </div>
          ) : (
            <div />
          )}
          <button
            className="px-7 py-2 border border-gray-300 hover:border-gray-800 transition-colors duration-150 text-gray-800 bg-white rounded-full text-sm"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
