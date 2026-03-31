import { isImageFileLike, resolveFileUrl } from "../helpers/profileDocumentHelpers";

export function DocumentCard({
  title,
  imageSrc,
  fileUrl,
  isEditing,
  onPreview,
  onEdit,
  documentName,
  documentApiKey,
  isSaving = false,
}) {
  const resolvedFileUrl = resolveFileUrl(fileUrl || imageSrc);
  const resolvedImageUrl = resolveFileUrl(imageSrc);
  const hasFile = Boolean(resolvedFileUrl);
  const isImageFile = isImageFileLike(fileUrl, imageSrc, resolvedFileUrl);
  const isProcessing = isSaving;

  const handlePreview = () => {
    if (!hasFile) return;
    onPreview({
      title,
      fileUrl: resolvedFileUrl,
      imageSrc: resolvedImageUrl,
    });
  };

  const handleDownload = () => {
    if (!hasFile) return;
    window.open(resolvedFileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-xs font-bold text-gray-800 mb-2">{title}</h3>

      <div className="flex gap-3 items-start">
        <div className="relative w-24 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
          {hasFile && isImageFile ? (
            <img
              src={resolvedImageUrl || resolvedFileUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
              No Image
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-[9px] text-white font-medium animate-pulse">
              Mengupload...
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between h-20 w-full">
          <div>
            <p className="text-[#3b82f6] font-semibold text-xs truncate mb-1">
              {title}
            </p>
          </div>

          <div className="flex gap-2 mt-auto">
            {isEditing && (
              <button
                type="button"
                className="bg-[#0077C0] hover:bg-blue-700 text-white text-[10px] font-medium px-3 py-1 rounded-full transition-colors disabled:opacity-60"
                onClick={() =>
                  onEdit({
                    docKey: documentName,
                    apiKey: documentApiKey || documentName || title,
                  })
                }
                disabled={isProcessing}
              >
                {isProcessing ? "Mengupload..." : hasFile ? "Edit" : "Upload"}
              </button>
            )}

            {hasFile && !isProcessing && (
              <>
                <button
                  type="button"
                  className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-[10px] font-medium px-3 py-1 rounded-full transition-colors"
                  onClick={handlePreview}
                >
                  Preview
                </button>
                {!isEditing && (
                  <button
                    type="button"
                    className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 text-[10px] font-medium px-3 py-1 rounded-full transition-colors"
                    onClick={handleDownload}
                  >
                    Download
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
