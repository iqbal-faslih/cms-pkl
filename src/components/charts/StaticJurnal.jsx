import React, { useState } from "react";
import Chart from "react-apexcharts";
import { processJurnalData } from "../../helpers/siswa/dashboard/dashboardHelper";

const Title = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

const StaticJurnal = ({ data }) => { 
  const [filter, setFilter] = useState("Yearly");
  const [activeData, setActiveData] = useState("mengisi");

  const dataOptions = {
    Yearly: processJurnalData(data)
  };

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      height: 350,
    },
    colors: [activeData === "mengisi" ? "#60A5FA" : "#EF4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadiusApplication: 'end',
        borderRadius: 2
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: dataOptions[filter].categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 30,
      tickAmount: 6,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + " entries"
        }
      }
    },
    legend: {
      show: false
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white w-full h-full">
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Tidak ada data jurnal tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <Title className="text-gray-800">Statistik Jurnal</Title>
        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      
      <div className="flex justify-center mb-6 space-x-2">
        <button
          onClick={() => setActiveData("mengisi")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeData === "mengisi"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Mengisi Jurnal
        </button>
        <button
          onClick={() => setActiveData("tidakMengisi")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeData === "tidakMengisi"
              ? "bg-red-500 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tidak Mengisi Jurnal
        </button>
      </div>

      <Chart
        options={options}
        series={dataOptions[filter][activeData]}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default StaticJurnal;