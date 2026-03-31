import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";
import { StatusPerusahaanContext } from "../../../contexts/StatusPerusahaanContext";
import { buildCompanySubmitPayload } from "./helpers/companySubmitPayload";

export const useCompanySubmit = () => {
  const navigate = useNavigate();
  const { markProfileCompleted, refreshStatus } = useContext(
    StatusPerusahaanContext
  );

  const { execute, loading, error } = useApiActions(
    "/perusahaan/profile/lengkapi-data",
    "POST"
  );

  const submitCompanyData = async (formData) => {
    const payload = buildCompanySubmitPayload(formData);

    const res = await execute(payload);
    markProfileCompleted();
    await refreshStatus();
    navigate("/perusahaan/dashboard");
    return res;
  };

  return {
    submitCompanyData,
    loading,
    error,
  };
};
