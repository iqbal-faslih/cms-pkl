import React from "react";
import DivisiInfoCard from "./CardWrapper";
import ListPeserta from "./ListPeserta";
import CardProgress from "./CardProgress";
import CardRiwayat from "./CardRiwayat";

const DashboardMentor = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <DivisiInfoCard />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-h-[80vh]">
        <div className="xl:col-span-2 flex flex-col h-full gap-6">
          <ListPeserta />
        </div>

        <div className="flex flex-col gap-6 h-full">
          <CardProgress />
          <CardRiwayat />
        </div>
      </div>
    </div>
  );
};

export default DashboardMentor;
