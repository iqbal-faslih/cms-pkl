import {
  BsCalendarCheck,
  BsCheckCircle,
  BsAward,
  BsPeople,
} from "react-icons/bs";
import { formatDetailDate } from "../../../utils/dateUtils";

export const statistics = [
  {
    title: "Total Absensi",
    count: 5,
    color: "#0d6efd",
    softColor: "#e7f1ff",
    softColor2: "#F1F0FF",
    icon: <BsCalendarCheck />,
    chartData: [5, 10, 2, 20, 50, 4],
  },
  {
    title: "Total Hadir",
    count: 5,
    color: "#198754",
    softColor: "#d1f2e7",
    softColor2: "#B2F2C9",
    icon: <BsCheckCircle />,
  },
  {
    title: "Total Izin/Sakit",
    count: 5,
    color: "#fd7e14",
    softColor: "#ffe5d0",
    softColor2: "#FFF4FD",
    icon: <BsAward />,
  },
  {
    title: "Total Alpa",
    count: 5,
    color: "#dc3545",
    softColor: "#ffe0e0",
    softColor2: "#FFDBDB",
    icon: <BsPeople />,
  },
];

export const jurnalDataConf = {
  headerConfig: {
    split: false,
    title: "Riwayat Pengisian Jurnal",
    subtitleColor: "text-emerald-500",
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
        key: "tanggal",
        label: "Tanggal",
        headerClassName: "text-left",
        cellClassName: "text-left",
        render: (value) => {
          return <span>{formatDetailDate(value)}</span>;
        },
      },
      {
        key: "judul",
        label: "Judul",
        headerClassName: "text-left",
        cellClassName: "text-left",
      },
      {
        key: "bukti",
        label: "Bukti",
        cellClassName: "mx-auto",
        headerClassName: "text-center",
        render: (value) => {
          return (
            <div className="flex items-center justify-center">
              <img
                src={value}
                alt="Gambar Jurnal"
                className="w-20 h-12 border border-gray-200 bg-gray-400"
              />
            </div>
          );
        },
      },
      {
        key: "deskripsi",
        label: "Deskripsi",
        headerClassName: "text-left",
        cellClassName: "text-left",
        render: (value) => {
          return <span className="max-w-32 line-clamp-2">{value}</span>;
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

export const jurnalBarConfig = {
  type: "bar",
  header: {
    title: "Statistik Pengisian Jurnal",
    showExport: false,
  },
  options: {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        endingShape: "rounded",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
    },
    yaxis: {
      title: { text: "" },
      labels: { style: { colors: "#64748b" } },
    },
    fill: { opacity: 1 },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      offsetY: 10,
      markers: { radius: 12 },
    },
    grid: {
      strokeDashArray: 4,
      borderColor: "#e2e8f0",
    },
    tooltip: {
      y: {
        formatter: (v) => `${v} kali`,
      },
    },
    colors: ["#0d6efd", "#99C0FF"],
  },
};

export const trackRecordConfig = {
  columns: [
    { key: "completed", label: "COMPLETED" },
    { key: "in_work", label: "IN WORK" },
    { key: "pending", label: "PENDING" },
  ],
  colors: {
    completed: "#78C552",
    in_work: "#306BFF",
    pending: "#FF9C3E",
  },
  colors2: {
    completed: "#F3FAF0",
    in_work: "#F0F4FF",
    pending: "#FFF4E5",
  },
  buttonLabel: {
    completed: "Lihat Revisi",
    in_work: "Lihat Task",
    pending: "Coming Soon",
  },
  actions: {
    completed: "handleLihatRevisi",
    in_work: "handleLihatTask",
    pending: "handleComingSoon",
  },
};
