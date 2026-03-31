import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { monthCategories } from "../../components/charts/dummyData";
import axios from "axios";

const MagangChart = ({ cabangs = [] }) => {
  const [selectedCabangId, setSelectedCabangId] = useState(
    cabangs?.[0]?.id || ""
  );

  const [pesertaMagang, setPesertaMagang] = useState({
    aktif: [],
    alumni: [],
  });

  useEffect(() => {
    if (cabangs.length > 0 && !selectedCabangId) {
      setSelectedCabangId(cabangs[0].id);
    }
  }, [cabangs, selectedCabangId]);

  useEffect(() => {
    const getPesertaRekap = async () => {
      if (!selectedCabangId) return;

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/perusahaan/rekap/peserta/${selectedCabangId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payload = response.data?.data ?? response.data ?? {};
        const aktif = Array.isArray(payload?.aktif)
          ? payload.aktif
          : Array.isArray(payload?.data_aktif)
          ? payload.data_aktif
          : [];
        const alumni = Array.isArray(payload?.alumni)
          ? payload.alumni
          : Array.isArray(payload?.data_alumni)
          ? payload.data_alumni
          : [];

        setPesertaMagang({ aktif, alumni });
      } catch (error) {
        console.error("Error fetching peserta rekap:", error);
        setPesertaMagang({ aktif: [], alumni: [] });
      }
    };

    getPesertaRekap();
  }, [selectedCabangId]);

  const series = [
    {
      name: "Aktif",
      data: pesertaMagang.aktif,
    },
    {
      name: "Alumni",
      data: pesertaMagang.alumni,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#2563eb", "#bfdbfe"],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: "25%",
      },
    },
    xaxis: {
      categories: monthCategories,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 5,
    },
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Jumlah Peserta Magang Per Cabang
        </h2>

        <select
          className="border border-gray-300/50 rounded-lg px-2 py-0.5 text-sm text-gray-500 focus:outline-none shadow-sm"
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

      <Chart options={options} series={series} type="bar" height={370} />
    </div>
  );
};

export default MagangChart;
