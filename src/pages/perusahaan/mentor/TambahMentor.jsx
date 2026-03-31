import React from "react";
import Form from "@/shared/components/Form";
import { useTambahMentorForm } from "./hooks/useTambahMentorForm";

const TambahMentor = () => {
  const {
    formRef,
    isEditMode,
    loadingDetail,
    fields,
    initialData,
    errors,
    layout,
    submitLoading,
    handleSubmit,
    handleCancel,
    formVersion,
    emptyForm,
  } = useTambahMentorForm();

  if (isEditMode && loadingDetail) {
    return (
      <div className="w-full bg-white p-6 rounded-md">
        <p className="text-sm text-gray-500">Memuat data mentor...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-md">
      <div className="mb-6">
        <h2 className="font-semibold text-[20px]">
          {isEditMode ? "Edit Akun Mentor" : "Tambah Akun Mentor"}
        </h2>
        <p className="text-[13px] text-gray-600">
          {isEditMode
            ? "Perbarui data akun mentor"
            : "Buat akun mentor baru agar mentor bisa login"}
        </p>
      </div>

      <Form
        key={`mentor-form-${isEditMode ? "edit" : "add"}-${formVersion}`}
        ref={formRef}
        fields={fields}
        initialData={isEditMode ? initialData : emptyForm}
        errors={errors}
        layout={layout}
        submitLoading={submitLoading}
        showSubmitButton={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TambahMentor;
