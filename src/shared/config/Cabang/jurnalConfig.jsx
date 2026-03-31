import React from "react";
import Search from "@/shared/components/Search";
import SortButton from "@/shared/components/button/Sort";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import ExportButton from "../../../ExportButton";
import { Icon } from "@iconify/react";
import { PiPencilSimple } from "react-icons/pi";

const SORT_OPTIONS = [
  { value: "terbaru-terlama", label: "Terbaru - Terlama" },
  { value: "terlama-terbaru", label: "Terlama - Terbaru" },
  { value: "a-z", label: "Nama A - Z" },
  { value: "z-a", label: "Nama Z - A" },
];

const ITEMS_PER_PAGE = 10;

const TABLE_STYLES = {
  headerStyle: {
    bgColor: "bg-white",
    px: "px-6",
    py: "py-4",
    textAlign: "text-center",
  },
  cellStyle: {
    px: "px-6",
    py: "py-3",
    textAlign: "text-center",
    borderBottom: "border-b border-[#d8e2f0]",
    rowHover: "hover:bg-gray-50",
    rowTransition: "transition-colors duration-150",
  },
};

export const JurnalConfig = (
  searchQuery,
  setSearchQuery,
  selected,
  toggle,
  applyFilter,
  selectedSort,
  setSelectedSort,
  handleOpenModal,
  handleOpenCalendar,
  ProfileImg,
  resetFilter,
  onExport,
  exportLoading
) => ({
  headerConfig: {
    split: false,
    title: "Pendataan Jurnal",
    subtitle: "Kelola data dengan fleksibel",
    subtitleColor: "text-[#15bf98]",

    top: {
      left: [
        <Search
          key="search-bar"
          value={searchQuery}
          onChange={setSearchQuery}
        />,
      ],

      right: [
        <SortButton
          key="sort-button"
          labelText="Sort by:"
          options={SORT_OPTIONS}
          onSelect={setSelectedSort}
          showIcon
          icon="material-symbols-light:filter-list-rounded"
        />,

        <ExportButton
          key="export-button"
          onExport={onExport}
          loading={exportLoading}
          className="text-[10px] md:text-sm bg-teal-500/90 hover:bg-teal-600 duration-300 text-white py-1.5 rounded-lg flex items-center gap-2"
        >
          <Icon icon="hugeicons:export" className="w-5 h-5" />
          Export
        </ExportButton>,

        <FilterDropButton
          key="filter-button"
          label="Filter"
          showIcon
          width="w-96"
          title="Filter Data"
          showDateFilter
          content={{
            render: ({ DefaultCheckbox }) => (
              <div className="flex flex-col gap-3 mb-4">
                <p className="text-sm font-semibold">Status Jurnal</p>
                <DefaultCheckbox
                  label="Mengisi"
                  checked={selected.includes("mengisi")}
                  onChange={() => toggle("mengisi")}
                />
                <DefaultCheckbox
                  label="Kosong"
                  checked={selected.includes("kosong")}
                  onChange={() => toggle("kosong")}
                />
              </div>
            ),
            onApply: ({ dateFrom, dateTo }) =>
              applyFilter({ dateFrom, dateTo }),
            onReset: () => resetFilter(),
          }}
        />,
      ],
    },
  },

  tableConfig: {
    columns: [
      {
        key: "number",
        label: "Number",
        width: "w-20",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        cellClassName: "text-[#3A3A3C] font-normal text-sm",
      },
      {
        key: "name",
        label: "Name",
        width: "w-48",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        render: (value) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              <img src={ProfileImg} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <span className="text-[#3A3A3C] font-normal text-sm truncate max-w-[180px]">
              {value}
            </span>
          </div>
        ),
      },
      {
        key: "school",
        label: "Asal Sekolah",
        width: "w-56",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        cellClassName: "text-[#3A3A3C] font-normal text-sm",
      },
      {
        key: "date",
        label: "Tanggal",
        width: "w-32",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        render: (_, row) => (
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#3A3A3C] font-normal text-sm">{row.date}</span>
            <button
              onClick={() => handleOpenCalendar(row)}
              className="bg-[#FF9E42] p-1.5 rounded-md flex items-center justify-center hover:bg-[#e67e22] transition-colors"
            >
              <PiPencilSimple className="w-4 h-4 text-white" />
            </button>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        width: "w-28",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        render: (value) => (
          <span
            className={`inline-flex px-4 py-1.5 rounded-md text-sm font-semibold ${
              value === "Mengisi"
                ? "bg-[#e6f5f1] text-[#15a179]"
                : "bg-[#fce6e6] text-[#ed0004]"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: "action",
        label: "Aksi",
        width: "w-24",
        headerClassName: "text-[#92969E] font-semibold text-lg",
        render: (_, row) => (
          <div className="flex items-center justify-center">
            <button
              className="bg-[#00C7B3] hover:bg-[#00B3A1] p-2 rounded-md transition-colors"
              onClick={() => handleOpenModal(row)}
            >
              <Icon icon="mdi:eye" className="w-5 h-5 text-white" />
            </button>
          </div>
        ),
      },
    ],
    ...TABLE_STYLES, 
  },

  paginationConfig: {
    itemsPerPage: ITEMS_PER_PAGE,
    label: "entries",
  },
});
