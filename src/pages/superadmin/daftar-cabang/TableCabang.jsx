import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import { DaftarCabangConfig } from "@/shared/config/Superadmin/DaftarCabangConfig";
import { useDaftarCabang } from "./hooks/useDaftarCabang";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";

const DaftarCabang = () => {
  const [showError, setShowError] = useState(false);

  const { isInactive } = useOutletContext();

  const {
    data,
    loading,
    error,
    searchTerm,
    sortOption,
    setSearchTerm,
    selectedFilters,
    toggleFilter,
    applyFilters,
    setSortOption,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
    resetFilters,
    refetch,
  } = useDaftarCabang({ itemsPerPage: 10, searchDelay: 500 });

  const filterState = {
    selected: selectedFilters,
    toggle: toggleFilter,
    apply: applyFilters,
    reset: resetFilters,
  };

  const modalActions = {
    currentSort: sortOption,
    setSortValue: setSortOption,
  };

  const config = DaftarCabangConfig(
    filterState,
    searchTerm,
    setSearchTerm,
    modalActions
  );

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  return (
    <div className={isInactive ? "opacity-30 pointer-events-none" : ""}>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <TableHeader config={config.headerConfig} />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : data?.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">
              {searchTerm
                ? `Tidak ada hasil untuk "${searchTerm}"`
                : "Tidak ada data cabang"}
            </div>
          </div>
        ) : (
          <DataTable
            config={config.tableConfig}
            data={data}
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

      <ErrorOverlay
        open={showError}
        message={error?.message || "Gagal mengambil data"}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};

export default DaftarCabang;
