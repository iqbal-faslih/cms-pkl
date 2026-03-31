export const formSections = [
  {
    items: [
      {
        name: "nama_penanggung_jawab",
        label: "Nama Penanggung Jawab",
        type: "text",
        placeholder: "Jiro S.Kom., M.Kom",
      },
      {
        name: "nomor_penanggung_jawab",
        label: "Nomor HP Penanggung Jawab",
        type: "text",
        placeholder: "123456789",
      },
      {
        name: "jabatan_penanggung_jawab",
        label: "Jabatan Penanggung Jawab",
        type: "text",
        placeholder: "HRD",
      },
      {
        name: "email_penanggung_jawab",
        label: "Email Penanggung Jawab",
        type: "email",
        placeholder: "jiroo@gmail.com",
      },
      {
        name: "nama",
        label: "Nama Perusahaan",
        type: "text",
        placeholder: "PT. HUMMA TECHNOLOGY INDONESIA",
      },
      {
        name: "tanggal_berdiri",
        label: "Tanggal Berdiri",
        type: "text",
        placeholder: "15 Agustus 2020",
      },
      { type: "spacer", hidden: "lg:block" },
      { type: "spacer", hidden: "lg:block" },
      {
        name: "deskripsi",
        label: "Deskripsi Perusahaan",
        type: "textarea",
        placeholder:
          "PT.Humma Technology Indonesia adalah perusahaan yang bergerak di bidang teknologi informasi dengan fokus pada pengembangan solusi digital inovatif untuk mendukung transformasi bisnis di era industri 4.0. Kami menyedaikan layanan pengembangan perangkat lunak, sistem informasi, dan integrasi teknologi berbasis cloud untuk berbagai sektor industri.",
        fullWidth: true,
      },
    ],
  },
  {
    title: "Kontak Perusahaan",
    items: [
      {
        name: "alamat",
        label: "Alamat Perusahaan",
        type: "text",
        placeholder: "Perum Permata Regency 1...",
      },
      {
        name: "provinsi",
        label: "Provinsi",
        type: "text",
        placeholder: "Jawa Timur",
      },
      {
        name: "kota",
        label: "Kabupaten/Kota",
        type: "text",
        placeholder: "Malang",
      },
      {
        name: "kode_pos",
        label: "Kode Pos",
        type: "text",
        placeholder: "12345",
      },
      {
        name: "email",
        label: "Email Perusahaan",
        type: "email",
        placeholder: "ini@gmail.com",
      },
      {
        name: "telepon",
        label: "Nomor Telepon Perusahaan",
        type: "text",
        placeholder: "123456789",
      },
      {
        name: "website",
        label: "Website Perusahaan",
        type: "text",
        placeholder: "www.hummatech.co.id",
      },
    ],
  },
];

export const documentsConfig = [
  {
    title: "Bukti Legalitas Perusahaan",
    imageSrc: "https://placehold.co/150?text=Legalitas",
  },
  {
    title: "Bukti NPWP Perusahaan",
    imageSrc: "https://placehold.co/150?text=NPWP",
  },
  {
    title: "Profil Perusahaan Background",
    imageSrc: "https://placehold.co/150?text=Profil",
  },
];