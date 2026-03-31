import Search from "@/shared/components/Search";
import { formatDetailDate } from "../../../utils/dateUtils";
import Badge2 from "@/shared/components/Badge2";
import SortButton from "../../../shared/components/button/Sort";
import FilterDropButton from "../../../shared/components/button/FilterDrop";
import SquaredProfile from "@/shared/components/SquaredProfile";
import { FaCalendarAlt } from "react-icons/fa";

export const pesertaConfig = (searchTerm, setSearchTerm) => ({
  headerConfig: {
    split: false,
    title: "Semua Peserta",
    subtitle: "Peserta Aktif",
    subtitleColor: "text-emerald-500",
    top: {
      left: [
          <Search
            key="search-bar"
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
          />,
      ],

      right: [
        "SORT_BUTTON",
        "FILTER_BUTTON",
      ],
    },
  },

  tableConfig: {
    className: "bg-transparent",
    headerStyle: {
      bgColor: "bg-transparent",
      textColor: "text-gray-400",
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
        label: "Number",
        headerClassName: "text-center",
        cellClassName: "text-center",
        render: (_, __, i) => i + 1,
      },
      {
        key: "name",
        label: "Name",
        headerClassName: "text-center",
        cellClassName: "text-center",
        render: (value, row) => {
          return (
            <div className="flex items-center gap-3">
              <SquaredProfile image={row.image} size="35px" />
              {value}
            </div>
          );
        },
      },
      {
        key: "asal_sekolah",
        label: "Asal Sekolah",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      {
        key: "project",
        label: "Project",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      {
        key: "progress",
        label: "Progress",
        cellClassName: "mx-auto",
        headerClassName: "text-center",
        render: (value) => {
          const color =
            value === "Selesai"
              ? "#1AD699"
              : value === "Dikerjakan"
              ? "#ff9e42"
              : "";
          const textColor =
            value === "Selesai"
              ? "#D6FCEF"
              : value === "Dikerjakan"
              ? "#D8E0E7"
              : "";
          return (
            <div className="flex items-center justify-center">
              <Badge2 className="w-24" color={color} textColor={textColor}>
                {value}
              </Badge2>
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "Aksi",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
    ],
  },
});

export const jurnalDataConf = {
  headerConfig: {
    split: false,
    title: "List Pengisian Jurnal",
    subtitle: "Semua data pengisian jurnal siswa",
    subtitleColor: "text-emerald-500",
    top: {
      right: [
        <SortButton
          key="sort-button"
          labelText="Sort by:"
          options={[
            { value: "terbaru-terlama", label: "Terbaru - Terlama" },
            { value: "terlama-terbaru", label: "Terlama - Terbaru" },
            { value: "a-z", label: "A-Z" },
            { value: "z-a", label: "Z-A" },
          ]}
          onSelect={(value) => console.log("Sort by:", value)}
        />,
        <FilterDropButton
          key="filter-button"
          label={<FaCalendarAlt />}
          showIcon={false}
          title="Tanggal Pembuatan"
          dateLabel=""
          showDateFilter={true}
          width="w-96"
          content={{
           
            onApply: ({ dateFrom, dateTo }) => {
              console.log("Filter applied:", { dateFrom, dateTo });
            },
          }}
        />
      ],
      left: [],
    }
  },

  tableConfig: {
    className: "bg-transparent",
    headerStyle: {
      bgColor: "bg-transparent",
      textColor: "text-gray-400",
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
        headerClassName: "text-left w-[1%]",
        cellClassName: "text-left",
        render: (_, __, i) => i + 1,
      },
      {
        key: "tgl",
        label: "Tanggal",
        headerClassName: "text-center",
        cellClassName: "text-center",
        render: (value) => {
          return <span>{formatDetailDate(value)}</span>;
        },
      },
      {
        key: "judul",
        label: "Judul",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      {
        key: "gambar",
        label: "Bukti",
        cellClassName: "mx-auto",
        headerClassName: "text-center",
        // render: (value) => {
        //   return (
        //     <div className="flex items-center justify-center">
        //       <img
        //         src={value}
        //         alt="Gambar Jurnal"
        //         className="w-20 h-12 border border-gray-200 bg-gray-400"
        //       />
        //     </div>
        //   );
        // },
      },
      {
        key: "desc",
        label: "Deskripsi",
        headerClassName: "text-center",
        cellClassName: "text-center mx-auto",
        render: (value) => {
          return  <div className="flex justify-center items-center mx-auto"> 
          <span className="line-clamp-2">{value}</span> 
          
          </div>
        },
      },
      {
        key: "actions",
        label: "Aksi",
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
    ],
  },
};

export const trackRecordConfig = {
  columns: [
    { key: "revisi", label: "Revisi" },
    { key: "in_work", label: "In Work" },
    { key: "completed", label: "Completed" },
  ],
  colors: {
    revisi: "#757C85",
    in_work: "#306BFF",
    completed: "#78C552",
  },
  colors2: {
    revisi: "#E4E4E4",
    in_work: "#DEE7FF",
    completed: "#E5FFDA",
  },
  buttonLabel: {
    revisi: "lihat task",
    in_work: "progress",
    completed: "done",
  },
  actions: {
    revisi: "handleLihatTask",
  },
};