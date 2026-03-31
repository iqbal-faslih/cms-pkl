import { useState, useEffect, useCallback } from "react";
import { api } from "../../helpers/apiClient";

const useKelolaCabang = (id) => {
  const [cabang, setCabang] = useState(null);
  const [rekap, setRekap] = useState(null);
  const [jamKerjaToday, setJamKerjaToday] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/perusahaan/manage-cabang/${id}`);

      const res = data?.data;

      setCabang(res?.cabang ?? null);
      setRekap(res?.rekap?.[0] ?? null);
      setJamKerjaToday(res?.jam_kerja_today ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    cabang,
    rekap,
    jamKerjaToday,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useKelolaCabang;
