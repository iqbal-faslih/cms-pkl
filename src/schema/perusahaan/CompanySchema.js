import { z } from "zod";

export const companySchema = z.object({
  nama_penanggung_jawab: z.string().min(1, "Nama Penanggung Jawab wajib diisi"),
  nomor_penanggung_jawab: z.string().min(1, "Nomor HP wajib diisi"),
  jabatan_penanggung_jawab: z.string().min(1, "Jabatan wajib diisi"),
  email_penanggung_jawab: z.string().min(1, "Email wajib diisi").email("Email tidak valid"),

  nama: z.string().min(1, "Nama Perusahaan wajib diisi"),
  tanggal_berdiri: z.string().min(1, "Tanggal Berdiri wajib diisi"),
  deskripsi: z.string().optional().nullable(),


  provinsi: z.string().min(1, "Provinsi wajib dipilih"),
  kota: z.string().min(1, "Kota wajib dipilih"),
  kecamatan: z.string().min(1, "Kecamatan wajib dipilih"),
  kode_pos: z.string().min(1, "Kode Pos wajib diisi"),
  telepon: z.string().min(1, "Nomor Telepon wajib diisi"),
  email: z.string().min(1, "Email Perusahaan wajib diisi").email("Email tidak valid"),
  website: z.string().min(1, "Website wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
});
