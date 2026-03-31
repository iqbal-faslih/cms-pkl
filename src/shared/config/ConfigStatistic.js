export const ConfigStatistic = {
  type: "bar",
  header: {
    title: "Peserta Per Divisi",
    showExport: false,
  },
  options: {
    chart: {
      height: 350,
    },
    plotOptions: {
      bar: {
        columWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        ["UI/UX"],
        ["WEB", "DEV"],
        ["DATA", "Analyst"],
        ["Cyber", "Security"],
        ["Public", "Relations"],
        ["IT", "Support"],
      ],
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
  },
};

export const ConfifPieChart = {
  type: "donut",
  header: {
    title: "Jumlah Mentor Per Divisi",
    showExport: false,
  },
  options: {
    chart: {
      height: 350,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#2B80FF", "#628ECD", "#8BAFE1", "#B2CAF0", "#D5DEEF", "#A9B5DF"],
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
};
