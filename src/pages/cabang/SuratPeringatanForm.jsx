import React, { useRef, useState } from "react";
import Form from "@/shared/components/Form";
import { SuratPeringatanFields } from "@/shared/fields/cabang/SuratPeringatan";
import { useNavigate } from "react-router-dom";
import { SpSchema } from "@/schema/cabang/SpSchema";
import { Validate } from "@/shared/helpers/validator";

const SuratPeringatanForm = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const layout = [
    ["noSurat", "keteranganSp"],
    ["nama", "tanggalSurat"],
    ["sekolah"],
    ["alasanSp"],
  ];

  const handleSubmit = (formData) => {
    const validation = Validate(SpSchema, formData);
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
        <h2 className="font-semibold text-[20px]">Buat Surat Peringatan</h2>
        <p className="text-[13px] text-gray-600">Tambah data Surat Peringatan</p>
      </div>

      <Form
        ref={formRef}
        fields={SuratPeringatanFields}
        errors={errors}
        layout={layout}
        showSubmitButton={true}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default SuratPeringatanForm;