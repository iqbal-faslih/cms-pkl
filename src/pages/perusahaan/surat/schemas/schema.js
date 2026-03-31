import { z } from "zod";

export const spSchema = z.object({
  "nomor-surat": z.string().min(1, "Nomor surat wajib diisi"),
  "keterangan-sp": z.enum(["SP_1", "SP_2", "SP_3"], {
    errorMap: () => ({ message: "Pilih salah satu status SP" }),
  }),
  nama: z.string().min(1, "Nama wajib diisi"),
  tgl_surat: z.string().min(1, "Tanggal surat wajib diisi"),
  sekolah: z.string().min(1, "Sekolah/Universitas wajib diisi"),
  alasan_sp: z.string().min(1, "Alasan wajib diisi"),
});
