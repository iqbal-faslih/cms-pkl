import React, { useState, useMemo } from "react";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { ListPesertaConfig, divisionOptions } from "@/shared/config/Mentor/ListPesertaConfig";
import { dashboardDummy } from "@/shared/dummy/Mentor/DashboardDummy";
import SelectField from "@/shared/components/input/SelectField";
import SortButton from "@/shared/components/button/Sort";
import FilterDropButton from "@/shared/components/button/FilterDrop";

const ListPeserta = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("All");
  const [tempDivision, setTempDivision] = useState("All");
  const [sortValue, setSortValue] = useState(null);

  const filteredData = useMemo(() => {
    let data = dashboardDummy.peserta;

    const q = searchQuery.trim().toLowerCase();
    if (q !== "") {
      data = data.filter((item) =>
        Object.values(item).join("").toLowerCase().includes(q)
      );
    }

    if (selectedDivision !== "All") {
      data = data.filter((item) => item.divisi === selectedDivision);
    }

    return data;
  }, [searchQuery, selectedDivision]);

  const itemsPerPage = 11;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const config = ListPesertaConfig(
    searchQuery,
    setSearchQuery,
    sortValue,
    setSortValue,
    selectedDivision
  );

  const headerConfig = {
    ...config.headerConfig,
    top: {
      ...config.headerConfig.top,
      right: config.headerConfig.top.right.map((item) => {
        if (item === "FILTER_BUTTON") {
          return (
            <FilterDropButton
              key="filter-btn"
              showDateFilter={false}
              width="w-72"
              content={{
                render: ({ close }) => (
                    <SelectField
                      options={divisionOptions}
                      value={tempDivision}
                      onChange={setTempDivision}
                      placeholder="Pilih Divisi"
                      disablePortal={true}
                    />
                ),
                onApply: () => {
                  setSelectedDivision(tempDivision); 
                },
                onReset: () => {
                  setTempDivision("All");
                  setSelectedDivision("All"); 
                },
              }}
            />
          );
        }

        if (item === "SORT_BUTTON") {
          return (
            <SortButton
              key="sort-btn"
              labelText="Sort by:"
              onSelect={(val) => setSortValue(val)}
            />
          );
        }

        return item;
      }),
    },
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-[952px] flex flex-col">
      <TableHeader config={headerConfig} />
      <div className="flex-1 overflow-y-auto">
        <DataTable
          config={config.tableConfig}
          data={paginatedData}
          pagination={{
            currentPage: page,
            totalPages,
            itemsPerPage,
            totalItems: filteredData.length,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default ListPeserta;
