// Updated CustomDateRangePicker with scale-80 ONLY on calendar + improved input size & alignment
import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export default function CustomDateRangePicker({ position = "" }) {
  const [range, setRange] = useState({ from: null, to: null });
  const [isOpen, setIsOpen] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const popupRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return "--/--/----";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDisplayLabel = () => {
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    if (range.from && !range.to) {
      return `${formatDate(range.from)} - ...`;
    }
    return "Select Date";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <button
        ref={popupRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border-0 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition text-xs"
      >
        <Calendar className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs">{getDisplayLabel()}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute pt-5 mt-2 z-50 bg-white shadow-xl rounded-xl pr-10 pb-10 border-0 w-[500px] h-[315px] ${position}`}
        >
          <div className="flex gap-4">
            {/* Calendar */}
            <div className="flex-1 origin-top scale-80">
              <style>{`
                .custom-day-picker {
                  --rdp-cell-size: 18px; 
                  --rdp-caption-height: 26px;
                  --rdp-accent-color: #7c3aed;
                  --rdp-background-color: #ede9fe;
                  font-family: system-ui, -apple-system, sans-serif;
                  padding: 0;   
                }

                .custom-day-picker .rdp-caption {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  margin-bottom: 4px;
                  padding: 0;
                }

                .custom-day-picker .rdp-caption_label {
                  font-size: 0.9rem;
                  padding: 0.1rem 0.8rem;
                  background: #EAE5FF;
                  color: black;
                  border-radius: 1rem;
                  font-weight: 600;
                }

                .custom-day-picker .rdp-day {
                  font-size: 0.9rem;
                  margin: 0;
                  padding: 0;
                }
              `}</style>

              <DayPicker
                className="custom-day-picker"
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                components={{
                  IconLeft: () => <ChevronLeft className="w-3 h-3" />,
                  IconRight: () => <ChevronRight className="w-3 h-3" />,
                }}
                styles={{
                  caption: { marginBottom: "6px" },
                  table: { marginTop: "4px" },
                }}
              />
            </div>

            {/* RIGHT PANEL */}
            <div className="w-44 flex flex-col gap-3">
              <p className="text-start text-xs mt-10 text-gray-400">
                Select Date Range:
              </p>

              {/* Custom Date Input */}
              <div className="border border-gray-400 rounded-lg px-2 py-1">
                <div className="text-[9px] text-gray-500 font-semibold mb-0.5">
                  Custom Date
                </div>
                <input
                  type="text"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="
                    w-full
                    text-[11px]
                    border-0
                    outline-none
                    py-1
                    text-right
                    placeholder:text-right
                  "
                />
              </div>

              {/* Start */}
              <div className="border border-gray-400 rounded-lg px-2 py-1">
                <div className="text-[9px] text-violet-600 font-semibold mb-0.5">
                  Start
                </div>
                <div className="text-[11px] font-medium text-right">
                  {formatDate(range?.from)}
                </div>
              </div>

              {/* End */}
              <div className="border border-gray-400 rounded-lg px-2 py-1">
                <div className="text-[9px] text-gray-500 font-semibold mb-0.5">
                  End
                </div>
                <div className="text-[11px] font-medium text-right">
                  {formatDate(range?.to)}
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-1/2 self-end bg-violet-600 hover:bg-violet-700 text-white font-semibold py-1.5 rounded-lg text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
