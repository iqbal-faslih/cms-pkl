import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const MentorChart = () => {
  const data = [
    { name: 'UI/UX', value: 25, color: '#3B82F6' },
    { name: 'Web Dev', value: 20, color: '#60A5FA' },
    { name: 'Data Analyst', value: 18, color: '#93C5FD' },
    { name: 'Cyber Security', value: 15, color: '#BFDBFE' },
    { name: 'Public Relations', value: 12, color: '#DBEAFE' },
    { name: 'IT Support', value: 10, color: '#E5E7EB' }
  ];

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-5">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl h-74 bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Jumlah Mentor Per Divisi
        </h2>
        <select className="text-gray-600 border border-white shadow-sm rounded px-2 py-1 text-sm">
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>


      <ResponsiveContainer width="100%" height={205}>
  <PieChart margin={{ top: 1 }}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      innerRadius={28}
      outerRadius={74}
      paddingAngle={2}
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Legend content={renderLegend} />
  </PieChart>
</ResponsiveContainer>
    </div>
  );
};

export default MentorChart;
