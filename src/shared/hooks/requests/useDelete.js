import { useState, useCallback } from "react";
import { api } from "../helpers/apiClient";
import { response } from "../../utils/response";

export default function useDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(url, options);
      return { success: true, data: response(res) };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteData, loading, error };
}
