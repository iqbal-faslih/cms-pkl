import React, { useState, useRef, useEffect } from "react";
import TableHeader from "../../../shared/components/table/TableHeader";
import DataTable from "../../../shared/components/table/Table";
import Card from "../../../components/cards/Card";
import Button from "../../../components/Button";
import SortButton from "../../../shared/components/button/Sort";
import FilterDropButton from "../../../shared/components/button/FilterDrop";
import { pesertaConfig as ConfigData } from "./config";
import { useDaftarPesertaMentor } from "@/hooks/useDaftarPesertaMentor";
import { useLoader } from "@/hooks/useLoader";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import { subscribeError } from "@/utils/errorUtils";
import { useNavigate } from "react-router-dom";

const PesertaMentorPage = () => {
  const {
    data,
    loading,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    handlePageChange,
    sortOption,
    setSortOption,
    selectedFilters,
    toggleFilter,
    refetch,
    applyFilters,
    resetFilters,
    searchTerm,
    setSearchTerm,
  } = useDaftarPesertaMentor({ itemsPerPage: 10 });

  const { showSkeleton } = useLoader({ loading });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const isErrorOpenRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeError((message) => {
      if (isErrorOpenRef.current) return;
      isErrorOpenRef.current = true;
      setErrorMessage(message);
    });
    return unsubscribe;
  }, []);

  const pesertaConfig = ConfigData(searchTerm, setSearchTerm);

  const tempConfig = {
    ...pesertaConfig,
    headerConfig: {
      ...pesertaConfig.headerConfig,
      top: {
        ...pesertaConfig.headerConfig.top,
        right: pesertaConfig.headerConfig.top.right.map((item) => {
          if (item === "SORT_BUTTON") {
            return (
              <SortButton
                key="sort-btn"
                labelText="Sort by:"
                value={sortOption}
                onSelect={(val) => setSortOption(val)}
              />
            );
          }

          if (item === "FILTER_BUTTON") {
            return (
              <FilterDropButton
                key="filter-btn"
                label="Filter"
                showDateFilter
                dateLabel="Tanggal Pembuatan"
                content={{
                  render: ({ close, DefaultCheckbox }) => (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Progress</p>
                      <DefaultCheckbox
                        label="Selesai"
                        checked={selectedFilters.includes("Selesai")}
                        onChange={() => toggleFilter("Selesai")}
                      />
                      <DefaultCheckbox
                        label="Dikerjakan"
                        checked={selectedFilters.includes("Dikerjakan")}
                        onChange={() => toggleFilter("Dikerjakan")}
                      />
                    </div>
                  ),
                  onApply: ({ dateFrom, dateTo }) => {
                    applyFilters({ dateFrom, dateTo });
                    close();
                  },
                  onReset: () => {
                    resetFilters();
                    close();
                  },
                }}
              />
            );
          }

          return item;
        }),
      },
    },
  };

  const handleDetail = (row) => {
    navigate(`${row.originalId}/detail`)
  };

  const renderSkeletonRows = () =>
    Array(itemsPerPage)
      .fill(0)
      .map((_, idx) => (
        <tr key={idx} className="animate-pulse bg-gray-100">
          {tempConfig.tableConfig.columns.map((col, cIdx) => (
            <td key={cIdx} className="h-6 px-4 py-2">
              <div className="bg-gray-300 h-4 rounded w-full" />
            </td>
          ))}
        </tr>
      ));

  return (
    <>
      <Card className="rounded-2xl">
        <TableHeader config={tempConfig.headerConfig} />

        {showSkeleton ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {tempConfig.tableConfig.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`px-4 py-2 text-left ${col.headerClassName}`}
                    >
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
            config={{
              ...tempConfig.tableConfig,
              columns: tempConfig.tableConfig.columns.map((col) => {
                if (col.key === "actions") {
                  return {
                    ...col,
                    render: (_, row) => (
                      <Button
                        onClick={() => handleDetail(row)}
                        className="bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-1.5 px-4 text-white rounded-md text-sm transition duration-300 ease-in-out"
                      >
                        LIHAT DETAIL
                      </Button>
                    ),
                  };
                }
                return col;
              }),
            }}
            data={data}
            pagination={{
              currentPage,
              totalPages,
              itemsPerPage,
              totalItems,
              onPageChange: handlePageChange,
              label: "peserta",
            }}
            loading={loading}
          />
        )}
      </Card>

      {errorMessage && (
        <ErrorOverlay
          message={errorMessage}
          onRetry={() => {
            isErrorOpenRef.current = false;
            setErrorMessage(null);
            refetch?.();
          }}
        />
      )}
    </>
  );
};

export default PesertaMentorPage;