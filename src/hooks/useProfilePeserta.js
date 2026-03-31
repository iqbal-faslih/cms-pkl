import { useState, useEffect } from "react";
import axios from "axios";

const useProfilePeserta = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/profil-mentor/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("token") ||
                sessionStorage.getItem("token")
              }`,
            },
          }
        );

        // Sesuaikan dengan struktur response backend
        setData(response.data?.data ?? response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);

        const status = err.response?.status;

        setError(
          status === 403
            ? "Akses ditolak"
            : status === 404
            ? "Data tidak ditemukan"
            : err.response?.data?.message || "Gagal mengambil data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return {
    data,
    loading,
    error,
  };
};

export default useProfilePeserta;
