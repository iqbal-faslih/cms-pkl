import React, { useRef, useState, useCallback } from "react";

const UploadFile = ({
  label,
  required = false,
  hideLabel = false,
  name,
  variant = "inline",
  value = null,
  onChange = () => {},
  accept = "*",
  inlineStyle = {},
  squareStyle = {},
  error,
  readonly = false,
}) => {
  const fileRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const fileName =
    value instanceof File ? value.name : typeof value === "string" ? value : null;

  const handleFile = (file) => {
    if (file) {
      onChange(file);
      setInputKey(prev => prev + 1); // Force re-render to allow re-selection
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  return (
    <div className="mb-4">
      {/* buat label  */}
      {label && !hideLabel && (
        <label
          htmlFor={name}
          className="block font-medium mb-1 text-black"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {/* variant inline yg lurus */}
      {variant === "inline" ? (
        <div
          className={`flex items-center border border-gray-300 rounded-lg overflow-hidden w-full ${readonly ? 'bg-gray-100' : ''}`}
        >
          <button
            type="button"
            onClick={() => !readonly && fileRef.current.click()}
            disabled={readonly}
            className={`px-3 py-2 flex items-center gap-2 border-r border-gray-300 bg-gray-100 text-black ${readonly ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Choose File
          </button>

          <span className="flex-1 px-3 py-2 text-[#9C9C9C] truncate">
            {fileName || "No File Chosen"}
          </span>

          <input
            key={inputKey}
            id={name}
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleInputChange}
            disabled={readonly}
          />
        </div>
      ) : (
        // variantt yg kotak gede
        <div
          className={`
            w-full flex flex-col justify-center items-center
            p-6 rounded-lg border border-dashed border-gray-300
            text-center transition
            ${dragActive && !readonly ? "bg-gray-100" : ""}
            ${readonly ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
          `}
          onClick={() => !readonly && fileRef.current.click()}
          onDragEnter={!readonly ? handleDrag : undefined}
          onDragLeave={!readonly ? handleDrag : undefined}
          onDragOver={!readonly ? handleDrag : undefined}
          onDrop={!readonly ? handleDrop : undefined}
        >
          {!fileName && (
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <p className="text-black font-medium">
                Click to Upload{" "}
                <span className="text-gray-600">or drag & drop</span>
              </p>
              <p className="text-sm text-[#9C9C9C]">(Max. 25MB)</p>
            </div>
          )}

          {fileName && (
            <p className="text-sm text-black">{fileName}</p>
          )}

          <input
            key={inputKey}
            id={name}
            ref={fileRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleInputChange}
            disabled={readonly}
          />
        </div>
      )}
      
      {/* buat message erornya */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default UploadFile;
