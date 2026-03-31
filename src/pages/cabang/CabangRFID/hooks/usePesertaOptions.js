import { useMemo } from "react";
import { useFetch } from "../../../../shared/hooks/requests/useFetch";

export const usePesertaOptions = (isOpen) => {
  const { 
    data: apiData, 
    loading, 
    error, 
    refetch 
  } = useFetch(isOpen ? "/cabang-peserta-magang?per_page=1000" : null);

  const options = useMemo(() => {
    if (!apiData?.data) return [];
    
    return apiData.data.map((p) => ({
      label: p.name, 
      value: p.id,
    }));
  }, [apiData]);

  return { 
    options, 
    loading, 
    error, 
    refetch 
  };
};