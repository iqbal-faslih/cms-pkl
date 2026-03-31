import { useState, useRef, useEffect } from "react";

export const useCalendarNavigation = () => {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newDate = calendarApi.getDate();
      setCurrentDate(newDate);
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      updateTitle();
    }
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    const viewMap = {
      day: "timeGridDay",
      week: "timeGridWeek",
      month: "dayGridMonth",
    };

    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMap[newView]);
      updateTitle();
    }
  };

  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateTitle();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateTitle();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateTitle();
    }
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  return {
    view,
    currentDate,
    calendarRef,
    handleViewChange,
    handlePrev,
    handleNext,
    handleToday,
    handleDatesSet,
    updateTitle,
  };
};