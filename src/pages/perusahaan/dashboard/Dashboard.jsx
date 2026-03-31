import React, { useContext } from "react";
import AlertVerification from "../../../components/AlertVerification";
import Card from "../../../components/cards/Card";
import StaticAbsensiPerusahaan from "../../../components/charts/StaticAbsensiPerusahaan";
import PesertaMagangChart from "../../../components/charts/PesertaMagangChart";
import CabangChart from "../../../components/charts/CabangChart";
import StatistikJurnalChart from "../../../components/charts/StatistikJurnalChart";
import StatistikPendaftarChartMini from "../../../components/charts/StatistikPendaftarChartMini";
import Title from "../../../components/Title";
import PrimaryButton from "../../../components/button/PrimaryButton";
import { StatusPerusahaanContext } from "../../../contexts/StatusPerusahaanContext";
import { usePerusahaanDashboardData } from "./hooks/usePerusahaanDashboardData";

const LOCK_MESSAGE =
  "Akses tidak diizinkan. Isi dan lengkapi data diri anda terlebih dahulu.";

const ProfileLockedState = () => (
  <div className="mx-auto flex flex-col items-center justify-center h-full relative">
    <AlertVerification message={LOCK_MESSAGE} />
    <img src="/assets/img/registrasi.png" alt="Isi Data Diri" className="size-96" />
    <PrimaryButton
      to={"/perusahaan/registrasi"}
      icon="bi-arrow-right"
      rounded="rounded-full"
    >
      <span>Isi Data Diri</span>
    </PrimaryButton>
  </div>
);

const Dashboard = () => {
  const { hasProfilPerusahaan } = useContext(StatusPerusahaanContext);
  const { rekap, cabangs, loading, summaryCards } =
    usePerusahaanDashboardData();

  if (!hasProfilPerusahaan) {
    return <ProfileLockedState />;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden mb-3">
      <div className="flex flex-col lg:flex-row gap-5 w-full">
        <div className="flex-[8] w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {summaryCards.map((card) => (
              <Card key={card.label}>
                <p className="text-sm font-semibold text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              </Card>
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
          <Card>
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
    </div>
  );
};

export default Dashboard;
