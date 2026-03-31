import React from "react";
import ChartView from "../../shared/components/ChartVIew.jsx";

const gradient = (from, to) => ({
  type: "gradient",
  gradient: {
    shade: "light",
    type: "vertical",
    gradientToColors: [to],
    opacityFrom: 0.65,
    opacityTo: 0,
    stops: [0, 100],
  },
});

const sparkOptions = (color, fadeColor) => ({
  chart: {
    sparkline: { enabled: true },
    toolbar: { show: false },
    animations: { enabled: false },
  },
  stroke: { curve: "smooth", width: 2 },
  colors: [color],
  fill: gradient(color, fadeColor),
  tooltip: { enabled: false },
  grid: { show: false },
  xaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { show: false },
});

export const GreenCard = ({ totalCabang, data }) => (
  <div className="rounded-2xl shadow-sm p-4 bg-[#DCFCE7] flex flex-col justify-between min-h-[180px] md:min-h-[200px]">
    <div>
      <div className="text-lg font-semibold text-slate-900">Total Cabang</div>
      <div className="text-sm text-slate-700 mt-1">{totalCabang}</div>
    </div>

    <div className="flex items-center justify-between mt-4">
      <div className="w-14 h-14 flex items-center justify-center bg-[#27CEA7] rounded-xl">
        <img
          src="/assets/icons/absensi/certificateLogo.png"
          alt="Certificate"
          className="w-6 h-6"
        />
      </div>

      <div className="flex-1 ml-4 h-[80px] md:h-[90px] max-w-[350px]">
        <ChartView
          plain
          height={90}
          config={{
            type: "area",
            options: sparkOptions("#47D7A8", "rgba(71,215,168,0)"),
          }}
          data={[{ name: "mini", data }]}
        />
      </div>
    </div>
  </div>
);

export const OrangeCard = ({ totalPeserta, data }) => (
  <div className="rounded-2xl shadow-sm p-4  bg-[#FFF4DE] flex flex-col justify-between min-h-[180px] md:min-h-[200px]">
    <div>
      <div className="text-lg font-semibold text-slate-900">Total Peserta Magang</div>
      <div className="text-sm text-slate-700 mt-1">{totalPeserta}</div>
    </div>

    <div className="flex items-center justify-between mt-4">
      <div className="w-14 h-14 flex items-center justify-center bg-[#FF9F43] rounded-xl">
        <img
          src="/assets/icons/absensi/mens.png"
          alt="Mens"
          className="w-6 h-6"
        />
      </div>

      <div className="flex-1 ml-4 h-[80px] md:h-[90px] max-w-[350px]">
        <ChartView
          plain
          height={90}
          config={{
            type: "area",
            options: sparkOptions("#F6A676", "rgba(246,166,118,0)"),
          }}
          data={[{ name: "mini", data }]}
        />
      </div>
    </div>
  </div>
);
