export function buildCompanyFields(
  isEditing,
  getOptions,
  documentsConfig,
  renderDocumentCard,
  documentValues = {}
) {
  const allFields = [
    // ... field identitas penanggung jawab tetap sama
    { name: "nama_penanggung_jawab", label: "Nama Penanggung Jawab", type: "input", required: true },
    { name: "nomor_penanggung_jawab", label: "Nomor HP Penanggung Jawab", type: "input", required: true },
    { name: "jabatan_penanggung_jawab", label: "Jabatan Penanggung Jawab", type: "input", required: true },
    { name: "email_penanggung_jawab", label: "Email Penanggung Jawab", type: "input", required: true },

    { name: "nama", label: "Nama Perusahaan", type: "input", required: true },
    { name: "tanggal_berdiri", label: "Tanggal Berdiri", type: "input", required: true },
    { name: "deskripsi", label: "Deskripsi Perusahaan", type: "textarea", required: false },

    {
      name: "header_kontak",
      type: "custom",
      render: () => (
        <div className="mt-8 mb-2">
          <h2 className="text-lg font-bold text-gray-900">Kontak Perusahaan</h2>
        </div>
      ),
    },

    // PERUBAHAN DI SINI: Tipe berubah tergantung isEditing
    {
      name: "provinsi",
      label: "Provinsi",
      type: isEditing ? "select" : "input", // Jika edit tampil select, jika lihat tampil input
      placeholder: isEditing ? "Pilih Provinsi" : "Provinsi belum diisi",
      options: getOptions("provinsi"),
      required: true,
    },
    {
      name: "kota",
      label: "Kabupaten/Kota",
      type: isEditing ? "select" : "input", // Jika edit tampil select, jika lihat tampil input
      placeholder: isEditing ? "Pilih Kabupaten/Kota" : "Kota belum diisi",
      options: getOptions("kota"),
      required: true,
    },
    {
      name: "kecamatan",
      label: "Kecamatan",
      type: isEditing ? "select" : "input", // Jika edit tampil select, jika lihat tampil input
      placeholder: isEditing ? "Pilih Kecamatan" : "Kecamatan belum diisi",
      options: getOptions("kecamatan"),
      required: true,
    },

    { name: "kode_pos", label: "Kode Pos", type: "input", required: true },
    { name: "telepon", label: "Nomor Telepon Perusahaan", type: "input", required: true },
    { name: "email", label: "Email Perusahaan", type: "input", required: true },
    { name: "website", label: "Website Perusahaan", type: "input", required: true },
    { name: "alamat", label: "Alamat Perusahaan", type: "textarea", required: true },

    {
      name: "header_dokumen",
      type: "custom",
      render: () => (
        <div className="mt-10 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Dokumen Pendukung</h2>
        </div>
      ),
    },

    {
      name: "dokumen_grid",
      type: "custom",
      render: (form) => ( // Tambahkan form di sini jika butuh data image dari state
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {documentsConfig.map((doc, idx) => (
            (() => {
              const mappedValue =
                documentValues?.[doc.key] ||
                documentValues?.[`${doc.key}_perusahaan`] ||
                (doc.key === "profil_bg"
                  ? documentValues?.profil_background
                  : "");

              const value = form?.[doc.key] || mappedValue || doc.imageSrc;

              return renderDocumentCard({
                key: idx,
                title: doc.title,
                imageSrc: value,
                fileUrl: value,
                isEditing,
                documentName: doc.key,
                documentApiKey: doc.apiKey,
              });
            })()
          ))}
        </div>
      ),
    },
  ];

  const fields = allFields.map((f) => ({
    ...f,
    readonly: f.type !== "custom" && !isEditing,
    // Pastikan disabled hanya aktif jika benar-benar bertipe select dan sedang tidak edit
    disabled: f.type === "select" && !isEditing,
    placeholder: f.placeholder || `Masukkan ${f.label || ""}`,
  }));

  // Layout tetap sama
  const layout = [
    ["nama_penanggung_jawab", "nomor_penanggung_jawab", "jabatan_penanggung_jawab"],
    ["email_penanggung_jawab", "nama", "tanggal_berdiri"],
    ["deskripsi"],
    ["header_kontak"],
    ["provinsi", "kota", "kecamatan", "kode_pos"],
    ["telepon", "email", "website"],
    ["alamat"],
    ["header_dokumen"],
    ["dokumen_grid"],
  ];

  return { fields, layout };
}
