import React, { useState, useRef, useEffect } from "react";
import { useAbsensi } from "@/hooks/useAbsensiFetch";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { AbsensiConfig } from "@/shared/config/Perusahaan/AbsensiConfig";
import { subscribeError } from "@/utils/errorUtils";
import { useLoader } from "@/hooks/useLoader";
import ChartView from "../../shared/components/ChartVIew";

export default function AbsensiPerusahaan() {
  const {
    absensiList,
    totalItems,
    totalPages,
    totalAbsensi,
    itemsPerPage,
    currentPage,
    loading,
    searchTerm,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    resetFilters,
    sortOption,
    setSortOption,
    handlePageChange,
    refetch,
    handleExport
  } = useAbsensi({ itemsPerPage: 10 });

  const { showSkeleton } = useLoader({ loading });

  const [errorMessage, setErrorMessage] = useState(null);
  const isErrorOpenRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeError((msg) => {
      if (isErrorOpenRef.current) return;
      isErrorOpenRef.current = true;
      setErrorMessage(msg);
    });
    return unsubscribe;
  }, []);

  const filterState = {
    selected: selectedFilters,
    toggle: toggleFilter,
    apply: ({ dateFrom, dateTo }) => applyFilters({ dateFrom, dateTo }),
    reset: resetFilters,
  };

  const config = AbsensiConfig({
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm,
    setSortValue: setSortOption,
    filterState,
    onExport: handleExport,
  });

  const renderSkeletonRows = () =>
    Array(itemsPerPage)
      .fill(0)
      .map((_, idx) => (
        <tr key={idx} className="animate-pulse bg-gray-100">
          {config.tableConfig.columns.map((_, cIdx) => (
            <td key={cIdx} className="h-6 px-4 py-2">
              <div className="bg-gray-300 h-4 rounded w-full" />
            </td>
          ))}
        </tr>
      ));

  return (
    <>
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Absensi"
          value={`${totalAbsensi?.total_absensi ?? 0} Kali`}
          color="#A855F7"
          icon="/assets/icons/absensi/book.png"
        />

        <StatCard
          title="Total Masuk"
          value={`${totalAbsensi?.total_hadir ?? 0} Kali`}
          color="#22C55E"
          icon="/assets/icons/absensi/certificateLogo.png"
        />

        <StatCard
          title="Total Izin/Sakit"
          value={`${totalAbsensi?.total_izin ?? 0} Kali`}
          color="#FB923C"
          icon="/assets/icons/absensi/graduate.png"
        />

        <StatCard
          title="Total Alpa"
          value={`${totalAbsensi?.total_alpha ?? 0} Kali`}
          color="#EC4899"
          icon="/assets/icons/absensi/mens.png"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-md rounded-2xl p-6 mt-5">
        <TableHeader config={config.headerConfig} />

        {showSkeleton ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {config.tableConfig.columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-2 text-left text-gray-500">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderSkeletonRows()}</tbody>
            </table>
          </div>
        ) : (
          <DataTable
            config={config.tableConfig}
            data={absensiList}
            pagination={{
              currentPage,
              totalPages,
              itemsPerPage,
              totalItems,
              onPageChange: handlePageChange,
            }}
          />
        )}
      </div>
    </>
  );
}

/* STAT CARD */
function StatCard({ title, value, color, icon }) {
  const chartMiniData = [1, 4, 2, 7, 3, 9, 7, 12, 8, 14];

  return (
    <div
      className="p-5 rounded-xl shadow-sm flex relative overflow-hidden"
      style={{ backgroundColor: `${color}15`, height: "140px" }}
    >
      <div className="flex flex-col justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: "48px", height: "48px", backgroundColor: color }}
          >
            <img src={icon} className="w-6 h-6" alt={`${title} icon`} />
          </div>

          <div className="flex flex-col">
            <h2 className="text-gray-900 font-semibold text-[16px]">{title}</h2>
            <p className="text-[14px] font-semibold text-[#407AED]">{value}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 w-[55%] opacity-90 pointer-events-none">
        <ChartView
          config={{
            type: "area",
            options: {
              chart: {
                sparkline: { enabled: true },
                animations: { enabled: true },
              },
              colors: [color],
              stroke: { curve: "smooth", width: 2, colors: [color] },
              fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 0.7,
                  opacityFrom: 0.6,
                  opacityTo: 0,
                  gradientToColors: [color],
                  stops: [0, 100],
                },
              },
              tooltip: { enabled: false },
            },
          }}
          data={[{ name: "Data", data: chartMiniData }]}
          height={120}
          width="100%"
          plain
        />
      </div>
    </div>
  );
}
