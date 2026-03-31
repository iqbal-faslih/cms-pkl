import React from "react";
import Chart from "react-apexcharts";

const StatsCard = ({ title, value, icon, color, background, chartColor, data, sidebarState }) => {
  
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
        gradientToColors: [chartColor],
        opacityFrom: 0.6,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    colors: [chartColor],
    tooltip: { enabled: false },
  };

  const chartSeries = [{ name: title, data }];

  return (
    <div
      className="
        relative rounded-2xl shadow-sm overflow-hidden 
        transition-transform duration-300 hover:scale-[1.02] 
        flex flex-col justify-between
        w-full min-w-0
      "
      style={{
        backgroundColor: background,
        padding: "18px",
        height: "130px",
      }}
    >
      {/* === Bagian teks utama === */}
      <div className="relative z-10 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
        <p className="text-base font-bold text-gray-900 mt-1">{value}</p>
      </div>

      {/* === Ikon kiri bawah === */}
      <div
        className="absolute bottom-4 left-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: color }}
      >
        <img
          src={icon}
          alt={title}
          className="w-4 h-4 filter brightness-0 invert"
        />
      </div>

      {/* === Chart === */}
      <div className="absolute bottom-2 right-0 w-[120px] h-[70px] opacity-100 pointer-events-none">
        <Chart
          key={sidebarState}     // 🔥 FIX: FORCE RE-RENDER KETIKA SIDEBAR BERUBAH
          options={chartOptions}
          series={chartSeries}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default StatsCard;
