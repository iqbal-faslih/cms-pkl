import React from "react";
import FormModal from "@/shared/components/modal/FormModal";
import MultiSelect from "@/shared/components/input/MultiselectField";

export default function AddStudentCabang({
  open,
  onClose,
  siswaOptions = [],
  mentorOptions = [],
  onSubmit,
}) {
  const initialValues = {
    siswa: [],
    mentor: null,
  };

  const HeaderSection = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Tambah</h2>
      <p className="text-sm text-red-600 mt-2">
        *Ada 201 Siswa Magang, Kamu Bisa memasukkan dalam 1 sesi Sebanyak 50-51 Siswa
      </p>
    </div>
  );

  const fields = [
    {
      name: "header",
      type: "custom",
      fullWidth: true,
      render: () => <HeaderSection />,
    },
    {
      name: "siswa",
      type: "custom",
      label: "Pilih Siswa",
      required: true,
      render: (form, setForm, errors) => (
        <MultiSelect
          label="Pilih Siswa"
          placeholder="Pilih Siswa"
          required
          options={siswaOptions}
          selectedItems={form.siswa || []}
          error={errors?.siswa}
          onSelectionChange={(newSelection) =>
            setForm((prev) => ({ ...prev, siswa: newSelection }))
          }
        />
      ),
    },
  ];

  const layout = [["header"], ["siswa"]];

  const actions = [
    {
      label: "Cancel",
      onClick: onClose,
      type: "button",
      className:
        "w-full px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition",
    },
    {
      label: "Confirm",
      type: "submit",
      className:
        "w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition",
    },
  ];

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title=""
      subtitle=""
      initialValues={initialValues}
      fields={fields}
      layout={layout}
      actions={actions}
      maxWidth="max-w-2xl"
      actionsClassName="flex gap-4 mt-10"
    />
  );
}