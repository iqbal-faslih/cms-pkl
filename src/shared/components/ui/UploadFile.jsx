import React, { useEffect, useState } from "react";
import { ImageUp } from "lucide-react";
import { Icon } from "@iconify/react";

const Wrapper = ({ children, dashed = false }) => {
  return (
    <div
      className={`border-2 ${
        dashed
          ? `border-dashed border-gray-300 py-7 hover:border-purple-600`
          : `border-gray-300 py-4`
      } rounded-lg text-center relative`}
    >
      {children}
    </div>
  );
};

const Wrapper2 = ({
  children,
  failed = false,
  icon = "tabler:trash",
  onDelete,
  iconClassName = "text-gray-500 hover:text-red-500",
  name,
  error,
  fileSize,
}) => {
  return (
    <div className="text-left px-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <Icon
            icon={"mi:document"}
            width={28}
            height={28}
            className={`text-gray-600 ${failed ? "text-red-600" : ""}`}
          />
          <p className={`font-medium ${failed ? "text-red-600" : ""}`}>
            {failed ? (error || "Upload failed") : name}
          </p>
        </div>
        <button
          onClick={onDelete}
          className={failed ? "text-red-600" : iconClassName}
        >
          <Icon icon={icon} width="28" height="28" />
        </button>
      </div>
      <p
        className={`text-sm pl-9 text-gray-500 mb-3  ${
          failed ? "text-red-600" : ""
        }`}
      >
        {failed ? name : fileSize}
      </p>
      {children}
    </div>
  );
};

const UploadFile = ({
  fileState, // { file, status: 'idle'|'uploading'|'success'|'failed'|'done', progress }
  onSelectFile,
  onRetry,
  onDelete,
  onView,
  accept = "image/*"
}) => {
  const { file, status, progress, error } = fileState || {};
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleView = () => {
    if (onView) {
      onView(file);
      return;
    }

    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  const canView = Boolean(onView || previewUrl);

  const renderContent = () => {
    if (!file) {
      return (
        <Wrapper dashed>
          <div className="flex flex-col gap-y-2">
            <ImageUp size={40} className="mx-auto mb-2 text-purple-400" />
            <h3 className="text-lg">
              <span className="text-purple-500">Click to Upload</span> or drag
              and drop
            </h3>
            <h3 className="text-lg">(Max. File size: 25 MB)</h3>

            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => onSelectFile(e.target.files?.[0])}
              accept={accept}
            />
          </div>
        </Wrapper>
      );
    }

    const fileSize = (file.size / 1024).toFixed(0) + " KB";

    return (
      <Wrapper>
        {status === "uploading" && (
          <Wrapper2 onDelete={onDelete} fileSize={fileSize} name={file.name}>
            <div className="flex items-center justify-between">
              <div className="w-[90%] bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm">{progress}%</p>
            </div>
          </Wrapper2>
        )}

        {status === "success" && (
          <Wrapper2
            fileSize={fileSize}
            name={file.name}
            icon="ep:success-filled"
            iconClassName="text-green-500"
          >
            <div className="flex items-center justify-between">
              <div className="w-[90%] bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm">{progress}%</p>
            </div>
          </Wrapper2>
        )}

        {status === "failed" && (
          <Wrapper2 error={error} failed name={file.name} onDelete={onDelete}>
            <button
              onClick={onRetry}
              className="text-red-600 pl-9 font-semibold hover:text-red-700"
            >
              Try again
            </button>
          </Wrapper2>
        )}

        {status === "done" && (
          <Wrapper2 fileSize={fileSize} name={file.name} onDelete={onDelete}>
            <button
              onClick={handleView}
              disabled={!canView}
              className={`text-purple-600 font-semibold pl-9 mt-2 ${
                canView
                  ? "hover:text-purple-700 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Click to view
            </button>
          </Wrapper2>
        )}
      </Wrapper>
    );
  };

  return <div className={`mt-3`}>{renderContent()}</div>;
};

export default UploadFile;
