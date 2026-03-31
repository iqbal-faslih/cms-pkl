import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TbCalendarMonth } from "react-icons/tb";
import { IoAlertCircleOutline } from "react-icons/io5";
import { parse, format, isValid } from "date-fns";
import { toDisplayFormat, toBackendFormat } from "@/shared/helpers/dateFormatter";

const CalendarField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "dd-MM-yyyy",
  error,
  required = false,
  disabled = false,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState(toDisplayFormat(value));
  const refInput = useRef(null);
  const calendarRef = useRef(null);

  const handleSelectDate = (date) => {
    if (!date) return;
    const backend = format(date, "yyyy-MM-dd");
    const display = format(date, "dd-MM-yyyy");
    setInputValue(display);
    onChange({ target: { name, value: backend } }); 
    setShowCalendar(false);
  };

  const handleManualInput = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 8) val = val.slice(0, 8);

   if (val.length > 2 && val.length <= 4) {
    val = `${val.slice(0, 2)}-${val.slice(2)}`;
    } else if (val.length > 4) {
    val = `${val.slice(0, 2)}-${val.slice(2, 4)}-${val.slice(4)}`;
}

    setInputValue(val);

    if (val.length === 10) {
      const backendFormat = toBackendFormat(val);
      const parsed = parse(backendFormat, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) {
        onChange({ target: { name, value: backendFormat } });
      }
    }
  };

  useEffect(() => {
    if (value) {
      const display = toDisplayFormat(value);
      if (display !== inputValue) setInputValue(display);
    } else if (inputValue !== "") {
      setInputValue("");
    }
  }, [value]);

  const parsedDate =
    inputValue && isValid(parse(toBackendFormat(inputValue), "yyyy-MM-dd", new Date()))
      ? parse(toBackendFormat(inputValue), "yyyy-MM-dd", new Date())
      : null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target) &&
        refInput.current &&
        !refInput.current.contains(e.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-4">
      {label && (
        <label className="block mb-1 font-medium text-black">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={refInput}
          type="text"
          value={inputValue}
          onFocus={() => !disabled && setShowCalendar(true)}
          onChange={handleManualInput}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border border-gray-300 text-gray-700 px-3 py-2 pr-10 text-sm
            placeholder:text-[#9C9C9C] focus:outline-none focus:ring-2 focus:ring-primary-active
            ${
              disabled
                ? "cursor-not-allowed"
                : ""
            }
            ${error ? "border-red-500" : "border-[#9C9C9C]"}`}
        />
        <TbCalendarMonth
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        {showCalendar && !disabled && (
          <div ref={calendarRef} className="absolute z-50 mt-1">
            <DatePicker
              inline
              selected={parsedDate}
              onChange={handleSelectDate}
            />
          </div>
        )}
      </div>
      {error && (
        <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
          <IoAlertCircleOutline size={15} /> {error}
        </div>
      )}
    </div>
  );
};

export default CalendarField;
