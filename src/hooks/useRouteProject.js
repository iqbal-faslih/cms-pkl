import { useState, useEffect } from "react";
import { getRouteProject } from "../helpers/apiClient";

const useRouteProject = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getRoutes = async () => {
      try {
        setLoading(true);
        const response = await getRouteProject({ signal });
        setRoutes(response.data.data);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        setError(err.response?.data?.message || "Gagal memuat data route project. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    getRoutes();

    return () => {
      controller.abort();
    };
  }, []);

  return { routes, loading, error };
};

export { useRouteProject };