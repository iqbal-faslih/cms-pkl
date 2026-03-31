import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { dashboardDummy } from "@/shared/dummy/Mentor/DashboardDummy";

const CardProgress = () => {
  const data = dashboardDummy.progress;

  const summary = [
    {
      name: "Revisi",
      total: data.reduce((acc, item) => acc + item.revisi, 0),
      color: "#767C85",
    },
    {
      name: "Proses",
      total: data.reduce((acc, item) => acc + item.proses, 0),
      color: "#306BFF",
    },
    {
      name: "Complete",
      total: data.reduce((acc, item) => acc + item.complete, 0),
      color: "#78C552",
    },
  ];

  return (
    <div className="bg-white p-10 rounded-xl shadow-md w-full h-full flex flex-col">
      <h2 className="text-2xl font-semibold mb-10">
        Progress Project 3 Bulan Terakhir
      </h2>

    <div className="flex-1 flex justify-center gap-10 mr-10">
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={summary} barSize={40}>
        
        <CartesianGrid
            stroke="#374151"
            strokeDasharray="1 5"
        />

        <XAxis
            dataKey="name"
            tick={false}
            axisLine={{ stroke: "#374151", strokeWidth: 1.5 }}
            tickLine={false}
        />

        <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
        />

        <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />

        <Bar dataKey="total" radius={[10, 10, 0, 0]}>
            {summary.map((item, i) => (
            <Cell key={i} fill={item.color} />
            ))}
        </Bar>
        </BarChart>
    </ResponsiveContainer>
    </div>

      <div className="flex justify-center gap-10 mt-6 ml-5">
        {summary.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-4 rounded-md"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-gray-700 text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProgress;
