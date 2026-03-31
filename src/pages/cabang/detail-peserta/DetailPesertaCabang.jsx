import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../components/cards/Card";
import BackHeader from "../../../shared/components/header/BackHeader";
import RoundedProfile from "../../../shared/components/RoundedProfile";
import Badge2 from "../../../shared/components/Badge2";
import PresensiCard from "../../../shared/components/cards/PresensiCard";
import TableHeader from "../../../shared/components/table/TableHeader";
import DataTable from "../../../shared/components/table/Table";
import { jurnalDataConf, jurnalBarConfig } from "./config";
import Button from "../../../components/Button";
import { IoImage } from "react-icons/io5";
import FormModal from "../../../shared/components/modal/FormModal";
import YearDropdown from "../../../shared/components/button/YearDropdown";
import { Eye } from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import { useFetch } from "../../../shared/hooks/requests/useFetch";
import ChartView from "../../../shared/components/ChartVIew";
// import * as d from "./dummies"; // DUMMY DIHAPUS

const DetailPeserta = () => {
  const { id } = useParams();
  const availableYears = [2025, 2026]; // Diperbarui sesuai data API

  // === FETCH DATA API ===
  const { data, loading, error, refetch } = useFetch(
    `/cabang-peserta-magang/${id}`
  );

  // Peserta
  const peserta = data?.detail_peserta || null;

  // Statistik (dibuat dari API detail_peserta)
  const statistics = peserta
    ? [
        { title: "Total Absensi", value: peserta.total_absensi },
        { title: "Hadir", value: peserta.total_hadir },
        { title: "Izin/Sakit", value: peserta["total_izin/sakit"] },
        { title: "Alpa", value: peserta.total_alpa },
      ]
    : [];

  // Punishment & Project Route
  const punishment = peserta?.punishment || [];
  const routeProject = peserta?.route_project || [];

  // Jurnal List
  const jurnalList = data?.riwayat_pengisian_jurnal?.data || [];

  // Mengambil tahun pertama yang tersedia di statistik jurnal atau default ke 2025
  const initialYear = peserta?.statistik_jurnal?.[0]?.year || 2025;
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [page, setPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  // --- DATA UNTUK CHART STATISTIK JURNAL (PERBAIKAN) ---
  const statistikJurnal = peserta?.statistik_jurnal || [];

  const currentYearStats = statistikJurnal.find(
    (stat) => stat.year === selectedYear
  );

  const chartSeries = [
    {
      name: "Jurnal",
      data: [
        currentYearStats?.mengisi_jurnal || 0,
        currentYearStats?.tidak_mengisi_jurnal || 0,
      ],
    },
  ];
  // ----------------------------------------------------

  // Pagination Jurnal
  const itemsPerPage = 5;
  const totalItems = jurnalList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = jurnalList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // --- PERBAIKAN handleDetail UNTUK MEMETAKAN DATA API KE MODAL ---
  const handleDetail = (row) => {
    setSelectedJournal({
      tgl: row.tanggal, // Digunakan di subtitle
      judul: row.judul,
      bukti: row.bukti,
      desc: row.deskripsi, // Digunakan di render field deskripsi
    });
    setIsDetailModalOpen(true);
  };
  // ---------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="rounded-2xl p-12 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Memuat detail peserta...
          </h2>
          <p className="text-gray-500">Mohon tunggu beberapa saat</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <Card className="rounded-2xl p-12 text-center max-w-md w-full border-l-8 border-red-500">
          <div className="text-red-500 mb-6">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Gagal memuat data
          </h2>
          <p className="text-gray-600 mb-8">
            {error?.message || "Terjadi kesalahan saat mengambil data peserta."}
          </p>
          <div className="space-x-3">
            <Button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Coba Lagi
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="rounded-2xl mb-4 p-6">
        <div className="flex items-center gap-4 mb-8">
          <BackHeader title="Detail Peserta" backTo={`/cabang/peserta`} />
        </div>

        <div className="flex items-start gap-10">
          <div className="flex-shrink-0">
            <RoundedProfile
              image={"/assets/img/default.png"} // Menggunakan default image atau dari API jika ada
              size="160px"
              borderColor="#306BFF"
            />
          </div>

          <div className="w-full pt-1">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.name}
                </h2>
                <Badge2
                  rounded="25px"
                  textSize="14px"
                  color="#4281FF"
                  className="px-4 py-1 text-white"
                >
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.divisi}
                </Badge2>
              </div>
              <h4 className="text-lg text-gray-700 font-medium">
                {/* --- DATA PESERTA API --- */}
                {peserta?.sekolah} <span className="mx-2">|</span>{" "}
                {peserta?.cabang}
              </h4>
            </div>

            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">
                  Nomor Identitas
                </p>
                <p className="text-gray-500 font-medium">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.nomor_identitas}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">Email</p>
                <p
                  className="text-gray-500 font-medium truncate"
                  title={peserta?.email}
                >
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.email}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">Cabang</p>
                <p className="text-gray-500 font-medium">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.cabang}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">Mentor</p>
                <p className="text-gray-500 font-medium">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.mentor || "-"}
                </p>
              </div>

              {/* Tempat Tanggal Lahir (Data ini tidak ada di API yang diberikan, biarkan saja) */}
              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">
                  Tempat Tanggal Lahir
                </p>
                <p className="text-gray-500 font-medium">
                  {/* Data ini tidak ada di API */}-
                </p>
              </div>

              <div className="col-span-1">
                <p className="font-bold text-gray-800 text-sm mb-1">
                  Perusahaan
                </p>
                <p
                  className="text-gray-500 font-medium uppercase truncate"
                  title={peserta?.perusahaan}
                >
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.perusahaan}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">RFID</p>
                <p className="text-gray-500 font-medium">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.rfid || "-"}
                </p>
              </div>

              <div>
                <p className="font-bold text-gray-800 text-sm mb-1">
                  Durasi Magang
                </p>
                <p className="text-gray-500 font-medium">
                  {/* --- DATA PESERTA API --- */}
                  {peserta?.durasi_magang}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* STATISTIK (DATA SUDAH DARI API) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        {statistics.map((item, idx) => (
          <PresensiCard key={idx} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8">
          <Card className="rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-3 pb-4 border-b border-gray-400">
              <h2 className="text-xl font-semibold">
                Statistik Pengisian Jurnal
              </h2>
              <YearDropdown
                value={selectedYear}
                onChange={setSelectedYear}
                years={availableYears} // Atau gunakan tahun dari statistikJurnal jika ingin dinamis
              />
            </div>
            <ChartView
              config={{
                ...jurnalBarConfig,
                header: null,
              }}
              data={chartSeries} // Menggunakan data chart yang sudah diolah dari API
              height={380}
            />
          </Card>
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <TableHeader config={jurnalDataConf.headerConfig} />

            <div className="px-4 pb-4">
              <DataTable
                config={{
                  ...jurnalDataConf.tableConfig,
                  columns: jurnalDataConf.tableConfig.columns.map((col) => {
                    if (col.key === "actions") {
                      return {
                        ...col,
                        textAlign: "text-center",
                        cellClassName: "text-center",
                        render: (value, row) => (
                          <button
                            onClick={() => handleDetail(row)}
                            className="
                    bg-[#0D5EF4]
                    hover:bg-[#0D42EF]
                    cursor-pointer
                    py-2 px-4
                    text-white
                    rounded-md
                    text-sm
                    transition duration-300
                  "
                          >
                            Lihat Detail
                          </button>
                        ),
                      };
                    }

                    if (col.key === "bukti") {
                      return {
                        ...col,
                        render: (
                          value // Menggunakan value dari cell
                        ) => (
                          <div className="flex items-center justify-center">
                            {value ? (
                              <div className="w-8 h-8 bg-[#2971ee] text-[#ffffff] flex items-center justify-center rounded-md">
                                <IoImage size={20} />
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Tidak Ada
                              </span>
                            )}
                          </div>
                        ),
                        cellClassName: "text-center",
                      };
                    }

                    return col;
                  }),
                }}
                data={paginatedData} // Menggunakan data jurnal dari API
                pagination={{
                  currentPage: page,
                  totalPages: totalPages,
                  itemsPerPage: itemsPerPage,
                  totalItems: totalItems,
                  onPageChange: setPage,
                  label: "jurnal",
                }}
              />
            </div>
          </Card>
        </div>

        {/* SIDEBAR (DATA SUDAH DARI API) */}
        <div className="col-span-4 sticky top-[90px] flex flex-col gap-3">
          {/* Punishment */}
          <Card className="rounded-2xl py-4">
            <h3 className="text-lg font-semibold mb-3">Punishment</h3>

            {punishment.length === 0 ? (
              <p className="text-gray-400 text-sm">Belum ada punishment</p>
            ) : (
              <ul className="space-y-2">
                {punishment.map((p, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-semibold">
                      {p.keterangan_punishment}
                    </span>
                    <br />
                    <span className="text-gray-500 text-xs">{p.tanggal}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* STATUS SP */}
          <Card className="rounded-2xl py-4">
            <h3 className="text-xl font-semibold">Status SP</h3>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <BsPatchCheckFill className="text-green-500 w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold">
                  {peserta?.status_surat_peringatan}
                </h4>
                <p className="text-[12px] text-gray-500">
                  Status surat peringatan peserta.
                </p>
              </div>
            </div>
          </Card>

          {/* ROUTE PROJECT */}
          <Card className="rounded-2xl py-4">
            <h3 className="text-lg font-semibold">Route Project</h3>

            {routeProject.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada data project</p>
            ) : (
              <ul className="space-y-2">
                {routeProject.map((prj, i) => (
                  <li key={i} className="text-sm">
                    <div className="font-semibold">{prj.nama}</div>
                    <div className="text-xs text-gray-500">
                      {prj.tanggal_mulai} → {prj.tanggal_selesai}
                    </div>
                    <div className="text-xs">Status: {prj.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* DETAIL MODAL (KUNCI SUDAH DIPETAKAN DI handleDetail) */}
      <FormModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Jurnal"
        subtitle={
          selectedJournal?.tgl
            ? new Date(selectedJournal.tgl).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"
        }
        showIcon={false}
        actions={[]}
        initialValues={selectedJournal || {}}
        onSubmit={() => {}}
        layout={[["judul"], ["bukti", "desc"]]}
        fields={[
          {
            name: "judul",
            type: "custom",
            fullWidth: true,
            render: (data) => (
              <div>
                <label className="block text-lg font-semibold text-black mb-2">
                  Judul :
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-base bg-white">
                  {data.judul || "-"}
                </div>
              </div>
            ),
          },
          {
            name: "bukti",
            type: "custom",
            render: (data) => (
              <div>
                <label className="block text-lg font-semibold text-black mb-2">
                  Bukti :
                </label>
                <div className="border border-gray-300 rounded-xl p-2 h-[250px] bg-white flex items-center justify-center overflow-hidden">
                  {data.bukti ? (
                    <img
                      src={data.bukti}
                      alt="Bukti Jurnal"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 italic">
                      Tidak ada bukti
                    </span>
                  )}
                </div>
              </div>
            ),
          },
          {
            name: "desc",
            type: "custom",
            render: (data) => (
              <div>
                <label className="block text-lg font-semibold text-black mb-2">
                  Deskripsi Kegiatan :
                </label>
                <div className="w-full h-[250px] px-4 py-3 border border-gray-300 rounded-xl text-gray-700 text-base bg-white overflow-y-auto">
                  {data.desc || "-"}
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default DetailPeserta;
