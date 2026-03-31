import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { calendarConfig } from "../../utils/calendarUtils";

const CalendarWrapper = ({ 
  calendarRef,
  events,
  onEventClick,
  onDatesSet 
}) => {
  const eventContent = (arg) => {
    const status = arg.event.extendedProps.status;

    if (status === "mengisi") {
      return (
        <div className="text-green-600 text-sm text-center p-3 font-semibold">
          Mengisi
        </div>
      );
    }

    if (status === "tidak_mengisi") {
      return (
        <div className="text-red-600 text-sm text-center p-3 font-semibold">
          Tidak Mengisi
        </div>
      );
    }

    return null;
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={events}
        eventClick={onEventClick}
        datesSet={onDatesSet}
        eventContent={eventContent}
        {...calendarConfig.calendarSettings}
      />
    </div>
  );
};

export default CalendarWrapper;
