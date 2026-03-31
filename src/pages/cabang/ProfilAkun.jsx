import React, { useState } from 'react';
import { HeaderInfo } from '../../shared/components/header/HeaderInfo';
import Form from '../../shared/components/Form';
import Button from '../../shared/components/button/Button';

const ProfilAkun = () => {
  // OPTIONAL: Kalau kamu mau balikin konten berdasarkan tab, pakai state kayak gini:
  const [activeTab, setActiveTab] = useState("data-admin-cabang");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    "data-admin-cabang": {},
    "data-cabang": {
      nama_cabang: "Cabang Jakarta",
      provinsi: "DKI Jakarta",
      bidang_usaha: "Teknologi",
      kota: "Jakarta",
      deskripsi_perusahaan: "Perusahaan teknologi terdepan yang fokus pada inovasi dan pengembangan solusi digital.",
    }
  });

  return (
    <div>
      <HeaderInfo
        nameCabang="Profil Akun"
        nameDescription="Kelola informasi akun cabang Anda di sini."
        enableTabs={true}             // <--- AKTIFKAN TAB
        activeTab={activeTab}         // <--- biar bisa dikontrol halaman
        setActiveTab={setActiveTab}   // <--- handler tab berubah
      />

      {/* Konten berdasarkan tab */}
      <div className="mt-6">
        {activeTab === "data-admin-cabang" && (
          <div className='bg-white rounded-md p-8'>
            <h2 className="text-xl font-semibold mb-4">Data Admin Umum Cabang</h2>
            <Form
              fields={[
                { name: "nama", label: "Nama", type: "input", required: true, readonly: !isEditing },
                { name: "email", label: "Email", type: "input", required: true, readonly: !isEditing },
                { name: "nomor_hp", label: "Nomor HP", type: "input", required: true, readonly: !isEditing },
                { name: "password", label: "Password", type: "input", required: true, readonly: !isEditing },
                { name: "foto", label: "Foto", type: "file", required: true, readonly: !isEditing },
                { name: "dummy", type: "dummy" },
                { name: "deskripsi_perusahaan", label: "Deskripsi Perusahaan", type: "textarea", required: true, fullWidth: true, readonly: !isEditing },
              ]}
              initialData={formData["data-admin-cabang"]}
              layout={[
                ["nama", "email"],
                ["nomor_hp", "password"],
                ["foto", "dummy"],
                ["deskripsi_perusahaan"],
              ]}
              onChange={(name, value) => {
                setFormData(prev => ({
                  ...prev,
                  "data-admin-cabang": {
                    ...prev["data-admin-cabang"],
                    [name]: value
                  }
                }));
              }}
              onSubmit={(data) => {
                console.log("Form submitted:", data);
                setFormData(prev => ({
                  ...prev,
                  "data-admin-cabang": data
                }));
                setIsEditing(false);
              }}
              showSubmitButton={isEditing}
              submitLabel="Simpan Perubahan"
              onCancel={() => setIsEditing(false)}
            />
            {!isEditing && (
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  className="bg-[#3E80F8] text-white hover:bg-blue-700 rounded-lg px-6 py-2 text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "data-cabang" && (
          <div className='bg-white rounded-md p-8'>
            <h2 className="text-xl font-semibold mb-4">Data Cabang</h2>
            <Form
              fields={[
                { name: "nama_cabang", label: "Nama Cabang", type: "input", readonly: true },
                { name: "provinsi", label: "Provinsi", type: "input", readonly: true },
                { name: "bidang_usaha", label: "Bidang Usaha", type: "input", readonly: true },
                { name: "kota", label: "Kota", type: "input", readonly: true },
                { name: "deskripsi_perusahaan", label: "Deskripsi Perusahaan", type: "textarea", readonly: true, fullWidth: true },
              ]}
              initialData={{
                nama_cabang: "Cabang Jakarta",
                provinsi: "DKI Jakarta",
                bidang_usaha: "Teknologi",
                kota: "Jakarta",
                deskripsi_perusahaan: "Perusahaan teknologi terdepan yang fokus pada inovasi dan pengembangan solusi digital.",
              }}
              layout={[
                ["nama_cabang", "provinsi"],
                ["bidang_usaha", "kota"],
                ["deskripsi_perusahaan"],
              ]}
              showSubmitButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilAkun;
