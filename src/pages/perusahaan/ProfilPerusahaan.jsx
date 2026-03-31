import React, { useEffect, useState } from "react";

export default function CompanyProfileFull() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummy = {
      nama_penanggung_jawab: "Jiro S.Kom., M.Kom",
      hp_penanggung_jawab: "123456789",
      jabatan_penanggung_jawab: "HRD",
      email_penanggung_jawab: "jiroo@gmail.com",
      nama_perusahaan: "PT.HUMMA TECHNOLOGY INDONESIA",
      tanggal_berdiri: "12 MARET 2018",
      deskripsi:
        "PT. Humma Technology Indonesia adalah perusahaan yang bergerak di bidang teknologi informasi dengan fokus pada pengembangan solusi digital inovatif untuk mendukung transformasi bisnis di era industri 4.0. Kami menyediakan layanan pengembangan perangkat lunak, sistem informasi, dan integrasi teknologi berbasis cloud untuk berbagai sektor industri.",
      alamat:
        "Perum Permata Regency 1, Blk 10 No.28, Perum Gpa, Ngijo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65152",
      provinsi: "Jawa Timur",
      kota: "Malang",
      kode_pos: "12345",
      email_perusahaan: "ineigmail.com",
      telepon: "123455889",
      website: "www.hummatech.co.id",
      dokumen: [
        {
          id: 1,
          title: "Bukti Legalitas Perusahaan",
          date: "25 Juni 2025",
        },
        {
          id: 2,
          title: "Bukti NPWP Perusahaan",
          date: "25 Juni 2025",
        },
        {
          id: 3,
          title: "Profil Perusahaan Background",
          date: "25 Juni 2025",
        },
      ],
    };

    setTimeout(() => {
      setCompany(dummy);
      setLoading(false);
    }, 400);
  }, []);

  if (loading) return <div className="text-center p-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#e9f3ff] pb-20 px-4">
      <div className="max-w-[1180px] mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h1 className="text-[22px] font-semibold text-[#0b1320] ">
          Data Umum Perusahaan
        </h1>
        <p className="text-sm text-gray-600 mb-7">
          Silahkan Lengkapi Data Terlebih Dahulu!
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-lg mb-4">Data Umum Perusahaan</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 font-medium">
                  Nama Penanggung Jawab
                </label>
                <input
                  defaultValue={company.nama_penanggung_jawab}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Nomor HP Penanggung Jawab
                </label>
                <input
                  defaultValue={company.hp_penanggung_jawab}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Jabatan Penanggung Jawab
                </label>
                <input
                  defaultValue={company.jabatan_penanggung_jawab}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Email Penanggung Jawab
                </label>
                <input
                  defaultValue={company.email_penanggung_jawab}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>
-
              <div className="md:col-span-2">
                <label className="block text-sm mb-1 font-medium">
                  Nama Perusahaan
                </label>
                <input
                  defaultValue={company.nama_perusahaan}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Tanggal Berdiri
                </label>
                <input
                  defaultValue={company.tanggal_berdiri}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm mb-1 font-medium">
                  Deskripsi Perusahaan
                </label>
                <textarea className="w-full border rounded-xl px-3 py-2 bg-gray-50 h-28 leading-relaxed">
                  {company.deskripsi}
                </textarea>
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Kontak Perusahaan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Alamat Perusahaan
                </label>
                <textarea className="w-full border rounded-xl px-3 py-2 bg-gray-50 h-24">
                  {company.alamat}
                </textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Provinsi
                </label>
                <input
                  defaultValue={company.provinsi}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />

                <label className="block text-sm font-medium mt-3 mb-1">
                  Kabupaten/Kota
                </label>
                <input
                  defaultValue={company.kota}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />

                <label className="block text-sm font-medium mt-3 mb-1">
                  Kode Pos
                </label>
                <input
                  defaultValue={company.kode_pos}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Perusahaan
                </label>
                <input
                  defaultValue={company.email_perusahaan}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />

                <label className="block text-sm font-medium mt-3 mb-1">
                  Nomor Telepon
                </label>
                <input
                  defaultValue={company.telepon}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />

                <label className="block text-sm font-medium mt-3 mb-1">
                  Website
                </label>
                <input
                  defaultValue={company.website}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Dokumen Pendukung</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
              {company.dokumen.map((d) => (
                <div
                  key={d.id}
                  className="border rounded-xl p-4 shadow-sm hover:shadow transition bg-white"
                >
                  <div className="w-full h-20 bg-gray-100 rounded-lg mb-3" />

                  <div className="font-medium text-sm">{d.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Date Added: {d.date}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="bg-sky-600 text-white text-xs px-3 py-1 rounded-lg">
                      Download
                    </button>
                    <button className="border text-xs px-3 py-1 rounded-lg">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT BUTTON */}
          <div className="flex justify-end mt-6">
            <button className="bg-sky-600 text-white px-10 py-2 rounded-full text-sm">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
