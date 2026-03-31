import React, { useState, useMemo } from 'react';

const statusItems = [
    { name: 'Semua', value: 'semua', color: 'text-blue-500' },
    { name: 'Belum Dikerjakan', value: 'belum dikerjakan', color: 'text-red-500' },
    { name: 'Dalam Proses', value: 'dalam proses', color: 'text-yellow-500' },
    { name: 'Selesai', value: 'selesai', color: 'text-green-500' },
];

const StatusFilter = ({ onFilterChange, allRevisi = [] }) => {
    const [activeFilter, setActiveFilter] = useState('semua');

    const statusCounts = useMemo(() => {
    return {
      'semua': allRevisi.length,
      'belum dikerjakan': allRevisi.filter(r => r.status === 'belum dikerjakan').length,
      'dalam proses': allRevisi.filter(r => r.status === 'dalam proses').length,
      'selesai': allRevisi.filter(r => r.status === 'selesai').length,
    };
  }, [allRevisi]);

    const handleFilterClick = (value) => {
        setActiveFilter(value);
        onFilterChange(value);
    };

    return (
        <div className="flex space-x-6 text-sm font-medium">
            {statusItems.map((item) => (
                <button
                    key={item.value}
                    onClick={() => handleFilterClick(item.value)}
                    className="relative pb-2"
                >
                    <span className={`transition-colors duration-200 ${activeFilter === item.value ? item.color : 'text-gray-500'}`}>
                        {item.name}
                    </span>
                    <span
                        className={`ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full text-xs font-bold text-white 
                        ${activeFilter === item.value ? item.color.replace('text', 'bg') : 'bg-gray-400'}`}
                    >
                        {statusCounts[item.value]}
                    </span>
                    <span
                        className={`absolute bottom-0 left-0 h-1 w-full rounded-full transition-colors duration-200 ${
                            activeFilter === item.value ? item.color.replace('text', 'bg') : 'bg-transparent'
                        }`}
                    ></span>
                </button>
            ))}
        </div>
    );
};

export default StatusFilter;