import React from "react";
import ChartView from "../../../shared/components/ChartVIew";
import { sparklineConfig } from "../../../pages/perusahaan/DetailPeserta/config";

const PresensiCard = ({
  icon,
  count,
  title,
  softColor,
  softColor2,
  color,
  chartData,
}) => {
  return (
    <div
      className="px-3 py-4 rounded-2xl relative overflow-hidden h-[150px]"
      style={{ backgroundColor: softColor }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-md p-2"
          style={{ backgroundColor: softColor2 }}
        >
          {React.cloneElement(icon, { size: 30, color })}
        </div>

        <div className="text-xl font-bold" style={{ color }}>
          {count} <span className="text-sm">kali</span>
        </div>
      </div>

      <div className="text-sm font-medium text-gray-400 mt-1">{title}</div>

      <div className="absolute bottom-2 right-2 w-20 h-14 opacity-80">
        <ChartView
          config={{
            ...sparklineConfig,
            options: { ...sparklineConfig.options, colors: [color] },
          }}
          data={[{ data: chartData }]}
          plain={true}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default PresensiCard;
