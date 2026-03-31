import { useApiActions } from "@/shared/hooks/requests/useApiActions";

export const useRfidActions = (editData, deleteData, onCallback) => {
  const { execute: createRfid, loading: isSubmitting, error: errorCreate } = useApiActions("/cabang-rfid", "POST");
  const { execute: updateRfid, loading: isUpdating, error: errorUpdate } = useApiActions(`/cabang-rfid/${editData?.id}`, "PATCH");
  const { execute: deleteRfid, loading: isDeleting, error: errorDelete } = useApiActions(`/cabang-rfid/${deleteData?.id}`, "DELETE");

  const handleCreate = async (formData) => {
    try {
      await createRfid({ id_peserta: formData.peserta_id });
      if (onCallback) onCallback();
      return true;
    } catch (err) { return false; }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateRfid({ rfid_code: formData.rfidSiswa, id_peserta: formData.idPeserta });
      if (onCallback) onCallback();
      return true;
    } catch (err) { return false; }
  };

  const handleDelete = async () => {
    try {
      await deleteRfid();
      if (onCallback) onCallback();
      return true;
    } catch (err) { return false; }
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isSubmitting,
    isUpdating,
    isDeleting,
    // Ekspor semua state error
    actionError: errorCreate || errorUpdate || errorDelete
  };
};