import { useState } from "react";
import { usePresentation } from "../../hooks";
import { getButtonLabel, isPresentationAvailable } from "../../helpers/presentationHelper";
import ModalApplyPresentation from "../../components/modal/ModalApplyPresentation";
import PresentationCard from "../../components/cards/PresentationCard";

const Presentasi = () => {
  const { 
    presentations,
    loading: isLoading, 
    error,
    refetch,
    getPresentationStats
  } = usePresentation();

  const [showModal, setShowModal] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const handleApplyClick = (item) => {
    const isAvailable = isPresentationAvailable(item);
    
    if (isAvailable && item.status !== "Dibatalkan" && item.status !== "Selesai" && item.status !== "Kadaluarsa") {
      setShowModal(true);
      setSelectedPresentation(item);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPresentation(null);
    if (refetch) refetch();
  };

  const stats = getPresentationStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 bg-white p-6 rounded-md">
        <div className="flex gap-5 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p>Memuat data Presentasi...</p>
        </div>
      </div>
    );
  }

    if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-red-500 mb-4">
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
          </div>
          <div className="text-red-500 text-center">
            <p className="font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-[#0069AB] text-white rounded-lg hover:bg-[#0069AB]/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-lg overflow-hidden">
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* Header */}
      <div className="bg-white px-6 py-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Jadwal Presentasi</h1>
            <div className="mt-2 flex gap-4 text-sm text-gray-600">
              <span>Total: <strong>{stats.total}</strong></span>
              <span>Tersedia: <strong className="text-green-600">{stats.available}</strong></span>
              <span>Selesai: <strong>{stats.selesai}</strong></span>
              <span>Kadaluarsa: <strong className="text-red-600">{stats.kadaluarsa}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {presentations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {presentations.map((item, index) => {
              const isAvailable = isPresentationAvailable(item);
              const buttonLabel = getButtonLabel(item.status, isAvailable);
              
              return (
                <PresentationCard
                  key={item.id || index}
                  item={item}
                  buttonLabel={buttonLabel}
                  onButtonClick={handleApplyClick}
                />
              );
            })}
          </div>
        ) : (

          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-gray-400 mb-4">
              <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Jadwal Presentasi
            </h3>
            <p className="text-gray-500 text-center max-w-md mb-4">
              Saat ini belum ada jadwal presentasi yang tersedia. 
              Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut.
            </p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-[#0069AB] text-white rounded-lg hover:bg-[#0069AB]/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Filter Info */}
      {presentations.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#FFE0CB] rounded-full"></div>
              <span>Dijadwalkan ({stats.dijadwalkan})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
              <span>Berlangsung ({stats.berlangsung})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#83FFB1] rounded-full"></div>
              <span>Selesai ({stats.selesai})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-200 rounded-full"></div>
              <span>Dibatalkan ({stats.dibatalkan})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Kadaluarsa ({stats.kadaluarsa})</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPresentation && (
        <ModalApplyPresentation
          data={selectedPresentation}
          onClose={handleModalClose}
          isOpen={showModal}
        />
      )}
    </div>
  );
};

export default Presentasi;