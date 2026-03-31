import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

const SortByFilter = ({
  statusOptions = ["Ditolak", "Diterima", "Pending"],
  selectedStatus = [],
  onApply,
  buttonClassName = "flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 text-gray-700",
  label = "Sort by:",
}) => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [tempSelectedStatus, setTempSelectedStatus] = useState([]);
  const filterButtonRef = useRef(null);

  // Initialize tempSelectedStatus ketika popup dibuka
  useEffect(() => {
    if (showFilterPopup) {
      setTempSelectedStatus([...selectedStatus]);
    }
  }, [showFilterPopup, selectedStatus]);

  // Handle click outside untuk menutup popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(e.target)) {
        setShowFilterPopup(false);
      }
    };
    if (showFilterPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterPopup]);

  // Handle checkbox change
  const handleCheckboxChange = (status) => {
    setTempSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    if (onApply) {
      onApply([...tempSelectedStatus]);
    }
    setShowFilterPopup(false);
  };

  return (
    <div className="relative" ref={filterButtonRef}>
      <Button
        onClick={() => setShowFilterPopup(!showFilterPopup)}
        className={buttonClassName}
      >
        <span>{label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Popup Filter */}
      {showFilterPopup && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="space-y-3">
              {statusOptions.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={tempSelectedStatus.includes(status)}
                    onChange={() => handleCheckboxChange(status)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
            {/* Tombol Apply */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleApplyFilter}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortByFilter;

