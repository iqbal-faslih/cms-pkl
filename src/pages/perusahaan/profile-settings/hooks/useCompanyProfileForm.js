import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Validate } from "@/shared/helpers/validator";
import { uploadSingleFile } from "@/shared/utils/uploadUtils";
import { showConfirmAlert } from "@/helpers/sweetAlertHelper";
import { useApiActions } from "@/shared/hooks/requests/useApiActions";
import { companySchema } from "@/schema/perusahaan/CompanySchema";
import { mapFormToApiPayload } from "../helpers/mappedData";
import {
  DOCUMENT_FIELD_NAMES,
  PROFILE_UPDATE_URL,
  resolveDocumentApiField,
} from "../helpers/profileDocumentHelpers";
import { useUnsavedChangesGuard } from "./useUnsavedChangesGuard";

const buildSavingDocsState = (pendingDocs) =>
  Object.keys(pendingDocs).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

export const useCompanyProfileForm = ({ data, refetch, onProfileUpdated }) => {
  const { execute: updatePerusahaan } = useApiActions("/perusahaan/profile", "POST", {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [pendingDocs, setPendingDocs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [savingDocs, setSavingDocs] = useState({});

  useUnsavedChangesGuard(isEditing && !isSaving);

  const formSignature = useMemo(
    () =>
      JSON.stringify({
        id: formData?.id,
        nama: formData?.nama,
        email: formData?.email,
        telepon: formData?.telepon,
        alamat: formData?.alamat,
        provinsi: formData?.provinsi,
        kota: formData?.kota,
        kecamatan: formData?.kecamatan,
        kode_pos: formData?.kode_pos,
      }),
    [formData]
  );

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(data);
    }
  }, [data]);

  const handleEditDocument = useCallback(async ({ docKey, apiKey }) => {
    try {
      const result = await uploadSingleFile({
        validation: {
          maxSize: 5 * 1024 * 1024,
          allowedTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/pdf",
          ],
        },
        returnFile: true,
      });
      if (!result?.file) return;

      const targetApiKey = apiKey || resolveDocumentApiField(docKey);
      const localPreviewUrl = URL.createObjectURL(result.file);

      setPendingDocs((prev) => ({
        ...prev,
        [docKey]: {
          file: result.file,
          apiKey: targetApiKey,
          previewUrl: localPreviewUrl,
        },
      }));
      setFormData((prev) => ({
        ...prev,
        [docKey]: {
          url: localPreviewUrl,
          type: result.file.type || "",
          name: result.file.name || "",
        },
      }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSubmit = useCallback(
    async (newData) => {
      if (!isEditing) {
        setIsEditing(true);
        return;
      }

      const validation = Validate(companySchema, newData);
      if (Object.keys(validation).length > 0) {
        setErrors(validation);
        return;
      }

      try {
        setIsSaving(true);
        setSavingDocs(buildSavingDocsState(pendingDocs));

        const payload = mapFormToApiPayload(newData);
        const formDataPayload = new FormData();
        formDataPayload.append("_method", "PUT");

        Object.entries(payload).forEach(([key, value]) => {
          if (!DOCUMENT_FIELD_NAMES.has(key) && value !== undefined && value !== null) {
            formDataPayload.append(key, value);
          }
        });

        Object.values(pendingDocs).forEach((doc) => {
          if (!doc?.apiKey || !doc?.file) return;
          formDataPayload.append(doc.apiKey, doc.file);
        });

        await updatePerusahaan(formDataPayload, {
          url: PROFILE_UPDATE_URL,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await refetch();
        await onProfileUpdated?.();
        setIsEditing(false);
        setPendingDocs({});
        setErrors({});
        toast.success("Data perusahaan berhasil diperbarui");
      } catch (err) {
        console.error("error", err?.message);
        toast.error(err?.response?.data?.message || "Gagal memperbarui data perusahaan");
      } finally {
        setIsSaving(false);
        setSavingDocs({});
      }
    },
    [isEditing, onProfileUpdated, pendingDocs, refetch, updatePerusahaan]
  );

  const handleCancel = useCallback(async () => {
    const confirm = await showConfirmAlert(
      "Batalkan perubahan?",
      "Perubahan yang belum disimpan akan hilang.",
      "Ya, batalkan"
    );
    if (!confirm.isConfirmed) return;

    setFormData(data || {});
    setPendingDocs({});
    setSavingDocs({});
    setIsEditing(false);
    setErrors({});
  }, [data]);

  return {
    isEditing,
    setIsEditing,
    formData,
    errors,
    previewData,
    setPreviewData,
    showPreview,
    setShowPreview,
    pendingDocs,
    isSaving,
    savingDocs,
    formSignature,
    handleEditDocument,
    handleSubmit,
    handleCancel,
  };
};
