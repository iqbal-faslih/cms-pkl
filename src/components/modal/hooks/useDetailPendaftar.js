import { useEffect, useMemo, useState } from "react";
import { useFetch } from "../../../shared/hooks/requests/useFetch";
import {
  resolveDetailData,
  resolveLowonganLabel,
} from "../helpers/detailPendaftarHelper";

export const useDetailPendaftar = ({ isOpen, data }) => {
  const [showError, setShowError] = useState(false);
  const id = data?.id;
  const role = String(
    localStorage.getItem("role") || sessionStorage.getItem("role") || ""
  ).toLowerCase();
  const approvalScope = role === "cabang" ? "cabang" : "perusahaan";

  const {
    data: detailResponse,
    loading,
    error,
    refetch,
  } = useFetch(isOpen && id ? `/${approvalScope}/approval/daftar-detail/${id}` : null);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const detail = useMemo(() => {
    const resolved = resolveDetailData(detailResponse);
    const fallbackProfile =
      data?.profilePicture || data?.profil || data?.image || "";

    return {
      ...resolved,
      profil: resolved?.profil || fallbackProfile,
    };
  }, [detailResponse, data]);
  const berkas = detail?.berkas || [];
  const resolvedLowongan = useMemo(() => resolveLowonganLabel(detail), [detail]);

  return {
    loading,
    error,
    refetch,
    showError,
    setShowError,
    detail,
    berkas,
    resolvedLowongan,
  };
};
