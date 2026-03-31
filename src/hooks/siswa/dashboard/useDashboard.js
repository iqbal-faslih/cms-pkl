import { useState, useEffect, useCallback } from "react";
import { fetchDashboardData } from "../../../helpers/siswa/dashboard/dashboardHelper";
// import { dummyRoute } from "../../../utils/mocks/mockDataRoute";

const useDashboard = () => {
  const [data, setData] = useState({
    kehadiran: null,
    magang: { perusahaan: "-", divisi: "-", sistemMagang: "-" },
    route: [],
    jurnal: [],
    statsData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchDashboardData();
      console.log("✅ useDashboard: Data berhasil diambil:", result);
      setData(result);
    } catch (err) {
      console.error("❌ useDashboard: Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return { data, loading, error, refetch: getData };
};

export default useDashboard;
