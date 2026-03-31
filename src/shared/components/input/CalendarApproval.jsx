import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";

const CalendarApproval = ({ selectedDate, setSelectedDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2022, 4)); 
 
  const [startDateStr, setStartDateStr] = useState("27/05/2022");
  const [endDateStr, setEndDateStr] = useState("29/05/2022");

  const [selectedRange, setSelectedRange] = useState({
    start: new Date(2022, 4, 27),
    end: new Date(2022, 4, 29)
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [rangeType, setRangeType] = useState("Custom");
  const dropdownRef = useRef(null);

  const daysOfWeek = ["su", "mo", "tu", "we", "th", "fr", "sa"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const getCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(new Date(year, month, i));
    }

    return result;
  };

  const dates = getCalendarData();

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (!date) return;

    setRangeType("Custom");

    let newRange = { ...selectedRange };

    if (selectedRange.start && selectedRange.end) {
      newRange = { start: date, end: null };
    } else if (selectedRange.start) {
      if (date < selectedRange.start) {
        newRange = { start: date, end: selectedRange.start };
      } else {
        newRange = { start: selectedRange.start, end: date };
      }
    } else {
      newRange = { start: date, end: null };
    }

    setSelectedRange(newRange);
 
    if (newRange.start) setStartDateStr(formatDate(newRange.start));
    if (newRange.end) setEndDateStr(formatDate(newRange.end));
    else if (newRange.start) setEndDateStr(""); 
  };


  const handlePresetSelect = (type) => {
    setRangeType(type);
    setShowDropdown(false);

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let start = null;
    let end = today;

    switch (type) {
      case "Hari Ini":
        start = today;
        end = today;
        break;
      case "Kemarin":
        const yest = new Date(today);
        yest.setDate(yest.getDate() - 1);
        start = yest;
        end = yest;
        break;
      case "7 Hari Terakhir":
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        break;
      case "30 Hari Terakhir":
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        break;
      case "Bulan Ini":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Custom":

        return;
      default:
        return;
    }

    if (start && end) {
      setSelectedRange({ start, end });
      setStartDateStr(formatDate(start));
      setEndDateStr(formatDate(end));
      setCurrentMonth(new Date(start.getFullYear(), start.getMonth()));
    }
  };

  const handleApply = () => {
    if (setSelectedDate) setSelectedDate(`${startDateStr} - ${endDateStr}`);
    if (onClose) onClose();
  };

  const isSameDate = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getDayClass = (date) => {
    if (!date) return "invisible";
    
    const { start, end } = selectedRange;
    const isStart = isSameDate(date, start);
    const isEnd = isSameDate(date, end);
    const isInRange = start && end && date > start && date < end;

    if (isStart || isEnd) {
      return "bg-[#624bff] text-white font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md shadow-indigo-200 z-10 relative";
    }
    
    if (isInRange) {
      return "bg-[#F0EDFF] text-gray-700 w-full h-8 flex items-center justify-center relative mx-[-4px] z-0"; 
    }

    return "text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer";
  };

  const renderDateCell = (date, index) => {
    const { start, end } = selectedRange;
    const isInRange = start && end && date && date > start && date < end;
    const containerClass = isInRange ? "bg-[#F0EDFF] mx-[-2px]" : "";
    const isStart = isSameDate(date, start);
    const isEnd = isSameDate(date, end);
    let backgroundStrip = "";
    
    if (isStart && end && end > start) backgroundStrip = "absolute right-0 top-0 bottom-0 w-1/2 bg-[#F0EDFF] z-0";
    if (isEnd && start && start < end) backgroundStrip = "absolute left-0 top-0 bottom-0 w-1/2 bg-[#F0EDFF] z-0";

    return (
      <div key={index} className={`relative flex items-center justify-center py-1 ${containerClass}`}>
        {backgroundStrip && <div className={backgroundStrip}></div>}
        <button
          onClick={() => handleDateClick(date)}
          className={`text-sm transition-all ${getDayClass(date)}`}
          disabled={!date}
        >
          {date ? date.getDate() : ""}
        </button>
      </div>
    );
  };

  const presetOptions = ["Custom", "Hari Ini", "Kemarin", "7 Hari Terakhir", "30 Hari Terakhir", "Bulan Ini"];

  return (
    <div className="relative font-sans">
      <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-50"></div>

      <div
        className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-6 flex gap-10 z-40 relative"
        style={{ minWidth: "600px" }}
      >
        <div className="w-[280px]">
          <div className="bg-[#F4F1FF] rounded-full p-1.5 flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousMonth}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            
            <span className="text-black font-bold text-base">
              {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </span>

            <button
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-gray-400 text-sm font-medium uppercase ">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {dates.map((date, i) => renderDateCell(date, i))}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
              <span className="text-gray-500 font-medium text-sm">Select Date Range :</span>
              <FiChevronDown className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </div>

            <div className="space-y-4 relative" ref={dropdownRef}>
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-sm cursor-pointer hover:border-[#624bff] transition-colors flex justify-between items-center"
              >
                <span>{rangeType}</span>
                {rangeType !== "Custom" && <FiCheck className="text-[#624bff]" />}
              </div>

              {showDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {presetOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handlePresetSelect(option)}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F4F1FF] flex justify-between items-center ${rangeType === option ? "text-[#624bff] font-semibold bg-[#F4F1FF]" : "text-gray-600"}`}
                    >
                      {option}
                      {rangeType === option && <FiCheck size={14} />}
                    </div>
                  ))}
                </div>
              )}

              <div className={`border-2 rounded-lg px-4 py-3 flex justify-between items-center bg-white ${selectedRange.start && !selectedRange.end ? "border-[#624bff]" : "border-gray-200"}`}>
                <span className={`${selectedRange.start && !selectedRange.end ? "text-[#624bff]" : "text-gray-500"} font-bold text-sm`}>Start</span>
                <span className="text-gray-700 text-sm font-medium">{startDateStr}</span>
              </div>

              <div className={`border rounded-lg px-4 py-3 flex justify-between items-center bg-white ${selectedRange.start && selectedRange.end ? "border-gray-300" : "border-gray-200"}`}>
                <span className="text-gray-500 font-medium text-sm">End</span>
                <span className="text-gray-400 text-sm">{endDateStr}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleApply}
              className="bg-[#624bff] text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg shadow-indigo-200 hover:bg-[#5038dd] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApproval;