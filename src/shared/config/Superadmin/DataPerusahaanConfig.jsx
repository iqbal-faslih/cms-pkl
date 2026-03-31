import React from "react";
import Search from "@/shared/components/Search";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import Button from "@/shared/components/button/Button";
import SortButton from "@/shared/components/button/Sort";
import { Icon } from "@iconify/react";

const optionSort = [
  { value: "terbaru-terlama", label: "Terbaru - Terlama" },
  { value: "terlama-terbaru", label: "Terlama - Terbaru" },
  { value: "a-z", label: "A-Z" },
  { value: "z-a", label: "Z-A" },
]
export const DataManajemenPerusahaan = (filterState, searchQuery, setSearchQuery, rowState, modalActions) => ({
  headerConfig: {
    split: false,
    title: "Semua Perusahaan",
    subtitle: "Perusahaan Active",
    subtitleColor: "text-emerald-500",

top: {
      left: [
        <Search
          key="search-bar"
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
        />,
      ],

      right: [
        <SortButton
          key="sort-btn"
          labelText="Sort by:"
          options={optionSort}
          onSelect={(val) => modalActions.setSortValue(val)}
        />,

        <FilterDropButton
          key="filter-btn"
          label="Filter"
          showDateFilter={true}
          dateLabel="Tanggal Pembuatan"
          content={{
            render: ({ DefaultCheckbox }) => (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Kondisi</p>
                  {/* Checkbox hanya mengubah state Draft (selected) */}
                  <DefaultCheckbox
                    label="Aktif"
                    checked={filterState.selected.includes("aktif")}
                    onChange={() => filterState.toggle("aktif")}
                  />

                  <DefaultCheckbox
                    label="Non Aktif"
                    checked={filterState.selected.includes("nonAktif")}
                    onChange={() => filterState.toggle("nonAktif")}
                  />
                </div>
              </div>
            ),
            onApply: ({ dateFrom, dateTo }) => filterState.apply({ dateFrom, dateTo }),
            onReset: () => filterState.reset()
          }}
        />,
      ],
    },
  },

  tableConfig: {
    className: "bg-transparent",

    headerStyle: {
      textColor: "text-[#91969e]",
      fontWeight: "font-semibold md:font-bold",
      textAlign: "text-center",
      py: "py-3",
      px: "px-4"
    },
    cellStyle: {
      textColor: "text-gray-800",
      py: "py-1.5",
      px: "px-2 md:px-4",
      borderBottom: "border-b border-gray-200",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-200",
    },

   columns: [
   {
        key: "id",
        label: "Number",
        cellClassName: "text-center"

      },
   { key: "nama",
        label: "Nama Perusahaan",
        render: (value, row) => (
          <div className="flex justify-center items-center gap-3">
            <img
              src={row.img || "/assets/default-avatar.png"} // <-- Gunakan foto dari API jika ada
              alt="avatar"
              className="w-8 h-8 rounded-sm object-cover border border-gray-200"
            />
            <span>{value}</span>
          </div>
        ),
      },
   {   key: "lokasi",
          label: "Lokasi",
      },
    {
      key: "kondisi",
      label: "Kondisi",
      render: (value) => (
        <span
          className={`min-w-[45px] sm:min-w-[65px] md:min-w-[92px] inline-flex justify-center py-0.5 rounded-md font-roboto whitespace-nowrap ${
            value === "Aktif"
              ? "bg-[#d9fff6] text-[#15a349]"
              : "bg-[#FFB3B3] text-[#FF0000]"
          }`}
        >
          {value}
        </span>
      ),
      cellClassName: "text-center text-[8px] sm:text-[10px] md:text-[15px]",
    },
    {
      key: "jml_cabang",
      label: "Jumlah Cabang",
      cellClassName:
        "text-center font-medium text-[8px] sm:text-[12px] md:text-[15px]",
    },
    {
      key: "jml_peserta",
      label: "Jumlah Peserta",
      cellClassName:
        "text-center font-medium text-[8px] sm:text-[12px] md:text-[15px]",
    },
    {
      key: "aksi",
      label: "Aksi",
      headerClassName: "text-center",
      render: (_, row) => (
        <Button
          onClick={() => modalActions.navigate(`/superadmin/manajemen-perusahaan/${row.originalId}`)}
          className="text-white bg-[#3E80F8] hover:bg-blue-600 duration-300 px-3 py-1 rounded-md whitespace-nowrap"
        >
          Lihat Detail
        </Button>
      ),
      cellClassName: "text-center text-[8px] sm:text-[10px] md:text-sm",
    },
  ],
  },
});
