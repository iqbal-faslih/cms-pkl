import { useCallback, useState } from "react";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";

const mapStatusToApi = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pending") return "menunggu";
  return normalized;
};

export const useApprovalActions = ({ refetch }) => {
  const [actionError, setActionError] = useState(null);
  const [showError, setShowError] = useState(false);

  const approveMagangApi = useApiActions(
    "/perusahaan/approval/approve-magang",
    "PUT"
  );
  const approveIzinApi = useApiActions("/perusahaan/approval/approve-izin", "PUT");

  const handleActionError = useCallback((error) => {
    setActionError(
      error?.response?.data?.message || error?.message || "Gagal memperbarui data"
    );
    setShowError(true);
  }, []);

  const updatePendaftaranStatuses = useCallback(
    async (selectedIds, newStatus) => {
      try {
        const apiStatus = mapStatusToApi(newStatus);
        await Promise.all(
          selectedIds.map((id) =>
            approveMagangApi.execute(
              { status: apiStatus },
              { url: `/perusahaan/approval/approve-magang/${id}` }
            )
          )
        );

        refetch();
        return true;
      } catch (error) {
        handleActionError(error);
        return false;
      }
    },
    [approveMagangApi, handleActionError, refetch]
  );

  const updateIzinStatuses = useCallback(
    async (selectedIds, newStatus) => {
      try {
        const apiStatus = mapStatusToApi(newStatus);
        await Promise.all(
          selectedIds.map((id) =>
            approveIzinApi.execute(
              { status: apiStatus },
              { url: `/perusahaan/approval/approve-izin/${id}` }
            )
          )
        );

        refetch();
        return true;
      } catch (error) {
        handleActionError(error);
        return false;
      }
    },
    [approveIzinApi, handleActionError, refetch]
  );

  const closeError = useCallback(() => {
    setShowError(false);
    setActionError(null);
  }, []);

  return {
    actionError,
    showError,
    setShowError,
    updatePendaftaranStatuses,
    updateIzinStatuses,
    isActionLoading: approveMagangApi.loading || approveIzinApi.loading,
    closeError,
  };
};
