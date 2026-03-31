import React, { useRef, useState } from "react";
import Form from "@/shared/components/Form";
import { AdminFields } from "@/shared/fields/perusahaan/dashboard/Admin";
import { useNavigate } from "react-router-dom";
import { AdminSchema } from "@/schema/perusahaan/AdminSchema";
import { Validate } from "@/shared/helpers/validator";

const AdminForm = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const layout = [
    ["nama", "fotoAdmin"],
    ["noHp", "fotoCover"],
    ["password", "devisi"],
    ["deskripsi"],
  ];

  const handleSubmit = (formData) => {
    const validation = Validate(AdminSchema, formData);
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
        <h2 className="font-semibold text-lg">Tambah Admin</h2>
        <p className="text-sm text-[#304FFE]">Tambah data admin baru</p>
      </div>

      <Form
        ref={formRef}
        fields={AdminFields}
        errors={errors}
        layout={layout}
        showSubmitButton={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminForm;