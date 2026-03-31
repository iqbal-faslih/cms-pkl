import { useState, useCallback, useEffect } from "react";
import { getPesertaDetail } from "../../../helpers/apiClient";
import {
  mapPesertaData,
  DEFAULT_COVER,
  DEFAULT_PROFILE,
} from "../../../helpers/siswa/pesertaDataHelper";

const usePesertaData = () => {
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE);
  const [cv, setCv] = useState(null);
  const [suratPernyataan, setSuratPernyataan] = useState(null);
  const [cvTanggal, setCvTanggal] = useState("");
  const [suratPernyataanTanggal, setSuratPernyataanTanggal] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const detailResponse = await getPesertaDetail();
      const fetchedData = detailResponse?.data?.data || null;

      setRawData(fetchedData);

      const processed = mapPesertaData(fetchedData, [], []);
      if (!processed) return;

      setData(processed.data);
      setProfileImage(processed.profileImage);
      setCoverImage(processed.coverImage);
      setCv(processed.cv);
      setCvTanggal(processed.cvTanggal || "");
      setSuratPernyataan(processed.suratPernyataan);
      setSuratPernyataanTanggal(processed.suratPernyataanTanggal || "");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Gagal mengambil data peserta");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rawData,
    data,
    profileImage,
    setProfileImage,
    coverImage,
    setCoverImage,
    cv,
    cvTanggal,
    suratPernyataan,
    suratPernyataanTanggal,
    loading,
    error,
    refetch: fetchData,
  };
};

export default usePesertaData;
