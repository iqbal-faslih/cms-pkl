export const mapFormToApiPayload = (form) => ({
  nama: form.nama,
  tanggal_berdiri: form.tanggal_berdiri,
  deskripsi: form.deskripsi,
  legalitas_perusahaan: form.legalitas_perusahaan ?? form.legalitas ?? "",
  npwp_perusahaan: form.npwp_perusahaan ?? form.npwp ?? "",

  nama_penanggung_jawab: form.nama_penanggung_jawab,
  nomor_penanggung_jawab: form.nomor_penanggung_jawab,
  jabatan_penanggung_jawab: form.jabatan_penanggung_jawab,
  email_penanggung_jawab: form.email_penanggung_jawab,

  provinsi: form.provinsi,
  kota: form.kota,
  kecamatan: form.kecamatan,
  kode_pos: form.kode_pos,

  telepon: form.telepon,
  email: form.email ?? form.email_perusahaan,
  email_perusahaan: form.email_perusahaan ?? form.email,
  website: form.website,
  alamat: form.alamat,
});
