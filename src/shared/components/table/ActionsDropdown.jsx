import React, { useRef, useEffect } from "react";
import Button from "../button/Button";
import Checkbox from "../Checkbox";
import { FiChevronDown } from "react-icons/fi";

const ActionsDropdown = ({
  isOpen,
  selectedStatus,
  onToggle,
  onClose,
  onReset,
  onApply,
  statusOptions = [],
  selectedItems = [],
  selectedIzinItems = [],
  activeTab,
  onSelectStatus,
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !e.target.closest(".select-field-dropdown")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const hasSelectedItems =
    activeTab === "pendaftaran"
      ? selectedItems.length > 0
      : selectedIzinItems.length > 0;

  return (
    <div ref={wrapperRef} className="relative mr-2">
      <Button
        onClick={onToggle}
        className="flex items-center gap-2 px-5 py-2 text-sm border-purple-300 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        Actions
        <FiChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-64">
          <p className="text-lg font-medium mb-4 pb-2 border-b pl-1 border-gray-300">
            Aksi
          </p>

          <div className="space-y-2 mb-4">
            {statusOptions.map((status) => (
              <Checkbox
                key={status}
                label={status}
                checked={selectedStatus === status}
                onChange={() => onSelectStatus(status)}
                boxClass="border border-blue-500 rounded"
              />
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={onReset}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
            >
              Reset
            </Button>
            <Button
              onClick={onApply}
              disabled={!selectedStatus || !hasSelectedItems}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
