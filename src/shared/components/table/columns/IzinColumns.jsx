import React from "react";
import { FiPrinter } from "react-icons/fi";
import Checkbox from "../../Checkbox";

export const getIzinColumns = (
  tableConfig,
  showCheckboxes,
  selectedIzinItems = [],
  handleToggleIzinCheckbox,
  handleExportIndividualExcel,
  isSelectable = () => true
) => {
  const safeSelected = Array.isArray(selectedIzinItems) ? selectedIzinItems : [];

  return [
    ...(showCheckboxes
      ? [
          {
            key: "checkbox",
            label: <div className="w-4 h-4" />,
            className: "w-12 text-center",
            headerClassName: "text-center",
            render: (v, row) => (
              <Checkbox
                checked={safeSelected.includes(row.id)}
                onChange={() => handleToggleIzinCheckbox(row.id)}
                disabled={!isSelectable(row)}
                size={16}
                boxClass="border-gray-300"
                checkIconClass="text-white"
              />
            ),
          },
        ]
      : []),

    ...tableConfig.izin.columns
      .filter((col) => col.key !== "checkbox")
      .map((col) => {
        if (col.key === "nama") {
          return {
            ...col,
            className: "w-48",
            render: (value, row) => (
              <div className="flex items-center gap-3">
                <img
                  src={row.profilePicture || "https://via.placeholder.com/40x40?text=PP"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{value}</span>
              </div>
            ),
          };
        }

        if (col.key === "aksi") {
          return {
            ...col,
            label: "Aksi",
            headerClassName: "text-center",
            render: (value, row) => (
              <div className="flex justify-center">
                <button
                  className="flex items-center justify-center w-8 h-8 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportIndividualExcel(row);
                  }}
                >
                  <FiPrinter className="w-4 h-4" />
                </button>
              </div>
            ),
          };
        }

        if (col.key === "status_izin") {
          return {
            ...col,
            className: "w-36 text-center",
            render: (value) => {
              const color =
                value === "Diterima"
                  ? "bg-teal-500 text-white"
                  : value === "Ditolak"
                  ? "bg-gray-300 text-gray-500"
                  : "bg-yellow-100 text-yellow-700";

              return (
                <span
                  className={`inline-flex justify-center items-center px-3 w-25 h-7 text-sm font-medium rounded-md ${color}`}
                >
                  {value}
                </span>
              );
            },
          };
        }

        return col;
      }),
  ];
};
