import { useApiActions } from "@/shared/hooks/requests/useApiActions";

export const useGantiDivisi = (idUser) => {
  const url = `/mentor-manage-peserta/update-divisi-mentor/${idUser}`;
  const { data, loading, error, execute } = useApiActions(url, "PUT");

  const GantiDivisi = async ({ id_divisi, id_mentor }) => {
    return await execute({ id_divisi, id_mentor });
  };

  return { data, loading, error, GantiDivisi };
};