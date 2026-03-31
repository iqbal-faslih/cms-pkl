import React from "react";
import { X } from "lucide-react";

const Notifikasi = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon: Icon,
  iconColor = "text-yellow-500",
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  size = "max-w-md",
  hideCancel = false,
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
      <div className={`bg-white rounded-lg shadow-xl w-full p-6 relative ${size}`}>
        
        {/* Close Button */}
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-4">
          {Icon && (
            <div className={`${iconColor} mt-0.5`}>
              <Icon size={24} />
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 leading-relaxed ml-9 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {!hideCancel && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
