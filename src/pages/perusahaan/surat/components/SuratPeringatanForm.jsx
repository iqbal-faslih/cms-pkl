import React, { useState } from "react";
import Card from "../../../../components/cards/Card";
import Form from "../../../../shared/components/Form";
import { spFields } from "../schemas/fields";
import { spSchema } from "../schemas/schema";
import { useNavigate } from "react-router-dom";

const SuratPeringatanForm = () => {
  const nav = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (form) => {
    const parsed = spSchema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // TODO: kirim ke backend
    nav("/perusahaan/surat");
  };

  return (
    <Card className="rounded-2xl px-8">
      <h1 className="text-2xl font-semibold">Buat Surat Peringatan</h1>
      <p className="text-gray-700 mb-7">Tambah data surat peringatan</p>

      <Form
        fields={spFields}
        layout={[
          ["nomor-surat", "keterangan-sp"],
          ["nama", "tgl_surat"],
          ["sekolah"],
          ["alasan_sp"],
        ]}
        errors={errors}
        onCancel={() => nav("/perusahaan/surat")}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default SuratPeringatanForm;
