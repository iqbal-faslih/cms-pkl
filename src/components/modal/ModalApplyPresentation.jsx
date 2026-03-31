import React, { useEffect, useState, useRef } from "react";
import { useApplyPresentation } from "../../hooks/useApplyPresentation";
import { useModalLock } from "../../hooks";

const ModalApplyPresentation = ({ isOpen, onClose, data }) => {
  const [showModal, setShowModal] = useState(false);
   const { isApplying, handleApplyClick } = useApplyPresentation(onClose);

     const modalRef = useRef(null);
   
     useModalLock(modalRef, isOpen);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      setShowModal(true);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      setShowModal(false);
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  
  
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className={`bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-lg relative transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        {/* HEADER */}
        <div className="relative h-32 flex justify-between items-start">
        <img 
          src={data?.backgroundImage} 
          alt="Presentation background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-10 w-full p-4 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-black">
            {/* Menampilkan tipe dari backend */}
            Presentasi {data?.tipe}
          </h3>
        </div>
      </div>

      {data?.status && (
        <div className="p-2 border-b border-[#667797] flex justify-between items-center">
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-black ${
            data?.status === "Selesai" ? "bg-[#83FFB1]" : 
            data?.status === "Berlangsung" ? "bg-blue-200" :
            data?.status === "Dibatalkan" ? "bg-red-200" :
            data?.status === "Kadaluarsa" ? "bg-gray-300" :
            "bg-[#FFE0CB]"
          }`}>
            {data?.status}
          </span>
          <div className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm font-medium">{data?.applicants || 0} orang</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="mb-4 space-y-2">
          {/* Date and Time */}
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-1" >
              <i className="bi bi-calendar3 text-[#0069AB]"></i>
              <span className="line-clamp-1">{data?.date}</span>
            </div>
            <div className="flex items-center gap-1 line-clamp-1">
              <i className="bi bi-clock text-[#0069AB]"></i>
              <span>{data?.time}</span>
            </div>
          </div>

          {/* Location atau Link Zoom */}
          

          {(data?.lokasi || data?.linkZoom) && (
            <div className="flex items-center text-gray-600 text-sm gap-1">
              <i className={`bi ${data?.linkZoom ? 'bi-camera-video' : 'bi-geo-alt'}`}></i>
              <span className="truncate">
                {data?.linkZoom ? 'Meeting Online' : data?.lokasi}
              </span>
            </div>
          )}

          {/* Quota information jika ada */}
          {data?.kuota && (
            <div className="flex items-center justify-between text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <i className="bi bi-people"></i>
                <span>Kuota: {data?.applicants || 0}/{data?.kuota}</span>
              </div>
              <div className="w-25 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(((data?.applicants || 0) / data?.kuota) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Catatan jika ada */}
          {data?.catatan && (
            <div className="text-gray-500 text-sm flex items-center gap-1" >
              <i className="bi bi-info-circle mr-1"></i>
              <span className="line-clamp-1">{data?.catatan}</span>
            </div>
          )}
        </div>

        <button 
            onClick={() => handleApplyClick(data?.id || data?.id_jadwal_presentasi)}
            disabled={isApplying}
            className={`w-full py-3 border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white transition-colors duration-200 rounded-full ${
              isApplying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isApplying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mendaftar...
              </div>
            ) : (
              'Apply Presentation'
            )}
          </button>

        {/* <button
          onClick={() => onButtonClick?.(item)}
          disabled={buttonProps.disabled}
          className={`w-full py-2 px-4 text-sm font-medium rounded-full transition-colors duration-200 ${
            buttonProps.disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : buttonProps.variant === 'outline'
              ? "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
              : "border border-[#0069AB] text-[#0069AB] hover:bg-[#0069AB] hover:text-white"
          }`}
        >
          {buttonProps.label}
        </button> */}
      </div>
          
          {/* Apply Button */}
          
        {/* </div> */}
      </div>
    </div>
  );
};

export default ModalApplyPresentation;

