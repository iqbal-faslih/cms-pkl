import React, { useRef, useState } from "react";
import Form from "@/shared/components/Form";
import { TambahAdminFields } from "@/shared/components/fields/TambahAdmin";
import { useNavigate } from "react-router-dom";
import { TambahAdminSchema } from "@/schema/cabang/TambahAdminSchema";
import { Validate } from "@/shared/helpers/validator";

const TambahAdminForm = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const layout = [
    ["Nama", "Foto"],
    ["Nomor", "Email"],
    ["Password"],
    ["Description"],
  ];

  const handleSubmit = (formData) => {
    const validation = Validate(TambahAdminSchema, formData);
    setErrors(validation);
  };

  const handleCancel = () => {
    formRef.current?.reset();
    setErrors({});
    navigate(-1);
  };

  return (
    <div className="w-full bg-white p-6 rounded-md">
      <div className="mb-6">
        <h2 className="font-semibold text-[20px]">Edit Admin</h2>
        <p className="text-[13px] text-gray-600">Tambah data admin baru</p>
      </div>

      <Form
        ref={formRef}
        fields={TambahAdminFields}
        errors={errors}
        layout={layout}
        showSubmitButton={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TambahAdminForm;