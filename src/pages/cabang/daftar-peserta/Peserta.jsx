import TableHeader from "@/shared/components/table/TableHeader";
import { ConfigTableHeaderSiswa } from "@/shared/config/ConfigPesertaBranch";
import DataTable from "@/shared/components/table/Table";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usePeserta } from "./hooks/usePeserta";
import ErrorOverlay from "../../../shared/components/cards/ErrorOverlay";
import Card from "../../../components/cards/Card";
import { AuthContext } from "@/contexts/AuthContext";

export default function PesertaTable() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  
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
  } = usePeserta(userId, { itemsPerPage: 10, searchDelay: 500 });

  const filterState = {
    selected: selectedFilters,
    toggle: toggleFilter,
    apply: applyFilters,
    reset: resetFilters,
  };

  const modalActions = {
    currentSort: sortOption,
    setSortValue: setSortOption,
    navigate: navigate,
  };

  const config = ConfigTableHeaderSiswa(
    filterState,
    searchTerm,
    setSearchTerm,
    modalActions
  );

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  return (
    <Card className="rounded-2xl">
      <TableHeader config={config.headers} />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">
            {searchTerm
              ? `Tidak ada hasil untuk "${searchTerm}"`
              : "Tidak ada data peserta"}
          </div>
        </div>
      ) : (
        <DataTable
          config={{
            columns: config.columns,
            headerStyle: config.headerStyle,
            cellStyle: config.cellStyle,
          }}
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
    </Card>
  );
}
