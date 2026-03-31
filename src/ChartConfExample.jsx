//contoh grafik garis
export const salesChartConfig = {
  type: "line",
  header: {
    title: "Grafik Penjualan Bulanan",
    showExport: true,
  },
  options: {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 4 },
    dataLabels: { enabled: false },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "Mei"] },
    yaxis: { title: { text: "Total Penjualan" } },
    tooltip: {
      y: { formatter: (val) => `${val} Unit` },
    },
    colors: ["#4F46E5"],
  },
};

//contoh grafik lingkaran
export const pieChartConfig = {
  type: "donut",
  height: 320,
  options: {
    chart: {
      toolbar: { show: false },
    },
    labels: ["Produk A", "Produk B", "Produk C", "Produk D"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      labels: { colors: "#333" },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              formatter: () => "100%",
            },
          },
        },
      },
    },
  },
  series: [44, 55, 13, 33],
};

// contoh grafik batang
export const barChartConfig = {
  type: "bar",
  height: 350,
  header: {
    title: "Perbandingan Penjualan Tiap Produk",
    showExport: false,
  },
  options: {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "Mei"],
      labels: { style: { fontSize: "13px" } },
    },
    yaxis: {
      title: { text: "Penjualan (Unit)" },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `${val} unit` },
    },
    colors: ["#3B82F6", "#10B981"],
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  },
};


