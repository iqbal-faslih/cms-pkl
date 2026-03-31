import React, { useCallback, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Title from "../Title";
import axios from "axios";
import { monthCategories } from "../../components/charts/dummyData";

const EMPTY_SERIES = [
  { name: "Hadir", data: [] },
  { name: "Izin", data: [] },
  { name: "Tidak Hadir", data: [] },
];

const StaticAbsensiPerusahaan = ({ cabangs = [] }) => {
  const [absensiCabang, setAbsensiCabang] = useState([]);
  const [selectedCabangId, setSelectedCabangId] = useState(
    cabangs?.[0]?.id || ""
  );

  useEffect(() => {
    if (cabangs.length > 0 && !selectedCabangId) {
      setSelectedCabangId(cabangs[0].id);
    }
  }, [cabangs, selectedCabangId]);

  const getAbsensiCabang = useCallback(async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/rekap/absensi/${selectedCabangId || ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data?.data ?? response.data ?? [];
      const data = Array.isArray(payload) ? payload : [];

      const hadir = data.map((item) => item?.hadir ?? 0);
      const alfa = data.map((item) => item?.alfa ?? 0);
      const izinSakit = data.map((item) => (item?.izin ?? 0) + (item?.sakit ?? 0));

      setAbsensiCabang([
        { name: "Hadir", data: hadir },
        { name: "Izin", data: izinSakit },
        { name: "Tidak Hadir", data: alfa },
      ]);
    } catch (err) {
      console.error("Error fetching absensi:", err);
    }
  }, [selectedCabangId]);

  useEffect(() => {
    if (selectedCabangId) getAbsensiCabang();
  }, [getAbsensiCabang, selectedCabangId]);

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 0,
        blur: 6,
        color: "#000",
        opacity: 0.15,
      },
    },

    colors: ["#3B82F6", "#10B981", "#A78BFA"],

    stroke: { curve: "smooth", width: 1 },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },

    dataLabels: { enabled: false },

    xaxis: {
      categories: monthCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" }
      },
    },

    yaxis: {
      min: 0,
      max: 20,
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" }
      },
    },

    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },

    legend: { show: false },

    tooltip: {
      theme: "light",
      style: { fontSize: "12px" },
    },
  };

  const renderCustomLegend = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#3B82F6" }}></span>
        <span className="text-sm text-gray-600">Hadir</span>
      </div>

      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#10B981" }}></span>
        <span className="text-sm text-gray-600">Izin</span>
      </div>

      <div className="flex items-center">
        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#DC2626" }}></span>
        <span className="text-sm text-gray-600">Tidak Hadir</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Statistik Kehadiran Peserta Per Cabang
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
          {renderCustomLegend()}

          <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            <select
              className="text-sm text-gray-700 bg-transparent outline-none"
              value={selectedCabangId}
              onChange={(e) => setSelectedCabangId(e.target.value)}
              disabled={cabangs.length === 0}
            >
              {cabangs.length === 0 && (
                <option value="">Tidak ada cabang</option>
              )}
              {cabangs.map((cabang) => (
                <option key={cabang.id} value={cabang.id}>
                  {cabang.nama}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <Chart
          options={options}
          type="area"
          height={300}
          series={absensiCabang.length ? absensiCabang : EMPTY_SERIES}
        />
      </div>
    </div>
  );
};

export default StaticAbsensiPerusahaan;
