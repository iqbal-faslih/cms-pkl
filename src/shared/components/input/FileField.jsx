import { useState, useEffect } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";

const FileField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  placeholder = "Pilih file...",
  showIcon = true,
  accept,
}) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (value) {
      setFileName(value.name || value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    onChange(file);
  };

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block font-medium mb-1 text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex flex-col rounded-lg border overflow-hidden sm:flex-row 
          ${error ? "border-red-500" : "border-[#9C9C9C]"}`}
      >
        {/* Tombol Choose File */}
        <label
          htmlFor={name}
          className={`flex w-full items-center justify-center gap-2 px-4 py-2 font-medium text-sm cursor-pointer sm:w-40 
            ${showIcon 
              ? "bg-[#E6F0FF] text-[#0066CC] hover:bg-[#d7e8ff]" 
              : "bg-[#EDEDED] text-[#646464] hover:bg-[#d4d4d4]"
            }
            ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`}
        >
          {/* Icon muncul kalau showIcon = true */}
          {showIcon && <FaFileLines className="text-[#0066CC] text-lg" />}
          Pilih File
        </label>

        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Nama File */}
        <div
          className={`min-h-10 flex-1 px-3 py-2 text-sm truncate 
            ${fileName ? "text-gray-700" : "text-gray-400"}`}
        >
          {fileName || placeholder}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
          <IoAlertCircleOutline size={15} /> {error}
        </div>
      )}
    </div>
  );
};

export default FileField;
