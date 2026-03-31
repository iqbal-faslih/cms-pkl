import { useNavigate } from "react-router-dom";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";

export const useSubmitCabang = (idPerusahaan) => {
  const navigate = useNavigate();

  const { execute, loading, error } = useApiActions(
    "/perusahaan/manage-cabang",
    "POST",
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const submitCabang = async (formData) => {
    const payload = new FormData();

    payload.append("id_perusahaan", idPerusahaan);

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, value);
      }
    });

    const res = await execute(payload);

    if (res?.meta?.status === "success") {
      navigate(-1);
    }

    return res;
  };

  return { submitCabang, loading, error };
};
