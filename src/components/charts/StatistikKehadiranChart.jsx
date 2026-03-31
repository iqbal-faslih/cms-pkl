import React from "react";
import ChartView from "../../shared/components/ChartVIew.jsx";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];

const hadirColor = "#5BD6CB";
const izinColor = "#54CFA2";
const thColor = "#B77A81";

const hadirFade = "rgba(91,214,203,0)";
const izinFade = "rgba(84,207,162,0)";
const thFade = "rgba(183,122,129,0)";

export const StatistikKehadiranChart = ({ data }) => (
  <div className="rounded-2xl shadow-sm p-4 bg-white w-full min-h-[360px] md:min-h-[406px]">
    <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
      <h2 className="text-lg font-semibold text-slate-900">Statistik Kehadiran Peserta Per Cabang</h2>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#5BD6CB]" /> Hadir
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#54CFA2]" /> Izin
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#B77A81]" /> Tidak Hadir
          </span>
        </div>

        <select className="border border-gray-300 text-sm rounded-md px-3 py-1">
          <option>Cabang A</option>
          <option>Cabang B</option>
          <option>Cabang C</option>
        </select>
      </div>
    </div>

    <ChartView
      height={330}
      config={{
        type: "area",
        header: { title: "", showExport: false },
        options: {
          legend: { show: false },
          chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            animations: { enabled: false },
          },
          dataLabels: { enabled: false },
          colors: [hadirColor, izinColor, thColor],
          stroke: { curve: "smooth", width: 2.2 },
          fill: {
            type: "gradient",
            gradient: {
              shade: "light",
              type: "vertical",
              gradientToColors: [hadirFade, izinFade, thFade],
              opacityFrom: 0.60,
              opacityTo: 0,
              stops: [0, 100],
            },
          },
          markers: { size: 0 },
          tooltip: { theme: "light" },
          xaxis: {
            categories: months,
            axisTicks: { show: true },
            axisBorder: { show: false },
            labels: { style: { colors: "#64748B", fontSize: "12px" } },
          },
          yaxis: {
            min: 0,
            max: 30,
            tickAmount: 3,
            labels: { style: { colors: "#64748B", fontSize: "12px" } },
          },
          grid: {
            borderColor: "#D8D8D8",
            strokeDashArray: 4,
          },
        },
      }}
      data={data}
    />
  </div>
);