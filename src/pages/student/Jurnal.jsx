import CalendarHeader from "../../components/calendar/CalendarHeader";
import CalendarWrapper from "../../components/calendar/CalendarWrapper";
import JurnalModalsContainer from "../../components/modal/JurnalModalsContainer";
import { useJurnalData, useJurnalModals, useModalTambahJurnal } from "../../hooks/siswa/jurnal";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import "../../components/cards/calendar-custom.css";
import PrimaryButton from "../../components/button/PrimaryButton";

const Jurnal = () => {
  const { events, loading, error, refetchJurnal } = useJurnalData();
  
  const {
    currentDate,
    calendarRef,
    handlePrev,
    handleNext,
    handleToday,
    handleDatesSet,
  } = useCalendarNavigation();
  
  const {
    showAddModal,
    handleEventClick,
    handleEditClick,
    closeAddModal,
  } = useJurnalModals();
  
  const { openModal: openTambah } = useModalTambahJurnal();

  const onJurnalSubmitSuccess = () => {
    refetchJurnal();
    closeAddModal();
  };

  const onJurnalUpdateSuccess = () => {
    refetchJurnal();
  };

  const handleAddJurnal = () => {
    openTambah();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2 bg-white p-6 rounded-md">
        <div className="flex gap-5 items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p>Memuat data jurnal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 bg-white p-6 rounded-md">
        <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Gagal memuat data Jurnal</p>
          <PrimaryButton 
            onClick={refetchJurnal}
          >
            Coba Lagi
          </PrimaryButton>
      </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 bg-white p-6 rounded-md">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddJurnal={handleAddJurnal}
      />
      
      <CalendarWrapper
        calendarRef={calendarRef}
        events={events}
        onEventClick={handleEventClick}
        onDatesSet={handleDatesSet}
      />
      
      <JurnalModalsContainer
        showAddModal={showAddModal}
        onSubmitSuccess={onJurnalSubmitSuccess}
        onUpdateSuccess={onJurnalUpdateSuccess}
        onEditClick={handleEditClick}
      />
    </div>
  );
};

export default Jurnal;