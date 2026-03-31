import React, { useState } from "react";
import Chart from "react-apexcharts";
import { weekCategories } from "../../components/charts/dummyData";
import axios from "axios";
import { useEffect } from "react";

const StatistikJurnalChartMini = ({ cabangs = [] }) => {
  const [selectedCabangId, setSelectedCabangId] = useState(cabangs?.[0]?.id || "");
  const [selectedData, setSelectedData] = useState({
    mengisi: [],
    tidak: [],
  });

  useEffect(() => {
    if (cabangs.length > 0 && !selectedCabangId) {
      setSelectedCabangId(cabangs[0].id);
    }
  }, [cabangs, selectedCabangId]);

  useEffect(() => {
    const getJurnalRekap = async () => {
      if (!selectedCabangId) return;

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/perusahaan/rekap/jurnal/${selectedCabangId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payload = response.data?.data ?? response.data ?? {};
        const mengisi = Array.isArray(payload?.mengisi)
          ? payload.mengisi
          : Array.isArray(payload?.data_mengisi)
          ? payload.data_mengisi
          : [];
        const tidak = Array.isArray(payload?.tidak)
          ? payload.tidak
          : Array.isArray(payload?.tidak_mengisi)
          ? payload.tidak_mengisi
          : Array.isArray(payload?.data_tidak_mengisi)
          ? payload.data_tidak_mengisi
          : [];

        setSelectedData({ mengisi, tidak });
      } catch (error) {
        console.error("Error fetching jurnal rekap:", error);
        setSelectedData({ mengisi: [], tidak: [] });
      }
    };

    getJurnalRekap();
  }, [selectedCabangId]);

  const series = [
    {
      name: "Mengisi",
      data: selectedData.mengisi,
    },
    {
      name: "Tidak Mengisi",
      data: selectedData.tidak,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#00D1B2", "#B2F1E6"],
    plotOptions: {
      bar: {
        columnWidth: "35%",
        borderRadius: 3,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: weekCategories,
      labels: {
        style: { fontSize: "12px", colors: "#94A3B8" },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: "#94A3B8" },
      },
      max: 120,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      markers: { radius: 10 },
      fontSize: "12px",
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  return (
    <div className="w-full px-2 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-slate-900">Statistik Jurnal</h2>

        <select
          className="text-xs border border-gray-300 rounded px-2 py-1 shadow-sm"
          value={selectedCabangId}
          onChange={(e) => setSelectedCabangId(e.target.value)}
          disabled={cabangs.length === 0}
        >
          {cabangs.length === 0 && <option value="">Tidak ada cabang</option>}
          {cabangs.map((cabang) => (
            <option key={cabang.id} value={cabang.id}>
              {cabang.nama}
            </option>
          ))}
        </select>
      </div>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
};

export default StatistikJurnalChartMini;
