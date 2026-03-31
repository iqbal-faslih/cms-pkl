import React, { useRef, useState } from "react";
import Form from "@/shared/components/Form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Validate } from "@/shared/helpers/validator";
import { TambahCabangFields } from "../../shared/fields/cabang/TambahCabang";
import { TambahCabangSchema } from "../../schema/cabang/CabangSchema";
import { useSubmitCabang } from "@/hooks/perusahaan/kelolaCabang/useSubmitCabang";
import { useIndonesiaRegions } from "@/shared/hooks/requests/useRegions";

const CabangForm = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const isEdit = Boolean(id);
  const initialData = state || {};

  const idPerusahaan = state?.id_perusahaan || state?.data?.id;

  const { submitCabang } = useSubmitCabang(idPerusahaan);

  const { provinces, cities, handleProvinceChange, handleCityChange } = useIndonesiaRegions();

  const layout = [
    ["nama", "logo"],
    ["bidang_usaha", "profil_cover"],
    ["provinsi", "kota"],
    ["email", "telepon"],
    ["password","password_confirmation"],
    ["alamat"],
  ];

  const enhancedFields = TambahCabangFields.map((f) => {
    if (f.name === "provinsi") {
      return {
        ...f,
        options: provinces.map((p) => ({
          label: p.name,
          value: p.name,
        })),
      };
    }

    if (f.name === "kota") {
      return {
        ...f,
        options: cities.map((c) => ({
          label: c.name,
          value: c.name,
        })),
      };
    }

    return f;
  });

  const handleSubmit = async (formData) => {
    const validation = Validate(TambahCabangSchema, formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    await submitCabang(formData);
  };

  const handleCancel = () => {
    formRef.current?.reset();
    setErrors({});
    navigate(-1);
  };

  return (
    <div className="w-full bg-[#EEF4FF] rounded-2xl p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
        <div className="mb-8">
          <h2 className="font-semibold text-2xl">
            {isEdit ? "Edit Cabang Perusahaan" : "Tambah Cabang Perusahaan"}
          </h2>
          <p className="text-sm text-[#667796]">
            {isEdit ? "Ubah data cabang perusahaan" : "Tambah cabang perusahaan baru"}
          </p>
          <hr className="border-gray-200 mt-4" />
        </div>

        <Form
          ref={formRef}
          fields={enhancedFields}
          errors={errors}
          layout={layout}
          initialData={initialData}
          onSelectChange={{
            provinsi: (v, setField) => {
              handleProvinceChange(v);
              setField("kota", "");
            },
            kota: handleCityChange,
          }}
          showSubmitButton={true}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CabangForm;
