import React from "react";
import ChartView from "../../shared/components/ChartVIew.jsx";
import { monthCategories } from "./dummyData";

export const JumlahPesertaChart = ({ data }) => {
  // Pastikan data selalu aman
  const { active, alumni } = data || {};

  const activeData = Array.isArray(active) ? active : Array(12).fill(0);
  const alumniData = Array.isArray(alumni) ? alumni : Array(12).fill(0);

  const formattedSeries = [
    { name: "Aktif", data: activeData },
    { name: "Alumni", data: alumniData }
  ];

  // Pastikan categories tidak null/undefined
  const safeCategories = Array.isArray(monthCategories)
    ? monthCategories
    : [];

  return (
    <div className="rounded-2xl shadow-sm p-4 bg-white w-full min-h-[360px] md:min-h-[406px]">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Jumlah Peserta Magang Per Cabang
        </h2>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#3C7EFA]" /> Aktif
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#CCE6FF]" /> Alumni
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
          type: "bar",
          header: { title: "", showExport: false },
          options: {
            legend: { show: false },
            chart: {
              stacked: true,
              toolbar: { show: false },
              animations: { enabled: false }
            },
            colors: ["#3C7EFA", "#CCE6FF"],

            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "20%",
                borderRadius: 5,
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "last",
              },
            },

            dataLabels: { enabled: false },

            xaxis: {
              categories: safeCategories, // AMAN
            },

            yaxis: { min: 0, max: 200, tickAmount: 4 },
            grid: { borderColor: "#D0D5DD" },
          },
        }}

        data={formattedSeries}
      />
    </div>
  );
};
