import React from "react";
import Form from "../../../../shared/components/Form";
import Card from "../../../../components/cards/Card";
import { ProfileSettingsFields } from "../fields_&_schema/fields";
import { useProfileCabang } from "../../../../hooks/useProfilAdminCabangHooks";

const DataCabangCard = () => {
  const { data, loading, error } = useProfileCabang();

  if (loading) {
    return (
      <Card className="rounded-2xl p-4">
        <p>Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl p-4">
        <p className="text-red-500">
          Terjadi kesalahan saat memuat data cabang.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-xl font-semibold">Data Cabang</h2>
        <p className="text-gray-500">Detail data cabang perusahaan</p>
      </div>

      <Form
        fields={ProfileSettingsFields.dataCabang}
        initialData={data}
        showSubmitButton={false}
        layout={[
          ["nama", "kota"],
          ["bidang_usaha", "alamat"],
          ["provinsi", "email"],
        ]}
      />
    </Card>
  );
};

export default DataCabangCard;
