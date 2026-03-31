import { useState } from "react";
import { updatePassword } from "../../../helpers/apiClient";

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (data) => {
    setLoading(true);

    try {
      await updatePassword({
        old_password: data.current_password,
        new_password: data.password,
        new_password_confirmation: data.password_confirmation,
      });

      return { success: true };
    } catch (error) {
        console.error("error", error)
      const apiErrors = error?.response?.data?.meta || {};
      throw apiErrors;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdatePassword, loading };
};
