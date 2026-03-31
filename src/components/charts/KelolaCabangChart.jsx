import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const MentorDivisionChart = ({ data, year = "2025" }) => {
  const { series, labels, totalMentor } = useMemo(() => {
    if (!data) {
      return { series: [], labels: [], totalMentor: 0 };
    }

    const entries = Object.entries(data);

    return {
      labels: entries.map(([key]) => key),
      series: entries.map(([, value]) => Number(value) || 0),
      totalMentor: entries.reduce((acc, [, value]) => acc + (Number(value) || 0), 0),
    };
  }, [data]);

  const options = {
    chart: {
      type: "donut",
      width: "100%",
    },
    labels,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "15px",
      offsetY: 18,
      markers: {
        width: 8,
        height: 8,
        radius: 12,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 4,
      },
    },
    stroke: { width: 0 },
    colors: [
      "#8B5CF6",
      "#3B82F6",
      "#FBBF24",
      "#22D3EE",
      "#4ADE80",
      "#FB7185",
      "#A78BFA",
    ],
    plotOptions: {
      pie: {
        donut: {
          size: "45%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "",
              fontSize: "34px",
              fontWeight: 700,
              formatter: () => totalMentor,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="h-full w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[36px] font-semibold text-slate-900">
          Mentor Magang Per-Divisi
        </h2>

        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600"
          value={year}
          onChange={() => {}}
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      <div className="h-[560px] w-full">
        <Chart
          type="donut"
          options={options}
          series={series}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default MentorDivisionChart;
