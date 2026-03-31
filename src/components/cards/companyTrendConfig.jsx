// companyTrendConfig.js

const companyTrendConfig = {
  type: "bar",
  header: {
    title: "Tren Penambahan Perusahaan",
    showExport: false,
  },
  options: {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Juni", "Juli", "Agustus", "September", "Oktober"],
      labels: {
        style: {
          fontSize: "14px",
          colors: "#4b5563",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6b7280",
        },
      },
    },
    colors: ["#4f8df9"],
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
  },
};

export const companyTrendData = [
  {
    name: "Perusahaan",
    data: [100, 81, 71, 90, 30],
  },
];

export default companyTrendConfig;