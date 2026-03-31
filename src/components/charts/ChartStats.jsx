import React from "react";
import Chart from "react-apexcharts";

const ChartStats = ({ title, value, icon, seriesData, color, bgColor }) => {
  const chartOptions = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.3,
        opacityFrom: 0.7,
        opacityTo: 0,
      },
    },
    colors: [`${color}`],
    xaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex];
        return `
          <div style="
            background: white;
            padding: 6px 10px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-size: 13px;
            font-weight: 500;
            color: #333;
          ">
            ${value}
          </div>
        `;
      },
    },
    markers: {
      size: 0,
    },
  };
  return (
    <div className={`${bgColor} rounded-lg py-3 px-4 w-full h-[147px] border border-gray-300/[0.8] transition-all duration-300 ease-in-out`}>
        <div
          className="w-12 h-12 rounded-full flex justify-center items-center"
          style={{ backgroundColor: color }}
        >
          <img src={icon} alt={title} className="w-1/2 object-center" />
        </div>

      <div className="mt-4">
        <div>

      <h1 className="font-semibold text-base text-gray-900">{title}</h1>
      <h2 className="font-medium text-[12px] text-gray-600">{value} Kali</h2>
        </div>

        {/* <div className="w-24">
          <Chart
            options={chartOptions}
            series={[{ name: title, data: seriesData }]}
            type="area"
            height={50}
          />
        </div> */}
      </div>
    </div>
  );
};

export default ChartStats;
