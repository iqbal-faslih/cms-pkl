export const dummyAdminData = {
  nama: "Jiro S.Kom., M.Kom",
  email: "hrd@hummatech.com",
  nomorHp: "081234567890",
  password: "Password",
  passwordBaru: "",
};

export const dummyCompanyData = {
  nama_penanggung_jawab: "Jiro S.Kom., M.Kom",
  nomor_penanggung_jawab: "123456789012",
  jabatan_penanggung_jawab: "HRD",
  email_penanggung_jawab: "p@hummatech.com",

  nama: "PT. Humma Technology Indonesia",
  tanggal_berdiri: "2020-08-15",
  deskripsi: "PT. Humma Technology Indonesia adalah perusahaan yang bergerak di bidang teknologi informasi dengan fokus pada pengembangan solusi digital inovatif untuk mendukung transformasi bisnis di era industri 4.0. Kami menyediakan layanan pengembangan perangkat lunak, sistem informasi, dan integrasi teknologi berbasis cloud untuk berbagai sektor industri.",

  alamat: "Perum Permata Regency 1, Blok 10 No 28, Ngijo, Karangploso",
  provinsi: "Jawa Timur",
  kota: "Kabupaten Malang",
  kecamatan: "Karangploso",
  kode_pos: "65152",
  email: "info@hummatech.com",
  telepon: "0341123456",
  website: "https://hummatech.com",
};

export const formSections = [
  {
    title: "Identitas Penanggung Jawab",
    items: [
      { name: "nama_penanggung_jawab", label: "Nama Penanggung Jawab", type: "text", placeholder: "Masukkan Nama Lengkap", required: true },
      { name: "nomor_penanggung_jawab", label: "Nomor HP Penanggung Jawab", type: "number", placeholder: "08xxxxxxxxxx", required: true },
      { name: "jabatan_penanggung_jawab", label: "Jabatan Penanggung Jawab", type: "text", placeholder: "Contoh: HR Manager", required: true },
    ],
  },
  {
    title: "Data Perusahaan",
    items: [
      { name: "email_penanggung_jawab", label: "Email Penanggung Jawab", type: "email", placeholder: "nama@email.com", required: true },
      { name: "nama", label: "Nama Perusahaan", type: "text", placeholder: "Masukkan Nama Perusahaan", required: true },
      { name: "tanggal_berdiri", label: "Tanggal Berdiri", type: "text", placeholder: "Masukkan Tanggal Berdiri", required: true },
      { name: "deskripsi", label: "Deskripsi Perusahaan", type: "textarea", placeholder: "Jelaskan secara singkat...", fullWidth: true, required: true },
    ],
  },
  {
    title: "Kontak & Alamat Perusahaan",
    items: [
      { name: "alamat", label: "Alamat Perusahaan", type: "textarea", placeholder: "Jalan, Nama Gedung, Blok...", fullWidth: true, required: true }, // Changed to textarea based on design
      
      { 
        name: "provinsi", 
        label: "Provinsi", 
        type: "select", 
        placeholder: "Pilih Provinsi", 
        required: true,
        options: [
            { label: "Jawa Timur", value: "Jawa Timur" },
            { label: "Jawa Tengah", value: "Jawa Tengah" },
            { label: "Jawa Barat", value: "Jawa Barat" },
            { label: "DKI Jakarta", value: "DKI Jakarta" },
            { label: "DI Yogyakarta", value: "DI Yogyakarta" },
        ]
      },
      { 
        name: "kota", 
        label: "Kabupaten/Kota", 
        type: "select", 
        placeholder: "Pilih Kabupaten/Kota", 
        required: true,
        options: [
            { label: "Kabupaten Malang", value: "Kabupaten Malang" },
            { label: "Kota Malang", value: "Kota Malang" },
            { label: "Kota Batu", value: "Kota Batu" },
            { label: "Surabaya", value: "Surabaya" },
            { label: "Sidoarjo", value: "Sidoarjo" },
        ]
      },
      { 
        name: "kecamatan", 
        label: "Kecamatan", 
        type: "select", 
        placeholder: "Pilih Kecamatan", 
        required: true,
        options: [
            { label: "Karangploso", value: "Karangploso" },
            { label: "Singosari", value: "Singosari" },
            { label: "Lawang", value: "Lawang" },
            { label: "Lowokwaru", value: "Lowokwaru" },
            { label: "Klojen", value: "Klojen" },
        ]
      },
      
      { name: "kode_pos", label: "Kode Pos", type: "number", placeholder: "Masukkan Kode Pos", required: true },
      { name: "email", label: "Email Perusahaan", type: "email", placeholder: "company@email.com", required: true },
      { name: "telepon", label: "Nomor Telepon Perusahaan", type: "number", placeholder: "021xxxxxxx", required: true },
      { name: "website", label: "Website Perusahaan", type: "text", placeholder: "https://www.perusahaan.com" },
    ],
  },
];

export const documentsConfig = [
  {
    key: "legalitas",
    apiKey: "legalitas_perusahaan",
    title: "Bukti Legalitas Perusahaan",
    imageSrc: "",
    required: true,
  },
  {
    key: "npwp",
    apiKey: "npwp_perusahaan",
    title: "Bukti NPWP Perusahaan",
    imageSrc: "",
    required: true,
  },
  {
    key: "profil_bg",
    apiKey: "profil_background",
    title: "Profil Perusahaan Background",
    imageSrc: "",
    required: false,
  },
];
