import { useState, useCallback, useMemo } from "react";
import { useFetch } from "./useFetch";
import { api } from "../../../helpers/apiClient";
import { response } from "../../utils/response";
import {
  buildProfileAdminMethodOverridePayload,
  buildProfileAdminPayload,
  PROFILE_ADMIN_ENDPOINTS,
  shouldFallbackProfileAdminUpdate,
} from "./helpers/profileAdminRequestHelper";

const updateProfileAdminRequest = async (formData) => {
  let lastError = null;

  for (let index = 0; index < PROFILE_ADMIN_ENDPOINTS.length; index += 1) {
    const endpoint = PROFILE_ADMIN_ENDPOINTS[index];
    const isLastEndpoint = index === PROFILE_ADMIN_ENDPOINTS.length - 1;

    try {
      return await api.put(endpoint, buildProfileAdminPayload(formData), {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      lastError = error;
      if (!shouldFallbackProfileAdminUpdate(error)) {
        throw error;
      }
    }

    try {
      return await api.post(endpoint, buildProfileAdminMethodOverridePayload(formData), {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      lastError = error;
      if (!shouldFallbackProfileAdminUpdate(error) || isLastEndpoint) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gagal memperbarui profile admin");
};

export const useProfileAdmin = () => {
  const url = "/profile-admin";

  const {
    data: rawData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
  } = useFetch(url);

  const data = useMemo(() => {
    const source =
      rawData?.data && typeof rawData?.data === "object" ? rawData.data : rawData;
    if (!source || typeof source !== "object") return null;

    return {
      ...source,
      nomorHp: source.telepon || source.nomorHp || "",
    };
  }, [rawData]);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateProfile = useCallback(
    async (formData) => {
      setUpdateLoading(true);
      setUpdateError(null);

      try {
        const res = await updateProfileAdminRequest(formData);
        refetch();
        return { success: true, data: response(res) };
      } catch (err) {
        setUpdateError(err);
        return { success: false, error: err };
      } finally {
        setUpdateLoading(false);
      }
    },
    [refetch]
  );

  return {
    data,
    rawData,
    loading: fetchLoading,
    error: fetchError,
    refetch,
    updateProfile,
    updateLoading,
    updateError,
  };
};
