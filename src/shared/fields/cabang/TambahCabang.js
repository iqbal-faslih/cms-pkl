export const TambahCabangFields = [
  { name: "nama", label: "Nama Cabang", type: "input", placeholder: "Masukkan Nama Cabang", required: true },

  { name: "logo", label: "Logo Perusahaan", type: "file", accept: ".jpg,.png,.jpeg", required: true },
  { name: "profil_cover", label: "Foto Cover", type: "file", accept: ".jpg,.png,.jpeg", required: true },

  { name: "bidang_usaha", label: "Bidang Usaha", type: "input", placeholder: "Masukkan Bidang Usaha", required: true },

  { name: "provinsi", label: "Provinsi", type: "select", placeholder: "Pilih Provinsi", required: true },
  { name: "kota", label: "Kota", type: "select", placeholder: "Pilih Kota", required: true },

  { name: "email", label: "Email", type: "input", placeholder: "Masukkan Email", required: true },
  { name: "telepon", label: "Telepon", type: "input", placeholder: "Masukkan Telepon", required: true },
  { name: "password", label: "Password", type: "password", placeholder: "Masukkan Password", required: true },
  { name: "password_confirmation", label: "Konfirmasi Password", type: "password", placeholder: "Masukkan Ulang Password", required: true },

  { name: "alamat", label: "Alamat", type: "textarea", placeholder: "Masukkan Alamat", required: true, fullWidth: true},
];