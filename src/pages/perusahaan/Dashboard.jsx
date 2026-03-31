import React, { useContext, useEffect, useState } from "react";
import ActivityChart from "../../components/charts/ActivityChart";
import PerusahaanChart from "../../components/charts/PerusahaanChart";
import Card from "../../components/cards/Card";
import StaticAbsensiPerusahaan from "../../components/charts/StaticAbsensiPerusahaan";
import PesertaMagangChart from "../../components/charts/PesertaMagangChart";
import CabangChart from "../../components/charts/CabangChart";
import StatistikJurnalChart from "../../components/charts/StatistikJurnalChart";
import StatistikPendaftarChartMini from "../../components/charts/StatistikPendaftarChartMini";
import Title from "../../components/Title";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import VerifyCompanyData from "../VerifyCompany";
import { getStatsData } from "@/shared/dummy/Dashboard";

const Dashboard = () => {
  const location = useLocation();
  const { token } = useContext(AuthContext);
  localStorage.setItem("location", location.pathname);

  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rekap, setRekap] = useState([]);
  const [cabangs, setCabangs] = useState([]);

  const getAllCabang = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/cabang?t=${Date.now()}`;

      const res = await axios.get(url, {
        headers: {
          "Cache-Control": "no-store",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 && res.data?.data) {
        setCabangs(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data cabang:", error);
    }
  };

  const checkComplateRegistered = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/detail`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompanyData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getRekap = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/perusahaan/rekap`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRekap(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkComplateRegistered();
    getRekap();
    getAllCabang();
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (!loading && companyData !== "true") {
    return <VerifyCompanyData />;
  }

  return (
    <div className="w-full overflow-hidden mb-3">
      {loading ? (
        <div className="h-screen">
          <div className="w-full h-14 bg-slate-300 border border-slate-200 rounded-lg flex justify-between py-1 px-3 items-center mb-4 animate-pulse">
            <div className="bg-slate-400 w-1/3 h-5 rounded" />
            <div className="bg-slate-400 w-1/6 h-5 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="flex-[8] w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getStatsData(rekap).map((item, index) => (
                <PerusahaanChart
                  key={index}
                  icon={item.icon}
                  value={item.value}
                  color={item.color}
                  title={item.title}
                  seriesData={item.data}
                />
              ))}
            </div>

            <Card className="my-7">
              <StaticAbsensiPerusahaan cabangs={cabangs} />
            </Card>

            <Card>
              <PesertaMagangChart cabangs={cabangs} />
            </Card>
          </div>

          <div className="flex-[3] flex flex-col gap-4">
            <Card className="mt-0">
              <div className="border-b border-slate-400/[0.5] py-3">
                <Title className="ml-5">Statistik Peserta Perusahaan</Title>
              </div>
              <CabangChart peserta={rekap?.peserta} />
            </Card>

            <Card>
              <StatistikJurnalChart cabangs={cabangs} />
            </Card>

            <Card className="px-0 py-2">
              <StatistikPendaftarChartMini cabangs={cabangs} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
