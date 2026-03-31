import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

import ChartView from "@/shared/components/ChartVIew";
import TableHeader from "@/shared/components/table/TableHeader";
import Table from "@/shared/components/table/Table";
import Button from "@/shared/components/button/Button";
import Search from "@/shared/components/Search";
import FilterDropButton from "@/shared/components/button/FilterDrop";
import SortButton from "@/shared/components/button/Sort";
import Pagination from "@/shared/components/Pagination";

import { absensiColumns } from "@/shared/config/Cabang/absensiColumns";
import { absensiSortOptions } from "@/shared/config/Cabang/absensiSortOptions";
import { defaultStatusFilter } from "@/shared/config/Cabang/absensiDefaultFilter";
import { useAbsensiCabang } from "../../../src/hooks/useAbsensiCabang.js";
import ExportButton from "../../ExportButton.jsx";
import axios from "axios";

export default function AbsensiCabang() {
  const {
    absensiList,
    loading,
    statCards,
    pagination,
    filters,
    applySearch,
    applyDateFilter,
    applyStatusFilter,
    resetStatusFilter,
    applySort,
    handlePageChange,
    handlePerPageChange,
    refetch,
    getStatusFilterObject,
  } = useAbsensiCabang();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  const miniChartData = [30, 40, 35, 50, 49, 60, 70, 91, 125];

  useEffect(() => {
    const statusObj = getStatusFilterObject();
    setStatusFilter(statusObj);
  }, [getStatusFilterObject]);

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    applySearch(text);
  };

  const handleStatusChange = (statusObj) => {
    setStatusFilter(statusObj);
    applyStatusFilter(statusObj);
  };

  const handleSortChange = (value) => {
    const [field, direction] = value.split("_");
    applySort(field, direction);
  };
  const handleExport = async (type) => {
    try {
      const endpoint =
        type === "excel"
          ? "/cabang/export/excel"
          : "/cabang/export/pdf";

      const filename =
        type === "excel"
          ? "Data_Absensi.xlsx"
          : "Data_Absensi.pdf";

      const response = await axios.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("EXPORT ERROR:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            color={item.color}
            icon={item.icon}
            chartMiniData={miniChartData}
          />
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl p-10 shadow">
        <TableHeader
          config={{
            title: "Pendataan Absensi",
            subtitle: "Kelola data dengan lebih fleksibel",
            subtitleColor: "text-[#15bf98] text-xs",
            top: {
              left: [
                <Search
                  key="search"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />,
              ],
              right: [
                <SortButton
                  key="sort"
                  labelText="Sort by:"
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
                  dropdownClassName="w-40"
                  options={absensiSortOptions}
                  onSelect={handleSortChange}
                />,
                <ExportButton key="export" className="!px-3.5 !py-2 !bg-[#00c8b3] !text-white !rounded-lg !text-sm !border-0" onExport={handleExport} />,
                <FilterDropButton
                  key="filter"
                  label="Filter"
                  width="w-96"
                  title="Filter"
                  showDateFilter={true}
                  dateLabel="Tanggal Pembuatan"
                  content={{
                    render: (props) => {
                      const Checkbox = props.DefaultCheckbox;

                      return (
                        <div className="flex flex-col gap-3">
                          <p className="text-sm font-semibold">Status Kehadiran</p>
                          <Checkbox
                            label="Hadir"
                            checked={statusFilter.Hadir}
                            onChange={() =>
                              handleStatusChange({
                                ...statusFilter,
                                Hadir: !statusFilter.Hadir,
                              })
                            }
                          />
                          <Checkbox
                            label="Alpa"
                            checked={statusFilter.Alpa}
                            onChange={() =>
                              handleStatusChange({
                                ...statusFilter,
                                Alpa: !statusFilter.Alpa,
                              })
                            }
                          />
                          <Checkbox
                            label="Terlambat"
                            checked={statusFilter.Terlambat}
                            onChange={() =>
                              handleStatusChange({
                                ...statusFilter,
                                Terlambat: !statusFilter.Terlambat,
                              })
                            }
                          />
                          <Checkbox
                            label="Izin"
                            checked={statusFilter.Izin}
                            onChange={() =>
                              handleStatusChange({
                                ...statusFilter,
                                Izin: !statusFilter.Izin,
                              })
                            }
                          />
                          <Checkbox
                            label="Sakit"
                            checked={statusFilter.Sakit}
                            onChange={() =>
                              handleStatusChange({
                                ...statusFilter,
                                Sakit: !statusFilter.Sakit,
                              })
                            }
                          />
                        </div>
                      );
                    },
                    onApply: ({ dateFrom, dateTo }) => {
                      applyDateFilter(dateFrom, dateTo);
                    },
                    onReset: () => {
                      resetStatusFilter();
                      setStatusFilter(defaultStatusFilter);
                    },
                  }}
                />,
              ],
            },
          }}
        />

        <div className="w-full overflow-x-auto">
          <Table
            config={{ columns: absensiColumns }}
            data={absensiList}
            loading={loading}
          />
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.per_page)}
            onPageChange={handlePageChange}
            itemsPerPage={pagination.per_page}
            totalItems={pagination.total}
            onItemsPerPageChange={handlePerPageChange}
            label="absensi"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon, chartMiniData }) {
  return (
    <div
      className="p-5 rounded-xl shadow-sm flex items-start justify-between relative overflow-hidden 
             h-[130px] md:h-[140px]"
      style={{ backgroundColor: `${color}15` }}
    >
      <div className="flex items-center gap-4 z-10 relative">
        <div
          className="flex items-center justify-center rounded-full w-10 h-10 md:w-11 md:h-11"
          style={{ backgroundColor: color }}
        >
          <img src={icon} className="w-6 h-6" alt={`${title} icon`} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-gray-900 font-semibold text-[16px] leading-tight">
            {title}
          </h2>
          <p className="text-[14px] font-semibold text-[#407AED]">{value}</p>
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
          data={[
            {
              name: "Data",
              data: chartMiniData,
            },
          ]}
          height={120}
          width="100%"
          plain={true}
        />
      </div>
    </div>
  );
}
