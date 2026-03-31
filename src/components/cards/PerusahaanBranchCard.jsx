import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePerusahaan } from "../../pages/superadmin/manajemen-perusahaan/hooks/usePerusahaan";
import DataTable from "@/shared/components/table/Table";
import TableHeader from "@/shared/components/table/TableHeader";
import { DataManajemenPerusahaan } from "@/shared/config/Superadmin/DataPerusahaanConfig";
import ErrorOverlay from "../../shared/components/cards/ErrorOverlay";

export default function ManajemenPerusahaan() {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

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
  } = usePerusahaan({ itemsPerPage: 10, searchDelay: 500 });

  const filterState = {
    selected: selectedFilters,
    toggle: toggleFilter,
    apply: applyFilters,
    reset: resetFilters,
  };

  const rowState = {};

  const modalActions = {
    currentSort: sortOption,
    setSortValue: setSortOption,
    navigate: navigate,
    refetch: refetch,
  };

  const config = DataManajemenPerusahaan(
    filterState,
    searchTerm,
    setSearchTerm,
    rowState,
    modalActions
  );

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl p-6">
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
              : "Tidak ada data perusahaan"}
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
}
