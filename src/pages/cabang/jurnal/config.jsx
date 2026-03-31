import ProfileImg from "/assets/icons/Rectangle.png";
import { PiPencilSimple } from "react-icons/pi";
import { Icon } from "@iconify/react";
import Search from "@/shared/components/Search.jsx";
import ExportButton from "../../../ExportButton";
import SortButton from "@/shared/components/button/Sort";

export const jurnalCabangConf = (FilterButton = null) => ({
  headerConfig: {
    split: false,
    title: "Pendataan Jurnal",
    subtitle: "Kelola data dengan fleksibel",
    subtitleColor: "text-emerald-500",
    top: {
      left: [
        <Search
        />,
      ],
      right: [
        <SortButton
          label={
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:filter-list-rounded"
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </div>
          }
          showIcon={false}
          className="text-[12px] md:text-sm font-normal text-[#667797]"
          dropdownClassName="text-gray-700"
        />,
        <ExportButton
          tableId="export-table"
          filename="Data_Jurnal_Cabang.csv"
          className="text-[10px] md:text-sm bg-green-400 hover:bg-[#00b3a1] duration-300 hover:duration-300 text-white py-2.5 rounded-lg flex items-center gap-2"
        >
          <Icon icon="hugeicons:export" className="w-5 h-5" />
          Export
        </ExportButton>,
        FilterButton && FilterButton,
      ],
    },
  },

  tableConfig: {
    columns: [
      {
        key: "number",
        label: "No",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        cellClassName: "text-gray-900 font-medium text-xs sm:text-sm",
        width: "w-16 sm:w-20",
      },
      {
        key: "name",
        label: "Name",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        render: (value) => (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg border-2 border-gray-300 overflow-hidden flex-shrink-0">
              <img
                src={ProfileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[180px] text-xs sm:text-sm">
              {value}
            </span>
          </div>
        ),
        width: "w-32 sm:w-48",
      },
      {
        key: "school",
        label: "Asal Sekolah",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        cellClassName: "text-gray-700 text-xs sm:text-sm",
        width: "w-32 sm:w-48",
      },
      {
        key: "date",
        label: "Tanggal",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        cellClassName: "text-gray-700 text-xs sm:text-sm",
        render: (value) => (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm">{value}</span>
            <div className="bg-[#ff9e42] p-1 sm:p-1.5 rounded-lg">
              <PiPencilSimple className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
        ),
        width: "w-28 sm:w-36",
      },
      {
        key: "status",
        label: "Status",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        render: (value) => (
          <span
            className={`inline-flex px-2 sm:px-5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-[15px] font-semibold ${
              value === "Mengisi"
                ? "bg-[#1ad69b] text-white"
                : "bg-[#ffb3b3] text-[#ff0004]"
            }`}
          >
            {value}
          </span>
        ),
        width: "w-20 sm:w-28",
      },
      {
        key: "action",
        label: "Aksi",
        headerClassName: "font-semibold text-[#91969e] text-xs sm:text-sm",
        width: "w-20 sm:w-24",
      },
    ],

    tableStyle: "default",
    headerStyle: {
      bgColor: "bg-white",
      px: "px-3 sm:px-6",
      py: "py-3 sm:py-4",
      fontWeight: "font-bold text-sm sm:text-lg",
      textAlign: "text-center",
      borderBottom: "border-b border-gray-200",
    },
    cellStyle: {
      px: "px-3 sm:px-6",
      py: "py-2 sm:py-2.5",
      textAlign: "text-center",
      borderBottom: "border-b border-gray-200",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-colors duration-150",
    },
  },
});
