import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assignUserRole } from "../helpers/apiClient";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import { LOWONGAN_STATUS_CACHE_KEY } from "../helpers/lowonganStatusHelper";
import { clearBrowserStoragePreserving } from "../helpers/storageCleanupHelper";

const useSelectRole = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const idUser = sessionStorage.getItem("id");

 useEffect(() => {
  if (!idUser && !completed) {
    toast.error("Silakan daftar atau login terlebih dahulu.");
    navigate("/auth/register", { replace: true });
  }
}, [idUser, completed, navigate]);

  const handleSelect = (role) => {
    setSelected(role);
  };

  const handleNext = async () => {
    if (!selected) {
      toast.error("Pilih jenis akun terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      await assignUserRole(idUser, selected);

      setCompleted(true); 
      clearBrowserStoragePreserving([LOWONGAN_STATUS_CACHE_KEY]);

      toast.success("Role berhasil dipilih, silakan login kembali.");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
};

  return {
    selected,
    loading,
    handleSelect,
    handleNext,
  };
};

export default useSelectRole;
