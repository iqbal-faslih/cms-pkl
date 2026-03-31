import React, { useState, useMemo } from "react";
import TableHeader from "../../shared/components/table/TableHeader";
import DataTable from "../../shared/components/table/Table";
import { ManagementCabangConfig } from "../../shared/config/ManagementCabangConfig";
import { dummyAdmin } from "../../shared/dummy/ManagementCabangDummy";

export default function ManagementCabangPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState(null);

  const totalItems = dummyAdmin.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const displayedData = dummyAdmin.slice(start, start + itemsPerPage);
  
  const filterData = useMemo(() => {
    let data = dummyAdmin;

    const q = searchQuery.trim().toLowerCase();
    if (q !== "") {
      data = data.filter((item) =>
        Object.values(item)
          .join("")
          .toLowerCase()
          .includes(q)
      );
    }
    return data;
  }, [searchQuery]);
  
  const config = ManagementCabangConfig(searchQuery, setSearchQuery);

  return (
    <div className="bg-white rounded-2xl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-full lg:max-w-7xl">
        <TableHeader config={config.headerConfig} />
        
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full px-4 sm:px-0">
            <DataTable
              config={config.tableConfig}
              data={displayedData}
              pagination={{
                currentPage,
                totalPages,
                itemsPerPage,
                totalItems,
                onPageChange: setCurrentPage,
                label: "management-cabang",
              }}
            />
          </div>
        </div>
      </div>
      </div>
    );
    }