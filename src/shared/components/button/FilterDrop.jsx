import React, { useState, useRef, useEffect } from "react";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";
import Checkbox from "@/shared/components/Checkbox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterDropButton = ({
  label = "Filter",
  content,
  showDateFilter = false,
  dateLabel = "Tanggal Pembuatan",
  customStyles = "",
  width = "w-96",
  compact = false,
  showIcon = true,
  title = "Filter Data",
  showReset = true,
  onReset,
}) => {
    
  const [open, setOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const wrapperRef = useRef(null);

  const close = () => setOpen(false);

  useEffect(() => {
  const handleClickOutside = (e) => {
  if (wrapperRef.current && !wrapperRef.current.contains(e.target)&& !e.target.closest(".select-field-dropdown")) {
  setOpen(false);
  }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
  setDateFrom(null);
  setDateTo(null);

  if (content?.onReset) {
      content.onReset();
    }
  // close();
  };

  const handleApply = () => {
  if (typeof content?.onApply === "function") {
  content.onApply({ dateFrom, dateTo });
  }
  close();
  };

  const DefaultCheckbox = ({ label, checked, onChange, size = 20 }) => ( <Checkbox
    label={label}
    checked={checked}
    onChange={onChange}
    size={size}
    boxClass="
      border border-[#CCD0E5] rounded 
      data-[checked=true]:bg-[#3E80F8]
      data-[checked=true]:border-[#3E80F8]"
    checkIconClass="text-white"
  />
  );

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative">
      <Icon
        icon="fluent-mdl2:date-time"
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 w-6 h-6"
      />
      <input
        type="text"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
        className="border border-slate-300 font-sm font-semibold pl-12 pr-2 py-1 rounded-md w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  ));

  const renderContent = content && typeof content.render === "function"
  ? content.render({ close, DefaultCheckbox, CustomDateInput })
  : null;
  
 return (
    <div className="relative inline-block" ref={wrapperRef}>
    <Button
    onClick={() => setOpen(!open)}
    className={`flex items-center text-sm text-white px-4 py-2 rounded-lg border bg-blue-600 hover:bg-blue-700 ${customStyles}`}>
    {label}
    {showIcon && (
      <Icon
        icon="mdi:menu-down"
        className={`
          w-5 h-5
          transition-transform duration-200
          ${open ? "rotate-180" : "rotate-0"}
        `}
      />
    )}
    </Button>

      {open && (
        <div
          className={`absolute z-999 mt-2 bg-white shadow-lg rounded-lg ${compact ? "p-3" : "p-4"} ${width} right-0`}
        >
          <p className={`${compact ? "text-base" : "text-lg"} font-semibold mb-2`}>{title}</p>
          <hr className={`border-gray-300 ${compact ? "mb-2" : "mb-3"}`} />

          {showDateFilter && (
            <div className={compact ? "mb-2" : "mb-3"}>
              <p className={`${compact ? "text-base" : "text-lg"} font-medium mb-2`}>{dateLabel}</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className={`${compact ? "text-xs" : "text-sm"} font-medium mb-1`}>Dari</p>
                  <DatePicker
                    selected={dateFrom}
                    onChange={(date) => setDateFrom(date)}
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomDateInput />}
                  />
                </div>

                <div className="flex-1">
                  <p className={`${compact ? "text-xs" : "text-sm"} font-medium mb-1`}>Ke</p>
                  <DatePicker
                    selected={dateTo}
                    onChange={(date) => setDateTo(date)}
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomDateInput />}
                  />
                </div>
              </div>
              <hr className={`border-gray-200 ${compact ? "my-2" : "my-3"}`} />
            </div>
          )}

          {renderContent && (
            <div className={compact ? "mb-2" : "mb-3"}>
              {renderContent}
              <hr className={`border-gray-200 ${compact ? "my-2" : "my-3"}`} />
            </div>
          )}

          <div className="flex gap-2">
            {showReset && (
              <Button
                onClick={handleReset}
                className={`flex-1 border border-slate-200 text-gray-500 ${compact ? "py-1.5 text-sm" : "py-2"} rounded-md hover:bg-slate-300/30`}
              >
                Reset
              </Button>
            )}
            <Button
              onClick={handleApply}
              className={`${showReset ? 'flex-1' : 'w-full'} bg-blue-600 text-white ${compact ? "py-1.5 text-sm" : "py-2"} rounded-md hover:bg-blue-600`}
            >
              Terapkan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropButton;
