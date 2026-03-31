import React, { useRef, useEffect, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import Button from "../button/Button";

const ActionDropdown = ({
  isOpen,
  setIsOpen,
  showCheckboxes,
  setShowCheckboxes,
  selectedCount,
  onApply,
  onReset,
}) => {
  const dropdownRef = useRef(null);

  const [selectedOptions, setSelectedOptions] = useState(["Diterima"]);
  const options = ["Diterima", "Ditolak"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, setIsOpen]);

  const handleMainButtonClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      setShowCheckboxes(true);
    } else {
      setShowCheckboxes(false);
    }
  };

  const toggleOption = (option) => {
    setSelectedOptions([option]);
  };

  const handleApply = () => {
    if (selectedOptions.length === 0 || selectedCount === 0) {
      return;
    }

    if (onApply) onApply(selectedOptions);

    setIsOpen(false);
    setShowCheckboxes(false);
  };

  const handleReset = () => {
    setSelectedOptions(["Diterima"]);
    if (onReset) onReset();
    setIsOpen(false);
    setShowCheckboxes(false);
  };

  return (
    <div className="relative mr-2" ref={dropdownRef}>
      <Button
        onClick={handleMainButtonClick}
        className={`flex items-center gap-2 px-5 py-2 text-sm border border-purple-300 rounded-lg transition-all ${
          isOpen || showCheckboxes
            ? "bg-blue-700 text-white shadow-md"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Actions
        {selectedCount > 0 && (
          <span className="bg-white text-blue-600 px-1.5 rounded-full text-xs font-bold">
            {selectedCount}
          </span>
        )}
        <FiChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-black">Aksi</h3>
          </div>
          <hr className="border-gray-100 mb-4 -mx-5" />

          <div className="mb-6">
            <p className="text-sm font-semibold text-black mb-3">Status Izin</p>
            <div className="space-y-3">
              {options.map((option) => {
                const isChecked = selectedOptions.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => toggleOption(option)}
                    className="flex items-center cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300 group-hover:border-blue-400"
                      }`}
                    >
                      {isChecked && (
                        <FiCheck className="text-white w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="ml-3 text-sm text-gray-600 font-medium select-none">
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <hr className="border-gray-100 mb-4 -mx-5" />

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
