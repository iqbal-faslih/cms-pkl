export const AdminFields = [
    { name: "nama", label: "Nama", type: "input", placeholder: "Masukkan Nama Admin Disini", required: true },
    { name: "fotoAdmin", label: "Foto Admin", type: "file", accept: ".jpg,.png,.jpeg", required: true },

    { name: "noHp", label: "Nomor HP", type: "input", placeholder: "Masukkan Nama Nomor HP", required: true },
    { name: "fotoCover", label: "Foto Cover", type: "file", accept: ".jpg,.png,.jpeg", required: true },

    { name: "password", label: "Password", type: "input", placeholder: "Masukkan Password Disini", required: true },
    { name: "devisi", label: "Devisi", type: "select", placeholder: "Pilih Devisi", required: true },

    { name: "deskripsi", label: "Deskripsi", type: "textarea", placeholder: "You were moved to a new division by your mentor to better match your skills and support the team’s needs.", fullWidth: true, required: true },

  ];