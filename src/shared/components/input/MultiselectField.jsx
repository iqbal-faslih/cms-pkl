import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const MultiSelect = ({
  label,
  previewLabel,
  options = [],
  selectedItems = [],
  onSelectionChange,
  placeholder = "Pilih...",
  disabled = false,
  required = false,
  error = "",
  dropdownActionLabel = "",
  onDropdownActionClick,
  onRemoveSelectedItem,
  enableSelectAll = false,
  selectAllLabel = "Pilih Semua",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState(null);
  const wrapperRef = useRef(null);

  const handleSelect = (option) => {
    const alreadySelected = selectedItems.find((item) => item.id === option.id);

    if (alreadySelected) {
      onSelectionChange(selectedItems.filter((item) => item.id !== option.id));
    } else {
      onSelectionChange([...selectedItems, option]);
    }
  };

  const handleRemove = async (item) => {
    if (!item) return;

    const fallbackRemove = () => {
      onSelectionChange(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    };

    if (typeof onRemoveSelectedItem !== "function") {
      fallbackRemove();
      return;
    }

    try {
      setRemovingItemId(item.id);
      const shouldRemove = await onRemoveSelectedItem(item);
      if (shouldRemove === false) return;
      if (shouldRemove === true) return;
      fallbackRemove();
    } finally {
      setRemovingItemId(null);
    }
  };

  const optionIdSet = new Set(options.map((option) => String(option.id)));
  const selectedOptionCount = selectedItems.filter((item) =>
    optionIdSet.has(String(item.id))
  ).length;
  const allOptionsSelected =
    options.length > 0 && selectedOptionCount === options.length;

  const handleToggleSelectAll = () => {
    if (allOptionsSelected) {
      const remainingSelected = selectedItems.filter(
        (item) => !optionIdSet.has(String(item.id))
      );
      onSelectionChange(remainingSelected);
      return;
    }

    const merged = [...selectedItems];
    const selectedIdSet = new Set(selectedItems.map((item) => String(item.id)));

    options.forEach((option) => {
      if (!selectedIdSet.has(String(option.id))) {
        merged.push(option);
      }
    });

    onSelectionChange(merged);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Dropdown Trigger */}
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 text-left bg-white border rounded-lg flex items-center justify-between 
            hover:border-gray-400 focus:outline-none 
            ${error ? "border-red-500" : "border-gray-300"} 
            ${!error && "focus:ring-2 focus:ring-blue-500"} ${
              disabled
                ? "cursor-not-allowed"
                : ""
            }`}
        >
          <span
            className={`text-gray-700 ${
              selectedItems.length === 0 && "text-gray-400"
            }`}
          >
            {selectedItems.length > 0
              ? `${selectedItems.length} dipilih`
              : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {typeof onDropdownActionClick === "function" && (
              <div className="sticky top-0 z-[1] bg-white border-b border-gray-200 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onDropdownActionClick();
                  }}
                  className="w-full rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  {dropdownActionLabel || "Tambah Kategori"}
                </button>
              </div>
            )}

            {enableSelectAll && options.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="w-full border-b border-gray-200 px-4 py-2 text-left hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    readOnly
                    checked={allOptionsSelected}
                    className="w-4 h-4"
                  />
                  <div className="text-gray-800 font-medium">{selectAllLabel}</div>
                </div>
              </button>
            )}

            {options.map((option) => {
              const isChecked = selectedItems.some(
                (item) => item.id === option.id
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-blue-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={isChecked}
                    className="w-4 h-4"
                  />

                  <div className="text-gray-800">
                    <div className="font-medium">{option.name}</div>
                    {option.subtitle && (
                      <div className="text-sm text-gray-500">
                        {option.subtitle}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VALIDATION ERROR */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* SELECTED ITEMS AS BLUE CHIPS */}
      {selectedItems.length > 0 && (
        <>
          <h2 className="font-medium mt-3 text-gray-700">
            {previewLabel || `Preview ${label}`}
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border bg-white border-gray-300 text-gray-700 px-4 py-2 rounded-md gap-2"
              >
                <span className="text-sm text-blue-600">{item.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={disabled || String(removingItemId) === String(item.id)}
                  className="hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MultiSelect;
