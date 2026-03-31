import React, { useState, useRef } from "react";
import Form from "@/shared/components/Form";
import { adminFields } from "@/shared/fields/perusahaan/DataAdminPerusahaan";
import { adminSchema } from "@/schema/perusahaan/DataAdminPerusahaanSchema";
import { Validate } from "@/shared/helpers/validator";
import { useProfileAdmin } from "@/shared/hooks/requests/useProfileAdmin";
import { DataAdminPerusahaanSkeleton } from "./components/ProfileSettingsSkeletons";
import { showConfirmAlert } from "@/helpers/sweetAlertHelper";
import { useUnsavedChangesGuard } from "./hooks/useUnsavedChangesGuard";
import { toast } from "react-toastify";
import {
  buildAdminFieldsByMode,
  buildAdminLayoutByMode,
} from "./helpers/adminProfileViewHelper";
import { normalizeApiFieldErrors } from "@/shared/hooks/requests/helpers/profileAdminRequestHelper";

const extractBackendValidationErrors = (errorResponseData) => {
  const directErrors = errorResponseData?.errors;
  if (directErrors && typeof directErrors === "object") return directErrors;

  const meta = errorResponseData?.meta;
  if (!meta || typeof meta !== "object") return {};

  return Object.fromEntries(
    Object.entries(meta).filter(([key, value]) =>
      !["code", "status", "message"].includes(key) && Array.isArray(value)
    )
  );
};

export default function DataAdminPerusahaan() {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const {
    data: adminData,
    loading,
    error,
    updateProfile,
    updateLoading,
  } = useProfileAdmin();
  useUnsavedChangesGuard(isEditing && !updateLoading);

  if (loading) {
    return <DataAdminPerusahaanSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px] flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!adminData) {
    return <DataAdminPerusahaanSkeleton />;
  }

  const handleSubmit = async (formData) => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const validation = Validate(adminSchema, formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const result = await updateProfile({
      ...formData,
      telepon: formData.nomorHp,
    });

    if (result.success) {
      setErrors({});
      setIsEditing(false);
      toast.success("Data admin perusahaan berhasil diperbarui");
    } else {
      const backendErrors = normalizeApiFieldErrors(
        extractBackendValidationErrors(result?.error?.response?.data)
      );
      if (Object.keys(backendErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }

      toast.error(
        result?.error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data."
      );
    }
  };

  const handleCancel = async () => {
    const confirm = await showConfirmAlert(
      "Batalkan perubahan?",
      "Perubahan yang belum disimpan akan hilang.",
      "Ya, batalkan"
    );
    if (!confirm.isConfirmed) return;

    setIsEditing(false);
    setErrors({});
    formRef.current?.reset?.();
  };

  const fieldsWithMode = buildAdminFieldsByMode(adminFields, isEditing);
  const layout = buildAdminLayoutByMode(isEditing);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">
          Data Admin Perusahaan
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Silahkan Lengkapi Data Terlebih Dahulu!
        </p>
      </div>

      <hr className="border-t border-gray-200 my-6" />

      <Form
        ref={formRef}
        fields={fieldsWithMode}
        initialData={{
          ...adminData,
          password: "",
          passwordBaru: "",
        }}
        layout={layout}
        onSubmit={handleSubmit}
        errors={errors}
        showSubmitButton
        submitLabel={
          isEditing
            ? updateLoading
              ? "Menyimpan..."
              : "Simpan"
            : "Edit"
        }
        onCancel={isEditing ? handleCancel : undefined}
      />
    </div>
  );
}
