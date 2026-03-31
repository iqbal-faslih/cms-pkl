import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";

const DateButton = ({
  label = null, 
  value,
  onChange,
  icon = "mingcute:calendar-2-line", 
  iconPosition = "left", 
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const displayText = label
    ? label
    : value
    ? value.toLocaleDateString()
    : null;

  const showDropdownIcon = !label; // hanya tampil jika label tidak ada

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <Button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 border border-slate-300 px-1.5 py-1.5 text-sm rounded-md bg-[#304FFE] text-white hover:bg-blue-700 ${className}`}
      >
        {/* icon left */}
        {icon && iconPosition === "left" && (
          <Icon icon={icon} className="w-4 h-4" />
        )}

        {displayText && <span>{displayText}</span>}

        {/* icon right */}
        {icon && iconPosition === "right" && (
          <Icon icon={icon} className="w-5 h-5" />
        )}

        {showDropdownIcon && (
          <Icon icon="gridicons:dropdown" className="w-4 h-4" />
        )}
      </Button>

      {open && (
        <div className="absolute mt-2 bg-white shadow-lg rounded-md p-2 z-10">
          <DatePicker selected={value} onChange={onChange} inline />
        </div>
      )}
    </div>
  );
};

export default DateButton;
