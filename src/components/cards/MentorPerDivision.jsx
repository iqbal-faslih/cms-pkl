import React from "react";
import ReactApexChart from "react-apexcharts";

export default function MentorPerDivisionChart() {
  const [state, SetState] = React.useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut",
      },
      dataLabels: {
        enabled: false,
      },
      colors: [
        "#2B80FF",
        "#628ECD",
        "#8BAFE1",
        "#B2CAF0",
        "#D5DEEF",
        "#FFFFFF",
      ],
      labels: [
        "UI/UX",
        "Web Dev",
        "Data Analiyst",
        "Cyber Security",
        "Public Relations",
        "IT Support",
      ],
      responsive: [
        {
          breakpoint: 2000,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <div className="bg-white rounded-lg border border-slate-400/[0.5] relative px-6 py-1.5">
      <div className="flex justify-between items-center">
        <h2 className="text- font-bold text-gray-800">
          Jumlah Mentor Per Divisi
        </h2>
        <select className="px-3 py-1 bg-gray-50 rounded-md shadow-xl">
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="flex flex-col items-center gap-6">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          width={150}
        />
      </div>
    </div>
  );
}
