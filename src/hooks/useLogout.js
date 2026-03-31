import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../helpers/apiClient";
import { AuthContext } from "../contexts/AuthContext";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import { toast } from "react-toastify";
import { LOWONGAN_STATUS_CACHE_KEY } from "../helpers/lowonganStatusHelper";
import { clearBrowserStoragePreserving } from "../helpers/storageCleanupHelper";

const useLogout = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

const handleConfirmLogout = useCallback(async () => {
  setIsLoading(true);

  try {
    const response = await logoutUser();

    if (response.status === 200) {
      toast.success("Berhasil logout.");
      navigate("/auth/login", { replace: true, state: { fromLogout: true }, });

      setTimeout(() => {
        clearBrowserStoragePreserving([LOWONGAN_STATUS_CACHE_KEY]);
        setToken(null);
      }, 0);
    }
  } catch (error) {
    toast.error(extractErrorMessage(error));
  } finally {
    setIsLoading(false);
    setIsLogoutModalOpen(false);
  }
}, [navigate, setToken]);


  return {
    openLogoutModal,
    isLogoutModalOpen,
    handleConfirmLogout,
    handleCancelLogout,
    isLoading,
  };
};

export default useLogout;
