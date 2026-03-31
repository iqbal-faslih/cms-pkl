import React from "react";
import Card from "./Card";
import { dashboardDummy } from "@/shared/dummy/Mentor/DashboardDummy";

const DivisiInfoCard = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-4 w-full auto-rows-fr">
      {dashboardDummy.divisi.map((item, index) => (
        <Card
          key={index}
          title={item.title}
          count={item.count}
          color={item.color}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default DivisiInfoCard;