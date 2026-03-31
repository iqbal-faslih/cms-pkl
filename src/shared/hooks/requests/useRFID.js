import { useState, useCallback } from "react";
import { useFetch } from "./useFetch";
import { api } from "../../../helpers/apiClient";
import { response } from "../../utils/response";

export const useRFID = (params = {}) => {
  // Build query string from params
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `/api/cabang-rfid?${queryString}` : "/api/cabang-rfid";

  const { data, loading: fetchLoading, error: fetchError, refetch } = useFetch(url);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const createRFID = useCallback(async (rfidData) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const res = await api.post("/api/cabang-rfid", rfidData);
      refetch(); // Refresh the list after creation
      return { success: true, data: response(res) };
    } catch (err) {
      setCreateError(err);
      return { success: false, error: err };
    } finally {
      setCreateLoading(false);
    }
  }, [refetch]);

  const updateRFID = useCallback(async (id, rfidData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await api.post(`/api/cabang-rfid/${id}`, rfidData);
      refetch(); // Refresh the list after update
      return { success: true, data: response(res) };
    } catch (err) {
      setUpdateError(err);
      return { success: false, error: err };
    } finally {
      setUpdateLoading(false);
    }
  }, [refetch]);

  const deleteRFID = useCallback(async (id) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await api.delete(`/api/cabang-rfid/${id}`);
      refetch(); // Refresh the list after deletion
      return { success: true, data: response(res) };
    } catch (err) {
      setDeleteError(err);
      return { success: false, error: err };
    } finally {
      setDeleteLoading(false);
    }
  }, [refetch]);

  return {
    data,
    loading: fetchLoading,
    error: fetchError,
    refetch,
    createRFID,
    createLoading,
    createError,
    updateRFID,
    updateLoading,
    updateError,
    deleteRFID,
    deleteLoading,
    deleteError,
  };
};
