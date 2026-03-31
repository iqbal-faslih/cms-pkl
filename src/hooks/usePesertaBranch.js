import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const usePesertaBranch = () => {
  const role =
    String(localStorage.getItem("role") || sessionStorage.getItem("role") || "").toLowerCase();
  const scope = role === "cabang" ? "cabang" : "perusahaan";
  const [dataPendaftaran, setDataPendaftaran] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        Swal.fire({
          title: "Memuat data...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading(),
        });

        const [pesertaRes, divisiRes] = await Promise.all([
          axios.get(`${apiUrl}/peserta-by-cabang`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${apiUrl}/${scope}/divisi`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (pesertaRes.data.status === "success") {
          setDataPendaftaran(pesertaRes.data.data);
        }

        if (divisiRes.data.data) {
          const divisiList = divisiRes.data.data.map((d) => d.nama);
          setDivisiOptions(divisiList);
        }

        setStatusOptions(["Belum Aktif", "Aktif", "Alumni"]);
        setError(null);
        Swal.close();
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError(err.message || "Gagal memuat data");
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal memuat data peserta",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, scope, token]);

  return { dataPendaftaran, divisiOptions, statusOptions, loading, error };
};

export default usePesertaBranch;
