import { useFetch } from "@/shared/hooks/requests/useFetch";
import { useMemo } from "react";
import { stripHtml } from "../shared/helpers/stripHtml";

export const useProfileAdminCabang = () => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch("/profile/admin-cabang");

  const initialData = useMemo(() => {
    if (!data?.data) return {};
    return {
      ...data.data,
      deskripsi: data?.data?.deskripsi || "",
      avatar: data?.data?.avatar || "",
    };
  }, [data]);

  return {
    data: initialData,
    loading,
    error,
    refetch,
  };
};

export const useProfileCabang = () => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useFetch("/profile/setting-cabang");

  const initialData = useMemo(() => {
    if (!data?.data) return {};
    return {
      ...data.data,
      deskripsi: stripHtml(data.data.deskripsi || ""),
    };
  }, [data]);

  return {
    data: initialData,
    loading,
    error,
    refetch,
  };
};
