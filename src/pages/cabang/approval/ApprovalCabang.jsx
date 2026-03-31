import React, { useState, useEffect } from "react";
import TableApprovalCabang from "./components/TableApprovalCabang";
import { useApprovalData } from "./hooks/useApproval";
import ErrorOverlay from "../../../shared/components/cards/ErrorOverlay";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";

export default function ApprovalCabang() {
  const [activeTab, setActiveTab] = useState("pendaftaran");
  const [actionError, setActionError] = useState(null);

  const [showError, setShowError] = useState(false);
  const approveMagangApi = useApiActions("/cabang/approval/approve-magang", "PUT");
  const approveIzinApi = useApiActions("/cabang/approval/approve-izin", "PUT");

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

  const updatePendaftaranStatuses = async (selectedIds, newStatus) => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          approveMagangApi.execute(
            { status: newStatus.toLowerCase() },
            { url: `/cabang/approval/approve-magang/${id}` }
          )
        )
      );

      refetch();
    } catch (err) {
      handleActionError(err);
    }
  };

  const updateIzinStatuses = async (selectedIds, newStatus) => {
    try {
      await Promise.all(
        selectedIds.map(() =>
          approveIzinApi.execute(
            { status: newStatus.toLowerCase() },
            { url: `/cabang/approval/approve-izin` }
          )
        )
      );

      refetch();
    } catch (err) {
      handleActionError(err);
    }
  };

  const handleActionError = (err) => {
    setActionError(
      err?.response?.data?.message || err?.message || "Gagal memperbarui data"
    );
    setShowError(true);
  };

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  return (
    <div className="w-full">
      <TableApprovalCabang
        data={activeTab === "pendaftaran" ? data : []}
        izinData={activeTab === "izin" ? data : []}
        isLoading={loading}
        searchQuery={search}
        setSearchQuery={setSearch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pagination={pagination}
        filterState={filters}
        onUpdatePendaftaranStatuses={updatePendaftaranStatuses}
        onUpdateIzinStatuses={updateIzinStatuses}
      />

      <ErrorOverlay
        open={showError}
        message={actionError || error?.message || "Terjadi kesalahan"}
        onRetry={() => {
          setShowError(false);
          setActionError(null);
          refetch();
        }}
        onClose={() => {
          setShowError(false);
          setActionError(null);
        }}
      />
    </div>
  );
}
