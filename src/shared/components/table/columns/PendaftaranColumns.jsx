import React from "react";
import { FiEye } from "react-icons/fi";
import Checkbox from "../../Checkbox";

export const getPendaftaranColumns = (
  tableConfig,
  showCheckboxes = false,
  selectedItems = [],
  handleSelectItem = () => {},
  handleOpenModal = () => {},
  isSelectable = () => true
) => {
  selectedItems = Array.isArray(selectedItems) ? selectedItems : [];

  const baseColumns =
    tableConfig?.pendaftaran?.columns?.map((col) => {
      if (col.key !== "aksi") return col;

      return {
        ...col,
        render: (value, row) => (
          <div className="flex justify-center">
            <button
              className="flex items-center justify-center w-8 h-8 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition-colors"
              onClick={() => handleOpenModal(row)}
              title="Aksi"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        ),
      };
    }) || [];
  if (!showCheckboxes) return baseColumns;

  const checkboxColumn = {
    key: "checkbox",
    label: <div className="w-4 h-4" />,
    className: "w-12",
    headerClassName: "text-center",
    render: (value, row) => (
      <Checkbox
        checked={selectedItems.includes(row.id)}
        onChange={() => handleSelectItem(row.id)}
        disabled={!isSelectable(row)}
        size={16}
        boxClass="border-gray-300"
        checkIconClass="text-white"
      />
    ),
  };

  return [checkboxColumn, ...baseColumns];
};
