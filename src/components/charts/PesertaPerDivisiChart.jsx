import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";

const PesertaPerDivisiChart = ({ data }) => {
  const [tahun, setTahun] = useState("2025");

  /* 
  const dataMap = {
    "2023": [
      { name: "UI/UX", value: 15 },
      { name: "Web Dev", value: 13 },
      { name: "Data", value: 11 },
      { name: "Cyber Security", value: 9 },
      { name: "PR", value: 7 },
      { name: "IT Support", value: 6 },
    ],
    "2024": [
      { name: "UI/UX", value: 19 },
      { name: "Web Dev", value: 17 },
      { name: "Data", value: 14 },
      { name: "Cyber Security", value: 11 },
      { name: "PR", value: 9 },
      { name: "IT Support", value: 8 },
    ],
    "2025": [
      { name: "UI/UX", value: 21 },
      { name: "Web Dev", value: 18 },
      { name: "Data", value: 16 },
      { name: "Cyber Security", value: 12 },
      { name: "PR", value: 9 },
      { name: "IT Support", value: 8 },
    ],
  };

  const dataPeserta = dataMap[tahun];
  */

  const dataPeserta = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: Number(value) || 0,
    }));
  }, [data]);

  // Custom shape bar (biarkan seperti aslinya)
  const CustomBar = ({ fill, x, y, width, height }) => (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} opacity={0.6} />
      <rect x={x} y={y} width={width} height={2} fill="#5989FF" />
    </g>
  );

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[33px] font-semibold text-slate-900">
          Peserta Magang Per-Divisi
        </h2>

        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="h-[540px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dataPeserta}
          margin={{ top: 6, right: 10, left: -16, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF3" />

          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748B" }} />

          <Tooltip contentStyle={{ fontSize: 12 }} />

          <Bar
            dataKey="value"
            fill="#5989FF"
            barSize={35}
            barCategoryGap="35%"
            shape={<CustomBar />}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PesertaPerDivisiChart;
