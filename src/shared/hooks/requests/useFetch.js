import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../../../helpers/apiClient";
import { response } from "../../utils/response";
import { emitError } from "@/utils/errorUtils";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const optionsRef = useRef(options);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  optionsRef.current = options;

  const fetchData = useCallback(
    async (signal) => {
      const requestId = ++requestIdRef.current;

      try {
        if (!mountedRef.current) return;

        setLoading(true);
        setError(null);

        const res = await api.get(url, {
          ...optionsRef.current,
          signal,
        });

        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setData(response(res));
      } catch (err) {
        if (err.name === "CanceledError") return;
        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setError(err);

        emitError(
          err?.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        if (mountedRef.current && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [url]
  );

  useEffect(() => {
    if (!url) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    mountedRef.current = true;
    setLoading(true);
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [fetchData, url]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return controller;
  }, [fetchData]);

  return { data, loading, error, refetch };
};
