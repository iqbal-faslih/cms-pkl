import React from "react";
import { Icon } from "@iconify/react";

const ErrorOverlay = ({ open, message, onRetry, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-9999">
      <div className="relative bg-white rounded-3xl shadow-2xl px-10 pt-20 pb-10 w-full max-w-md text-center">

        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center border-10 border-red-200">
            <Icon
              icon="mdi:close-thick"
              className="text-white"
              width="80"
              height="80"
            />
          </div>
        </div>

        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <Icon icon="mdi:close-thick" width="24" height="24" />
        </button>

        <h2 className="text-3xl font-semibold mb-2">Error</h2>
        <p className="text-gray-600 mb-4 text-lg leading-relaxed px-2">
          {message || "Terjadi kesalahan. Silakan coba lagi."}
        </p>

        <button
          className="px-7 py-1 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition text-md"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorOverlay;
