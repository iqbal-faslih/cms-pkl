import { useFetch } from "../shared/hooks/requests/useFetch";

export const useProfileAccount = () => {
  const { data, loading, error, refetch } = useFetch("/profile/superadmin");

  return {
    profile: data,
    profileLoading: loading,
    profileError: error,
    refetchProfile: refetch,
  };
};
