import { useState, useEffect } from "react";
import axios from "axios";

const useCabangDetail = () => {
  const [dataCabang, setDataCabang] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCabangData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cabang-detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const cabang = res.data.data[0];
      setDataCabang(cabang);

      const logo = cabang.foto.find((f) => f.type === "logo");
      const cover = cabang.foto.find((f) => f.type === "profil_cover");

      setLogoImage(logo ? `${import.meta.env.VITE_API_URL_FILE}/storage/${logo.path}` : null);
      setCoverImage(cover ? `${import.meta.env.VITE_API_URL_FILE}/storage/${cover.path}` : null);
      setError(null);
    } catch (err) {
      console.error("Gagal fetch data cabang", err);
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabangData();
  }, []);

  return { dataCabang, logoImage, coverImage, loading, error, refetch: fetchCabangData };
};

export default useCabangDetail;