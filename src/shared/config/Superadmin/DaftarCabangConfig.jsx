import React from "react";
import Search from "@/shared/components/Search";
import Badge2 from "@/shared/components/Badge2";
import Checkbox from "@/shared/components/Checkbox";
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
export const DaftarCabangConfig = (filterState, searchQuery, setSearchQuery, modalActions) => ({
  headerConfig: {
    split: false,
    title: "Semua Cabang",
    subtitle: "Cabang Active",
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
        <FilterDropButton
          label="Filter"
          showDateFilter={true}
          dateLabel="Tanggal Pembuatan"
          content={{
            render: ({ close, DefaultCheckbox }) => (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Status</p>
                  <DefaultCheckbox
                    label="Aktif"
                    checked={filterState.selected.includes("Aktif")}
                    onChange={() => filterState.toggle("Aktif")}
                  />

                  <DefaultCheckbox
                    label="Non Aktif"
                    checked={filterState.selected.includes("Non Aktif")}
                    onChange={() => filterState.toggle("Non Aktif")}
                  />
                </div>
              </div>
            ),
            onApply: ({dateFrom, dateTo}) => filterState.apply({dateFrom, dateTo}),
            onReset: () => filterState.reset()
          }}
        />,

        <SortButton
          labelText="Sort by:"
          options={optionSort}
          onSelect={(val) => modalActions.setSortValue(val)} 
        />
        ],
      },
    },

  tableConfig: {
    className: "bg-transparent",

    headerStyle: {
      textColor: "text-[#91969e]",
      fontWeight: "font-bold",
      px: "px-6",
      py: "py-4",
      textAlign: "text-center",
    },

    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-center",
      fontWeight: "font-medium",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      borderBottom: "border-b border-[#E5F0FE]",
    },

    columns: [
      {
        key: "no",
        label: "Number",
        cellClassName: "text-center"
      },

      { key: "nama",
        label: "Nama Cabang",
        render: (value, row) => (
          <div className="flex justify-center items-center gap-3">
            <img
              src={row.img || "/assets/default-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-sm object-cover border"
            />
            <span>{value}</span>
          </div>
        ),
      },
      {   key: "lokasi",
          label: "Lokasi",
      },
      {
        key: "status",
        label: "Kondisi",
        render: (value) => {
          let color, textColor;

          switch (value) {
            case "Aktif":
              color = "#D8FFF6";
              textColor = "#16A34A";
              break;
            case "Non Aktif":
              color = "#FFB3B3";
              textColor = "#FF0000";
              break;
            default:
              color = "#E5E7EB";
              textColor = "#374151";
          }

          return (
            <div className="flex justify-center"> 
            <Badge2
              color={color}
              textColor={textColor}
              textSize="0.90rem"
              rounded="0.375rem"
              className="w-28 h-7 "
            >
              {value}
            </Badge2>
            </div>
          );
        },
      },
      { key: "jumlah_peserta", label: "Jumlah Peserta" },
    ],
  },
});
