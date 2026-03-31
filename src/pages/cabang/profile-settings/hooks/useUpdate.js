import { useState } from "react";
import { useApiActions } from "../../../../shared/hooks/requests/useApiActions";
import { profileAdminSchema } from "../fields_&_schema/schema";

export const useUpdateProfileAdminCabang = (refetchProfile) => {
  const [validationErrors, setValidationErrors] = useState({});
  
  const { execute, loading: updating, error: updateError } = useApiActions(
    "/profile/admin-cabang",
    "PUT",
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const updateProfile = async (payload) => {
    setValidationErrors({});

    try {
      const validated = profileAdminSchema.parse(payload);

      const formData = new FormData();
      
      formData.append("nama", validated.nama || "");
      formData.append("email", validated.email || "");
      formData.append("telepon", validated.telepon || "");
      formData.append("deskripsi", validated.deskripsi || "");
      
      if (validated.old_password && validated.new_password) {
        formData.append("old_password", validated.old_password);
        formData.append("new_password", validated.new_password);
        formData.append("confirm_password", validated.confirm_password);
      }
      
      if (validated.avatar && validated.avatar instanceof File) {
        formData.append("avatar", validated.avatar);
      }

      const result = await execute(formData);

      if (refetchProfile) {
        await refetchProfile();
      }

      return result;
    } catch (err) {
      if (
        err?.name === "ZodError" || 
        err?.constructor?.name === "ZodError" ||
        (err?.issues && Array.isArray(err.issues))
      ) {
        const formattedErrors = {};
        const issues = err.issues || err.errors || [];
        
        issues.forEach((error) => {
          const fieldName = error.path?.[0] || error.field;
          if (fieldName) {
            formattedErrors[fieldName] = error.message;
          }
        });
        
        setValidationErrors(formattedErrors);
        throw err;
      }

      if (err?.response?.data?.meta) {
        const meta = err.response.data.meta;
        const backendErrors = {};
        
        Object.keys(meta).forEach((key) => {
          if (key !== 'code' && key !== 'status' && key !== 'message' && Array.isArray(meta[key])) {
            backendErrors[key] = meta[key][0];
          }
        });
        
        if (Object.keys(backendErrors).length > 0) {
          setValidationErrors(backendErrors);
        }
      } else if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }

      throw err;
    }
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  return {
    updateProfile,
    updating,
    updateError,
    validationErrors,
    clearErrors,
  };
};