import { PiPencilSimple } from "react-icons/pi";

export const statusColor = {
  Hadir: "bg-green-100 text-green-600",
  Terlambat: "bg-[#ffdbba] text-[#d27a00]",
  Alpa: "bg-red-100 text-red-600",
  Izin: "bg-blue-100 text-blue-600",
  Sakit: "bg-yellow-100 text-yellow-700",
};

const toMinutes = (time) => {
  if (!time || time === "-") return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const baseCell =
  "text-center py-2 border-b-[0.5px] border-[#e6f1ff]";

export const absensiColumns = [
  {
    label: "Number",
    key: "number",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => <span>{value}</span>,
  },

  {
    label: "Name",
    key: "nama",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => (
      <div className="flex items-center gap-3 justify-center">
        <img
          src="/assets/img/profile.png"
          className="w-8 h-8 rounded-md object-cover"
          alt="profile"
        />
        <span>{value}</span>
      </div>
    ),
  },

  {
    label: "Tanggal",
    key: "tanggal",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => (
      <div className="flex items-center gap-2 justify-center">
        <span>{value}</span>
        <button className="p-1 bg-[#ffb638] hover:bg-[#e6a12e] text-white rounded-md shadow">
          <PiPencilSimple size={14} />
        </button>
      </div>
    ),
  },

  {
    label: "Masuk",
    key: "masuk",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => {
      const telat = toMinutes(value) > toMinutes("08:00");
      return (
        <span className={telat ? "text-[#ff0004] font-semibold" : ""}>
          {value}
        </span>
      );
    },
  },

  {
    label: "Istirahat",
    key: "istirahat",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => <span>{value}</span>,
  },

  {
    label: "Pulang",
    key: "pulang",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => <span>{value}</span>,
  },

  {
    label: "Status",
    key: "status",
    headerClassName: "text-center text-[#91969e] font-semibold",
    cellClassName: baseCell,
    render: (value) => (
      <span
        className={`min-w-[92px] inline-flex justify-center py-1 rounded-md text-xs font-semibold ${statusColor[value]}`}
      >
        {value}
      </span>
    ),
  },
];
