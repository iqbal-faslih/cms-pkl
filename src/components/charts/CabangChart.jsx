import React from "react";
import Chart from "react-apexcharts";

const STATUS_CONFIG = [
  {
    label: "Menunggu Konfirmasi",
    keys: [
      "menunggu_konfirmasi",
      "menunggu",
      "pending",
      "siswa_menunggu_konfirmasi",
      "total_menunggu_konfirmasi",
    ],
  },
  {
    label: "Siswa Ditolak",
    keys: [
      "ditolak",
      "reject",
      "rejected",
      "siswa_ditolak",
      "total_ditolak",
    ],
  },
  {
    label: "Siswa Online",
    keys: ["online", "siswa_online", "total_online"],
  },
  {
    label: "Siswa Offline",
    keys: ["offline", "siswa_offline", "total_offline"],
  },
  {
    label: "Siswa Aktif",
    keys: ["aktif", "active", "siswa_aktif", "total_aktif"],
  },
  {
    label: "Alumni",
    keys: ["alumni", "total_alumni"],
  },
];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveValue = (peserta = {}, keys = []) => {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(peserta, key)) {
      return toNumber(peserta[key]);
    }
  }

  if (peserta?.status && typeof peserta.status === "object") {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(peserta.status, key)) {
        return toNumber(peserta.status[key]);
      }
    }
  }

  return 0;
};

const StatistikPeserta = ({ peserta = {} }) => {
  const labels = STATUS_CONFIG.map((item) => item.label);
  const series = STATUS_CONFIG.map((item) => resolveValue(peserta, item.keys));
  const hasData = series.some((value) => value > 0);

  const colors = [
    "#1D4ED8",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#BFDBFE",
    "#E5E7EB",
  ];

  const options = {
    chart: {
      type: "pie",
      width: 200,
    },
    labels,
    colors,
    legend: { show: false },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="w-40 h-40 flex items-center justify-center">
          {hasData ? (
            <Chart type="pie" options={options} series={series} width={170} height={170} />
          ) : (
            <p className="text-xs text-gray-500 text-center">Belum ada data statistik peserta.</p>
          )}
        </div>

        <div className="space-y-1">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center text-xs">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                style={{ backgroundColor: colors[index] }}
              ></span>
              <span className="text-[11px] text-gray-700">
                {label}: {series[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatistikPeserta;
