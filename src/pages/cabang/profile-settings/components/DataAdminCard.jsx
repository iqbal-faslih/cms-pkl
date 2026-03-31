import React, { useState } from "react";
import Form from "../../../../shared/components/Form";
import Card from "../../../../components/cards/Card";
import { ProfileSettingsFields } from "../fields_&_schema/fields";
import { useProfileAdminCabang } from "../../../../hooks/useProfilAdminCabangHooks";
import { useUpdateProfileAdminCabang } from "../hooks/useUpdate";

const DataAdminCard = () => {
  const [editMode, setEditMode] = useState(false);
  const [updateError, setUpdateError] = useState({})

  const { data, loading, error, refetch } = useProfileAdminCabang();

 const { updateProfile, updating, validationErrors, clearErrors } = useUpdateProfileAdminCabang(refetch);

  const handleSubmit = async (values) => {
    try {
      await updateProfile(values);
      setEditMode(false);
    } catch (err) {
      setUpdateError(err?.message)
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError({});
    clearErrors();
  };

  const toggleEdit = () => setEditMode(true);

  const layouts = {
    readLayout: [["nama", "email"], ["telepon"], ["deskripsi"]],
    editLayout: [
      ["nama", "email"],
      ["telepon", "old_password"],
      ["avatar", "new_password"],
      ["d", "confirm_password"],
      ["deskripsi"],
    ],
  };

  if (loading) {
    return (
      <Card className="rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 mb-4">
            Gagal memuat data: {error.message}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <h2 className="text-xl pb-4 mb-10 border-b border-gray-300 font-semibold">
        {editMode ? "Edit Data Admin Cabang" : "Data Admin Cabang"}
      </h2>

      <Form
        fields={
          editMode
            ? ProfileSettingsFields.dataAdminEdit
            : ProfileSettingsFields.dataAdmin
        }
        onCancel={editMode ? handleCancel : undefined}
        cancelStyle={`px-9 py-2 border text-sm transition-colors duration-150 hover:bg-red-400 hover:text-white border-red-400 rounded-full text-red-400`}
        initialData={data}
        showSubmitButton={true}
        submitStyle={
          editMode
            ? "px-9 py-2 border text-sm transition-colors duration-150 hover:bg-blue-600 hover:text-white border-blue-600 rounded-full text-blue-600"
            : "px-9 py-2 border text-sm transition-colors duration-150 hover:bg-red-400 hover:text-white border-red-400 rounded-full text-red-400"
        }
        layout={editMode ? layouts.editLayout : layouts.readLayout}
        submitLabel={editMode ? updating ? "Menyimpan" : "Simpan Perubahan" : "Edit"}
        onSubmit={editMode ? handleSubmit : toggleEdit}
        errors={validationErrors} 
      />
    </Card>
  );
};

export default DataAdminCard;
