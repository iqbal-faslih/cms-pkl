import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = ({ currentDate: parentDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(parentDate ? dayjs(parentDate) : dayjs());

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  const today = dayjs().format("YYYY-MM-DD");
  const startOfMonth = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();

  const handleSelectDate = (date) => {
    onSelectDate?.(date);
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5">
      <div className="flex justify-between items-center bg-indigo-50 p-1.5 rounded-full mb-3">
        <button onClick={prevMonth} className="w-7 h-7 border border-indigo-200 flex justify-center items-center rounded-full bg-white text-indigo-500">
          &lt;
        </button>
        <h2 className="text-sm font-semibold">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={nextMonth} className="w-7 h-7 border border-indigo-200 flex justify-center items-center rounded-full bg-white text-indigo-500">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-gray-600">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(day => <div key={day} className="font-semibold text-sm">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: startOfMonth }).map((_, i) => <div key={`blank-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dateObj = currentDate.date(i + 1);
          const dateStr = dateObj.format("YYYY-MM-DD");
          
          const isSelected = parentDate && dateStr === dayjs(parentDate).format("YYYY-MM-DD");
          const isToday = dateStr === dayjs().format("YYYY-MM-DD");

          return (
            <div
              key={i}
              onClick={() => handleSelectDate(dateObj)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all duration-300
                ${isSelected ? "bg-blue-500 text-white font-semibold" : ""}
                ${!isSelected && isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""}
                ${!isSelected && !isToday ? "hover:bg-gray-200 text-gray-800" : ""}
              `}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Calendar;
