import { useState, useCallback, useRef } from "react";
import { api } from "../../../helpers/apiClient";
import { response } from "../../utils/response";
import { emitError } from "@/utils/errorUtils";

export const useApiActions = (url, method = "POST", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const optionsRef = useRef(options);

  const execute = useCallback(
    async (payload = null, extraConfig = {}) => {
      setLoading(true);
      setError(null);

      try {
        const requestUrl = extraConfig.url || url;
        let axiosConfig = {
          ...optionsRef.current,
          ...extraConfig,
        };
        delete axiosConfig.url;

        let res;

        switch (method.toUpperCase()) {
          case "POST":
            res = await api.post(requestUrl, payload, axiosConfig);
            break;

          case "PUT":
            res = await api.put(requestUrl, payload, axiosConfig);
            break;

          case "PATCH":
            res = await api.patch(requestUrl, payload, axiosConfig);
            break;

          case "DELETE":
            res = await api.delete(requestUrl, {
              data: payload,
              ...axiosConfig,
            });
            break;

          default:
            throw new Error("Unsupported HTTP method in useApiActions");
        }

        const parsed = response(res);
        setData(parsed);
        return parsed;
      } catch (err) {
        setError(err);

        emitError(
          err?.response?.data?.message ||
          "Terjadi kesalahan saat memproses permintaan"
        );

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  return { data, loading, error, execute };
};
