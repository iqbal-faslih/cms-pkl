import React, { useState } from "react";
import Chart from "react-apexcharts";
import { monthCategories } from "../../components/charts/dummyData";
import axios from "axios";
import { useEffect } from "react";

const StatistikPendaftarChartMini = ({ cabangs = [] }) => {
  const [selectedCabang, setSelectedCabang] = useState(
    cabangs?.[0]?.id || ""
  );
  const [pendaftarSeries, setPendaftarSeries] = useState([]);

  useEffect(() => {
    if (cabangs.length > 0 && !selectedCabang) {
      setSelectedCabang(cabangs[0].id);
    }
  }, [cabangs, selectedCabang]);

  useEffect(() => {
    const getPendaftarRekap = async () => {
      if (!selectedCabang) return;

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/perusahaan/rekap/pendaftar/${selectedCabang}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payload = response.data?.data ?? response.data ?? [];
        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.pendaftar)
          ? payload.pendaftar
          : [];

        setPendaftarSeries(data);
      } catch (error) {
        console.error("Error fetching pendaftar rekap:", error);
        setPendaftarSeries([]);
      }
    };

    getPendaftarRekap();
  }, [selectedCabang]);

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 3,
        left: 0,
        blur: 6,
        opacity: 0.25,
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      strokeWidth: 0,
      hover: { size: 0 },
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
      colors: ["#3B82F6"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#3B82F6"],
        opacityFrom: 0.7,
        opacityTo: 0,
        stops: [0, 80, 100],
      },
    },
    xaxis: {
      categories: monthCategories,
      labels: { style: { fontSize: "12px", color: "#94A3B8" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 250,
      tickAmount: 5,
      labels: { style: { fontSize: "12px", color: "#94A3B8" } },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 3,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: { enabled: true },
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900">Statistik Pendaftar</h2>

        <select
          className="text-xs border border-gray-300 rounded px-2 py-1 shadow-sm"
          value={selectedCabang}
          onChange={(e) => setSelectedCabang(e.target.value)}
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

      <div className="h-64 w-full">
        <Chart
          options={chartOptions}
          series={[{ name: "Pendaftar", data: pendaftarSeries }]}
          type="area"
          height="100%"
        />
      </div>
    </div>
  );
};

export default StatistikPendaftarChartMini;
