import { useState } from "react";

export const usePasswordModal = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleOpenPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);

  return {
    showPasswordModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  };
};
