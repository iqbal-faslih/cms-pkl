import React from "react";
import Search from "@/shared/components/Search";
import Checkbox from "@/shared/components/Checkbox";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import SortButton from "@/shared/components/button/Sort";
import { PiPencilSimple } from "react-icons/pi";
import ExportButton from "@/ExportButton";

const ICONS_PATH = "/assets/img/Tes.jpg";

export const AbsensiConfig = ({
  searchQuery,
  setSearchQuery,
  setSortValue,
  filterState,
  onExport
}) => {
  const statusColor = {
    Hadir: "bg-green-100 text-green-600",
    Terlambat: "bg-[#ffdcbb] text-[#ffa62e]",
    Alpa: "bg-red-100 text-red-600",
    Izin: "bg-blue-100 text-blue-600",
    Sakit: "bg-purple-100 text-purple-600",
  };

  return {
    headerConfig: {
      split: false,
      title: "Pendataan Absensi",
      subtitle: "Kelola data dengan lebih flexibel",
      subtitleColor: "text-emerald-500",

      top: {
        left: [
          <Search
            key="search-bar"
            value={searchQuery}
            onChange={setSearchQuery}
          />,
        ],

        right: [
          <SortButton key="sort" labelText="Sort by:" onSelect={setSortValue} />,

          <ExportButton key="export" className="!px-3.5 !py-2 !bg-[#00c8b3] !text-white !rounded-lg !text-sm !border-0" onExport={onExport} />,

          <FilterDropButton
            key="filter"
            label="Filter"
            showDateFilter
            dateLabel="Tanggal Pembuatan"
            content={{
              render: () => (
                <div className="space-y-2 py-3">
                  <p className="text-lg font-medium">Status Kehadiran</p>

                  {["Hadir", "Alpa", "Terlambat", "Izin", "Sakit"].map(
                    (label) => (
                      <Checkbox
                        key={label}
                        label={label}
                        checked={filterState.selected.includes(label)}
                        onChange={() => filterState.toggle(label)}
                        boxClass="!border-blue-500 !bg-white hover:bg-blue-100
                            data-[checked=true]:!bg-blue-500
                            data-[checked=true]:!border-blue-500
                            data-[checked=true]:hover:!bg-blue-500"
                        checkIconClass="text-white"
                      />
                    )
                  )}
                </div>
              ),
              onApply: ({ dateFrom, dateTo }) =>
                filterState.apply({ dateFrom, dateTo }),
              onReset: () => filterState.reset(),
            }}
          />,
        ],
      },
    },

    tableConfig: {
      statusColor,

      headerStyle: {
        bgColor: "bg-[#f9fafb]",
        textColor: "text-gray-400",
        py: "py-3",
        px: "px-4",
        fontWeight: "font-medium",
        textAlign: "text-center",
      },

      cellStyle: {
        py: "py-1.5",
        px: "px-3",
        textColor: "text-gray-600",
        rowHover: "hover:bg-gray-50",
        rowTransition: "transition",
      },

      columns: [
        {
          key: "number",
          label: "Number",
          cellClassName: "text-center",
          headerClassName: "text-center",
        },

        {
          key: "nama",
          label: "Name",
          cellClassName: "text-center text-black",
          headerClassName: "text-center text-black",
          render: (value) =>
            React.createElement(
              "div",
              { className: "flex items-center gap-2 justify-center" },
              [
                React.createElement("img", {
                  key: "img",
                  src: ICONS_PATH,
                  className: "w-10 h-10 rounded-md object-cover",
                  alt: "foto",
                }),
                React.createElement("span", { key: "text" }, value),
              ]
            ),
        },

        {
          key: "tanggal",
          label: "Tanggal",
          cellClassName: "text-center",
          headerClassName: "text-center",
          render: (value) =>
            React.createElement(
              "div",
              { className: "flex items-center gap-2 justify-center" },
              [
                React.createElement("span", { key: "value" }, value),
                React.createElement(
                  "button",
                  {
                    key: "btn",
                    className:
                      "p-1.5 bg-[#ffb539] hover:bg-yellow-500 text-white rounded-lg shadow",
                    title: "Edit Tanggal",
                  },
                  React.createElement(PiPencilSimple, { size: 14 })
                ),
              ]
            ),
        },

        {
          key: "masuk",
          label: "Masuk",
          cellClassName: "text-center",
          headerClassName: "text-center",
          render: (value, row) =>
            React.createElement(
              "span",
              { className: row.status === "Terlambat" ? "text-[#ff0004]" : "" },
              value
            ),
        },

        {
          key: "istirahat",
          label: "Istirahat",
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
        {
          key: "pulang",
          label: "Pulang",
          cellClassName: "text-center",
          headerClassName: "text-center",
        },

        {
          key: "status",
          label: "Status",
          cellClassName: "text-center",
          headerClassName: "text-center",
          render: (value) =>
            React.createElement(
              "span",
              {
                className: `
                  min-w-[92px]
                  inline-flex justify-center
                  py-1 rounded-md text-xs font-semibold
                  ${statusColor[value] || ""}
                `,
              },
              value
            ),
        },
      ],
    },
  };
};
