import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../../helpers/apiClient";

const PROFILE_STATUS_CACHE_KEY = "hasProfilPerusahaan";
const STATUS_ENDPOINT = "/complete/perusahaan";

const toBooleanStatus = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return false;
};

const extractStatus = (payload) => {
  const raw =
    payload?.data?.is_profil_lengkap ??
    payload?.is_profil_lengkap ??
    payload?.data;
  return toBooleanStatus(raw);
};

const readCachedStatus = () => {
  const cached = sessionStorage.getItem(PROFILE_STATUS_CACHE_KEY);
  return cached !== null ? JSON.parse(cached) : null;
};

const writeCachedStatus = (value) => {
  sessionStorage.setItem(PROFILE_STATUS_CACHE_KEY, JSON.stringify(value));
};

export const usePerusahaanProfileStatus = () => {
  const [hasProfilPerusahaan, setHasProfilPerusahaan] = useState(readCachedStatus);
  const [loading, setLoading] = useState(true);

  const syncStatus = useCallback((value) => {
    setHasProfilPerusahaan(value);
    writeCachedStatus(value);
  }, []);

  const refreshStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(STATUS_ENDPOINT);
      const nextStatus = extractStatus(response?.data);
      syncStatus(nextStatus);
      return nextStatus;
    } catch {
      syncStatus(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [syncStatus]);

  const markProfileCompleted = useCallback(() => {
    syncStatus(true);
  }, [syncStatus]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return useMemo(
    () => ({
      hasProfilPerusahaan,
      loading,
      refreshStatus,
      markProfileCompleted,
    }),
    [hasProfilPerusahaan, loading, markProfileCompleted, refreshStatus]
  );
};
