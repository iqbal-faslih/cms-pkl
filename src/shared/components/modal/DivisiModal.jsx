import React from "react";
import { X } from "lucide-react";

const ListModal = ({
  isOpen = false,
  onClose = () => {},
  title = "Judul Modal",
  subtitle = "",
  items = [],
  width = "max-w-md",
  numbered = true,
  borderColor = "blue-400",
  textColor = "blue-600",
  hoverColor = "blue-50",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white w-full ${width} rounded-2xl shadow-xl p-6 relative animate-fadeIn`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* List Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 border border-${borderColor} rounded-lg px-4 py-2 hover:bg-${hoverColor} transition`}
            >
              {numbered && (
                <div
                  className={`flex items-center justify-center w-8 h-8 border border-${textColor} rounded-full text-${textColor} font-semibold`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
              )}
              <p className="text-sm text-gray-800 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListModal;
