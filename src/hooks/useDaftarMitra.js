import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const useDaftarMitra = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      Swal.fire({
        title: "Memuat data...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mitra`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPartners(response.data.data);
      Swal.close();
    } catch (err) {
      console.error("Gagal memuat data mitra:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.message || "Terjadi kesalahan saat memperbarui data",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return { partners, setPartners, loading, fetchAllData };
};

export default useDaftarMitra;