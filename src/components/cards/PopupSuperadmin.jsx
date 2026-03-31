import React from "react";
import { AlertTriangle, Power } from "lucide-react"; // tambah icon untuk activate/deactivate

const PopupSuperadmin = ({ open, onCancel, onConfirm, isInactive }) => {
  if (!open) return null;

  const isActivateMode = isInactive;
  
  // Konten yang berbeda berdasarkan mode
  const content = {
    activate: {
      title: "Are you sure?",
      message: "Are you sure you want to activate this company? This will restore all access and functionality.",
      icon: AlertTriangle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonText: "Activate",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    deactivate: {
      title: "Are you sure?",
      message: "Are you sure you want to deactivate this company? This action may affect its accessibility and related operations.",
      icon: AlertTriangle,
      iconBg: "bg-[#ffeab8]",
      iconColor: "text-[#eba817]",
      buttonText: "Deactivate",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    }
  };

  const currentContent = isActivateMode ? content.activate : content.deactivate;
  const IconComponent = currentContent.icon;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-9999">
      {/* Container dengan margin kiri untuk geser ke kanan */}
      <div className="flex justify-center w-full max-w-4xl ml-16">
        {/* Popup card yang lebih lebar */}
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
          {/* Header dengan icon yang berbeda */}
          <div className="flex items-start gap-3 p-8 pb-4">
            <div className="flex-shrink-0 mt-0.5">
              <div className={`w-12 h-12 ${currentContent.iconBg} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`w-7 h-7 ${currentContent.iconColor}`} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                {currentContent.title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-auto -mr-2"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body dengan pesan yang berbeda */}
          <div className="px-8 pb-6">
            <p className="text-gray-600 text-base leading-7">
              {currentContent.message}
            </p>
          </div>

          {/* Footer - Buttons */}
          <div className="flex justify-end gap-4 px-8 pb-8">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors text-base ${currentContent.buttonColor}`}
            >
              {currentContent.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSuperadmin;