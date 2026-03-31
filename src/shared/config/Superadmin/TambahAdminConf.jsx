import React from "react";
import Search from "@/shared/components/Search";
import { FiDownload, FiUpload } from "react-icons/fi";
import Badge2 from "@/shared/components/Badge2";
import Checkbox from "@/shared/components/Checkbox";
import UploadFile from "@/shared/components/input/UploadFile";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import DateButton from "@/shared/components/button/Date";
import Button from "@/shared/components/button/Button";
import { activeAnimations } from "framer-motion";

export const tambahAdminConfig = (filterState, searchQuery, onSearchChange, rowState) => ({
  headerConfig: {
    split: false,
    title: "Data surat penerimaan",
    subtitle: "Kelola data penerimaan",
    subtitleColor: "text-emerald-500",
    layout: "horizontal",
    actions: [
      <Search
        key="search-bar"
        placeholder="Cari surat penerimaan..."
      />,
      <FilterDropButton
      />,
      <DateButton />,

    ],
  },

  tableConfig: {
    className: "bg-transparent",

    headerStyle: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      fontWeight: "font-bold",
      px: "px-6",
      py: "py-4",
      textAlign: "text-center",
    },

    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-center",
      textColor: "text-gray-700",
      fontWeight: "font-medium",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      borderBottom: "border-b border-gray-200",
    },

    columns: [
      {
        key: "no",
        label: "No",
        headerClassName: "text-left",
        cellClassName: "text-left",
        render: (_, __, i) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={rowState.checkedRows[i] === true}
              onChange={() => rowState.toggleRow(i)}
              size={18}
              boxClass="
                border-2 border-blue-500 rounded 
                data-[checked=true]:bg-blue-500 
                data-[checked=true]:border-blue-500
              "
              checkIconClass="text-white"
            />
            <span>{i + 1}</span>
          </div>
        ),
      },

      { key: "nama", label: "Nama Pemohon" },
      { key: "jenis", label: "Jenis Permohonan" },
      { key: "tanggal", label: "Tanggal Pengajuan" },

      {
        key: "status",
        label: "Status",
        render: (value) => {
          let color, textColor;

          switch (value) {
            case "Disetujui":
              color = "#DCFCE7";
              textColor = "#166534";
              break;
            case "Menunggu":
              color = "#FEF9C3";
              textColor = "#854D0E";
              break;
            case "Ditolak":
              color = "#FEE2E2";
              textColor = "#991B1B";
              break;
            default:
              color = "#E5E7EB";
              textColor = "#374151";
          }

          return (
            <Badge2
              color={color}
              textColor={textColor}
              textSize="0.75rem"
              rounded="0.375rem"
              className="w-28 h-7"
            >
              {value}
            </Badge2>
          );
        },
      },
    ],
  },
});
