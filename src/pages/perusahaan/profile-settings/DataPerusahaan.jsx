import React, { useMemo } from "react";
import Form from "@/shared/components/Form";
import { documentsConfig, formSections } from "@/shared/dummy/perusahaan/DummyProfile";
import { buildCompanyFields } from "@/shared/components/input/companyFields";
import { DocumentPreviewModal } from "./components/DocumentPreviewModal";
import { usePerusahaan } from "../../../hooks/usePerusahaan";
import { DataPerusahaanSkeleton } from "./components/ProfileSettingsSkeletons";
import { DocumentCard } from "./components/DocumentCard";
import { useCompanyProfileForm } from "./hooks/useCompanyProfileForm";

export default function DataUmumPerusahaan({ onProfileUpdated }) {
  const { data, loading, error, refetch } = usePerusahaan();
  const {
    isEditing,
    formData,
    errors,
    previewData,
    setPreviewData,
    showPreview,
    setShowPreview,
    isSaving,
    savingDocs,
    formSignature,
    handleEditDocument,
    handleSubmit,
    handleCancel,
  } = useCompanyProfileForm({ data, refetch, onProfileUpdated });

  const { fields, layout } = useMemo(() => {
    const getOptions = (fieldName) =>
      formSections
        .flatMap((s) => s.items)
        .find((i) => i.name === fieldName)?.options || [];

    return buildCompanyFields(
      isEditing,
      getOptions,
      documentsConfig,
      (props) => (
        <DocumentCard
          {...props}
          isEditing={isEditing}
          onPreview={(file) => {
            setPreviewData(file);
            setShowPreview(true);
          }}
          onEdit={({ docKey, apiKey }) => handleEditDocument({ docKey, apiKey })}
          isSaving={Boolean(savingDocs[props.documentName])}
        />
      ),
      formData
    );
  }, [formData, handleEditDocument, isEditing, savingDocs, setPreviewData, setShowPreview]);

  if (loading && Object.keys(formData || {}).length === 0) {
    return <DataPerusahaanSkeleton />;
  }
  if (error) {
    return <p className="p-6 text-red-600">Gagal mengambil data perusahaan</p>;
  }

  return (
    <div className="w-full mx-auto rounded-xl bg-white p-8 min-h-screen relative shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Data Perusahaan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Silahkan Lengkapi Data Terlebih Dahulu!
        </p>
      </div>

      <hr className="border-t border-gray-200 my-6" />

      <Form
        key={loading ? "loading" : `form-${isEditing}-${formSignature}`}
        initialData={formData}
        fields={fields}
        layout={layout}
        onSubmit={handleSubmit}
        submitLoading={isSaving}
        showSubmitButton
        errors={errors}
        submitLabel={isEditing ? "Simpan" : "Edit"}
        submitStyle={
          !isEditing
            ? "px-8 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-all shadow-sm ml-auto block"
            : "px-8 py-2 bg-[#3b82f6] text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-all shadow-sm"
        }
        onCancel={isEditing ? handleCancel : undefined}
        cancelStyle="px-8 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all mr-3"
      />
      <DocumentPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        data={previewData}
        onDownload={() => {
          if (!previewData?.fileUrl) return;
          window.open(previewData.fileUrl, "_blank", "noopener,noreferrer");
        }}
      />
    </div>
  );
}
