import useModalDetailStore from "../../../stores/useModalDetailStore";

export const useModalDetailJurnal = () => {
  const { isOpen, jurnalData, closeModal, openModal } = useModalDetailStore();

  const handleEdit = (onEdit) => {
    if (onEdit) onEdit(jurnalData);
  };

  return {
    isOpen,
    jurnalData,
    openModal,
    closeModal,
    handleEdit
  };
};
