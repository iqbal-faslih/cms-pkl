import React from "react";
import { GreenCard, OrangeCard } from "@/components/cards/CardDetailDashboard";
import { StatistikKehadiranChart } from "@/components/charts/StatistikKehadiranChart";
import { JumlahPesertaChart } from "@/components/charts/JumlahPesertaChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useOutletContext } from "react-router-dom";

const DetailDashboard = () => {
  const { isInactive, companyId } = useOutletContext();
  const { cardData, areaChartData, barChartData, loading, error } = useDashboardData(companyId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {/* Hanya bagian card yang di-disabled dengan efek redup */}
      <div className={`flex flex-col mt-5 gap-6 w-full max-w-full mx-auto px-4 md:px-6 lg:px-8 ${isInactive ? "opacity-30 pointer-events-none" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <GreenCard totalCabang={cardData?.greenCard?.totalCabang} data={cardData?.greenCard?.data} />
          <OrangeCard totalPeserta={cardData?.orangeCard?.totalPeserta} data={cardData?.orangeCard?.data} />
        </div>

        <StatistikKehadiranChart data={areaChartData} />

        <JumlahPesertaChart data={barChartData} />
      </div>
    </div>
  );
};

export default DetailDashboard;
