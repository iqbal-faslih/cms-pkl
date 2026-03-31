import React, { useState, useEffect } from "react";
import TableApproval from "./components/TableApproval";
import { useApprovalData } from "./hooks/useApproval";
import ErrorOverlay from "../../../shared/components/cards/ErrorOverlay";
import { useApprovalActions } from "./hooks/useApprovalActions";

export default function ManajemenApproval() {
  const [activeTab, setActiveTab] = useState("pendaftaran");

  const {
    data,
    loading,
    pagination,
    error,
    search,
    setSearch,
    filters,
    refetch,
  } = useApprovalData(activeTab);

  const {
    actionError,
    showError,
    setShowError,
    updatePendaftaranStatuses,
    updateIzinStatuses,
    isActionLoading,
    closeError,
  } = useApprovalActions({ refetch });

  useEffect(() => {
    if (error) setShowError(true);
  }, [error, setShowError]);

  return (
    <div className="w-full">
      <TableApproval
        data={data}
        isLoading={loading}
        searchQuery={search}
        setSearchQuery={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pagination={pagination}
        filterState={filters}
        onUpdatePendaftaranStatuses={updatePendaftaranStatuses}
        onUpdateIzinStatuses={updateIzinStatuses}
        isActionLoading={isActionLoading}
      />

      <ErrorOverlay
        open={showError}
        message={actionError || error?.message || "Terjadi kesalahan"}
        onRetry={() => {
          closeError();
          refetch();
        }}
        onClose={closeError}
      />
    </div>
  );
}
