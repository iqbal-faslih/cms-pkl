import { z } from "zod";

export const SpSchema = z.object({
  noSurat: z.string().min(1, "No Surat wajib diisi"),

  keteranganSp: z.string().min(1, "Keterangan SP wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  tanggalSurat: z.string().min(1, "Tanggal Surat wajib diisi"),

  sekolah: z.string().min(1, "Sekolah/Universitas wajib diisi"),

 alasanSp: z.string().min(1,"Alasan SP wajib diisi"),
});
