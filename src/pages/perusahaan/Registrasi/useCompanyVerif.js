import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@/shared/hooks/requests/useFetch";

export const useCompanyVerification = () => {
  const navigate = useNavigate();

  const { data: verified } = useFetch("/perusahaan/detail");

  useEffect(() => {
    if (verified === "true") {
      navigate("/perusahaan/dashboard");
    }
  }, [verified, navigate]);

  return { verified };
};
