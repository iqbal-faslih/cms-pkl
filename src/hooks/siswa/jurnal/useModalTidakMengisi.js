import { useState } from "react";

export const useModalTidakMengisi = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const openModal = (modalData) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setData(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  };
};
