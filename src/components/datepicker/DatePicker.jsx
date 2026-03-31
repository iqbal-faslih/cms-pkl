import { useState } from "react";
import PropTypes from "prop-types";
import { MONTH_NAMES, DAY_LABELS } from "../../helpers/dateConstant";

const normalizeDate = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const DatePicker = ({
  selectedDate,
  onChange,
  minDate,
  maxDate,
  monthNames = MONTH_NAMES,
  dayLabels = DAY_LABELS,
  className = ""
}) => {
  const today = new Date();
  const initialDate =
    selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate : today;

  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const blanks = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(<div key={`blank-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const isBeforeMin = minDate && normalizeDate(date) < normalizeDate(minDate);
      const isAfterMax = maxDate && normalizeDate(date) > normalizeDate(maxDate);
      const isDisabled = isBeforeMin || isAfterMax;

      days.push(
        <div
          key={`${currentYear}-${currentMonth}-${day}`}
          onClick={() => {
            if (!isDisabled) onChange(date);
          }}
          className={`h-8 w-8 flex items-center justify-center rounded-full
            ${isDisabled ? "text-gray-400 cursor-not-allowed" :
              isSelected ? "bg-blue-600 text-white cursor-pointer" :
              "hover:bg-gray-100 cursor-pointer"}`}
        >
          {day}
        </div>
      );
    }

    return [...blanks, ...days];
  };

  return (
    <div className={`w-64 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          &lt;
        </button>
        <div className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayLabels.map((d) => (
          <div
            key={d}
            className="h-8 w-8 text-xs font-medium flex items-center justify-center"
          >
            {d}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  monthNames: PropTypes.arrayOf(PropTypes.string),
  dayLabels: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

export default DatePicker;
