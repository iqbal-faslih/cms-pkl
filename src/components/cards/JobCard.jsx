import React from "react";
import Chart from "react-apexcharts";

const JobCard = ({ job, onClick }) => {
  // Helper untuk mendapatkan warna yang sesuai
  const getColor = (colorName) => {
    const colorMap = {
      orange: {
        bg: "#fef3c7",
        icon: "#f59e0b",
        hex: "#f97316",
      },
      green: {
        bg: "#d1fae5",
        icon: "#10b981",
        hex: "#10b981",
      },
      yellow: {
        bg: "#fef08a",
        icon: "#ca8a04",
        hex: "#ca8a04",
      },
      blue: {
        bg: "#dbeafe",
        icon: "#3b82f6",
        hex: "#3b82f6",
      },
      indigo: {
        bg: "#e0e7ff",
        icon: "#6366f1",
        hex: "#6366f1",
      },
      cyan: {
        bg: "#cffafe",
        icon: "#06b6d4",
        hex: "#06b6d4",
      },
      default: {
        bg: "#f3f4f6",
        icon: "#6b7280",
        hex: "#6b7280",
      },
    };

    return colorMap[colorName] || colorMap.default;
  };

  const colorStyles = getColor(job.color);

  const chartOptions = {
    chart: {
      sparkline: { enabled: true },
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 0.4,
        left: 0,
        blur: 4,
        opacity: 0.25,
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        gradientToColors: [colorStyles.hex],
        opacityFrom: 0.6,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: [colorStyles.hex],
    tooltip: { enabled: false },
  };

  const chartSeries = [{ name: job.title, data: job.chartData }];

  return (
    <div
      className="relative rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between w-full min-w-0"
      style={{
        backgroundColor: colorStyles.bg,
        padding: "16px",
        height: "150px",
      }}
      onClick={onClick}
    >
      {/* === Bagian teks utama === */}
      <div className="relative z-10 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-700 truncate">
          {job.title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {job.count} Lowongan
        </p>
      </div>

      {/* === Icon di kiri bawah === */}
      <div
        className="absolute bottom-3 left-4 w-9 h-9 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: colorStyles.icon }}
      >
        <img
          src={job.icon || "/assets/icons/default-icon.png"}
          alt={job.title}
          className="w-5 h-5 filter brightness-0 invert"
        />
      </div>

      {/* === Chart di kanan === */}
      <div className="absolute bottom-2 right-0 w-32 h-16 opacity-100 pointer-events-none">
        {typeof window !== "undefined" && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
};

export default JobCard;
