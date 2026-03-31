import { useState, useRef, useEffect } from "react";
import { IoAlertCircleOutline, IoChevronDown, IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { createPortal } from "react-dom";

const SelectField = ({
  label,
  name,
  options = [],
  placeholder = "Pilih salah satu",
  error,
  required = false,
  disabled = false,
  value = [],
  onChange,
  multiple = false,
  maxSelection = null,
  isSearch = false,
  agreement = false,
  disablePortal = false,
  loading = false,
  loadingText = "Memuat data...",
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !(dropdownRef.current && dropdownRef.current.contains(e.target)) &&
        !(selectRef.current && selectRef.current.contains(e.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current && !disablePortal) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, disablePortal]);

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [value]
    : [];

  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value)
  );

  const handleSelectOption = (opt) => {
    if (!onChange) return;

    if (multiple && !agreement) {
      const isSelected = selectedValues.includes(opt.value);
      let newValues;

      if (isSelected) {
        newValues = selectedValues.filter((v) => v !== opt.value);
      } else {
        if (maxSelection && selectedValues.length >= maxSelection) return;
        newValues = [...selectedValues, opt.value];
      }
      onChange(newValues);
    } else {
      onChange(opt.value);
      setIsOpen(false);
    }
  };

  const handleRemoveOption = (optValue, e) => {
    e.stopPropagation();
    if (multiple && onChange) {
      const newValues = selectedValues.filter((v) => v !== optValue);
      onChange(newValues);
    } else if (agreement) {
      onChange(null);
    }
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDropdown = (
    <div
      ref={dropdownRef}
      className="select-field-dropdown absolute z-[9999] mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto scrollbar-hide"
      style={
        !disablePortal
          ? {
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              position: "absolute",
            }
          : {}
      }
    >
      {isSearch && (
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pencarian ..."
              className="w-full border border-gray-300 rounded-lg pl-9 pr-2 py-1 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-4 py-3 text-sm text-gray-500">{loadingText}</div>
      ) : filteredOptions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500">Tidak ada data</div>
      ) : (
        filteredOptions.map((opt, idx) => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <div
            key={opt.value ?? idx}
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelectOption(opt)}
            className={`px-4 py-3 select-none border-b hover:bg-sky-700/80 hover:text-white border-gray-200 flex items-center justify-between
              ${
                isSelected
                  ? agreement
                    ? opt.type === "+"
                      ? "bg-green-100 text-green-700 font-medium"
                      : "bg-red-100 text-red-700 font-medium"
                    : "bg-primary text-black bg-gray-50 font-medium"
                  : "text-black font-medium hover:text-primary hover:bg-primary-light-active cursor-pointer"
              }
              ${idx === filteredOptions.length - 1 ? "border-b-0" : ""}`}
          >
            <span>{opt.label}</span>
          </div>
        );
        })
      )}
    </div>
  );

  return (
    <div className="mb-4 relative" ref={containerRef}>
      {label && (
        <label htmlFor={name} className="block font-medium mb-1 text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {multiple && maxSelection && !agreement && (
            <span className="text-gray-500 text-xs ml-2">
              (Maks. {maxSelection})
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <button
          ref={selectRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            const nextOpen = !isOpen;
            setIsOpen(nextOpen);
            onOpenChange?.(nextOpen);
          }}
          className={`w-full flex justify-between items-center rounded-lg border px-3 py-2 text-sm min-h-[40px]
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <div className="flex-1 flex items-center gap-1 flex-wrap max-h-30 overflow-y-auto">
            {selectedOptions.length > 0 ? (
              agreement ? (
                selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded font-medium text-sm ${
                      opt.type === "+"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {opt.label}
                    <IoClose
                      size={16}
                      className="cursor-pointer hover:opacity-70"
                      onClick={(e) => handleRemoveOption(opt.value, e)}
                    />
                  </span>
                ))
              ) : multiple ? (
                selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-1 bg px-2 py-1 bg-primary text-white rounded font-medium whitespace-nowrap"
                  >
                    {opt.label}
                    <IoClose
                      size={16}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={(e) => handleRemoveOption(opt.value, e)}
                    />
                  </span>
                ))
              ) : (
                <span>{selectedOptions[0].label}</span>
              )
            ) : (
              <span className="text-[#9C9C9C]">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-2">
            <IoChevronDown
              className={`transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {isOpen &&
          !disabled &&
          (disablePortal
            ? renderDropdown
            : createPortal(renderDropdown, document.body))}
      </div>

      {error && (
        <div className="mt-1 flex items-center text-red-500 text-sm gap-1">
          <IoAlertCircleOutline size={15} /> {error}
        </div>
      )}
    </div>
  );
};

export default SelectField;
