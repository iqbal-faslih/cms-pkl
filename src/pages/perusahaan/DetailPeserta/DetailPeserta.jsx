import Card from "../../../components/cards/Card";
import Badge2 from "../../../shared/components/Badge2";
import { statistics, jurnalBarConfig, jurnalDataConf } from "./config";
import ChartView from "../../../shared/components/ChartVIew";
import PresensiCard from "../../../shared/components/cards/PresensiCard";
import YearDropdown from "../../../shared/components/button/YearDropdown";
import TableHeader from "../../../shared/components/table/TableHeader";
import DataTable from "../../../shared/components/table/Table";
import FormModal from "../../../shared/components/modal/FormModal";
import { BsExclamationOctagonFill, BsPatchCheckFill } from "react-icons/bs";
import { useDetailPesertaPage } from "./hooks/useDetailPesertaPage";
import { buildDetailPesertaTableColumns } from "./helpers/detailPesertaTableColumns.jsx";
import { getDetailPesertaModalFields } from "./helpers/detailPesertaModalFields.jsx";
import DetailPesertaProfileCard from "./components/DetailPesertaProfileCard";
import DetailPesertaSkeleton from "./components/DetailPesertaSkeleton";
import {
  DEFAULT_PUNISH_IMAGE,
  DEFAULT_ROUTE_IMAGE,
  buildStatsCards,
  buildStatusSpView,
  formatDetailDateLong,
  getPunishmentItems,
  getRouteItems,
  toTitleCase,
} from "./helpers/detailPesertaViewModel";

const DetailPeserta = () => {
  const {
    detail,
    hasDetailData,
    isInitialLoading,
    profileView,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    availableYears,
    itemsPerPage,
    page,
    setPage,
    totalItems,
    totalPages,
    paginatedData,
    chartSeries,
    isDetailModalOpen,
    selectedJournal,
    openDetailModal,
    closeDetailModal,
    isImageOpen,
    selectedImage,
    openImageModal,
    closeImageModal,
  } = useDetailPesertaPage();

  const statsCards = buildStatsCards(detail, statistics);
  const punishmentItems = getPunishmentItems(detail);
  const routeItems = getRouteItems(detail);
  const { hasSp, label: spLabel, description: spDescription } = buildStatusSpView(detail);

  const tableColumns = buildDetailPesertaTableColumns({
    columns: jurnalDataConf.tableConfig.columns,
    onDetailClick: openDetailModal,
    onImageClick: openImageModal,
  });

  if (isInitialLoading || loading) return <DetailPesertaSkeleton />;
  if (error) return <div className="text-center py-10 text-red-500">Terjadi kesalahan: {error.message}</div>;
  if (!hasDetailData) return <div className="text-center py-10">Data peserta tidak ditemukan</div>;

  return (
    <>
      <DetailPesertaProfileCard profile={profileView} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {statsCards.map((item, index) => (
          <PresensiCard
            key={index}
            icon={item.icon}
            count={item.count}
            title={item.title}
            softColor={item.softColor}
            softColor2={item.softColor2}
            color={item.color}
            chartData={item.chartData}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-12 gap-3">
        <div className="col-span-8">
          <Card className="rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-3 pb-4 border-b border-gray-400">
              <h2 className="text-xl font-semibold">Statistik Pengisian Jurnal</h2>
              <YearDropdown value={selectedYear} onChange={setSelectedYear} years={availableYears} />
            </div>
            <ChartView config={{ ...jurnalBarConfig, header: null }} data={chartSeries} height={380} />
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <TableHeader config={jurnalDataConf.headerConfig} />
            <div className="px-4 pb-4">
              <DataTable
                config={{
                  ...jurnalDataConf.tableConfig,
                  columns: tableColumns,
                }}
                data={paginatedData}
                pagination={{
                  currentPage: page,
                  totalPages,
                  itemsPerPage,
                  totalItems,
                  onPageChange: setPage,
                  label: "jurnal",
                }}
              />
            </div>
          </Card>
        </div>

        <div className="col-span-4 relative">
          <div className="flex flex-col gap-y-3 sticky top-[90px]">
            <Card className="rounded-2xl py-4">
              <h3 className="text-lg font-semibold mb-3">Punishment</h3>
              <div className="space-y-4 max-h-72 h-72 overflow-y-auto">
                {punishmentItems.length > 0 ? (
                  punishmentItems.map((item, index) => (
                    <div key={item?.id || index} className="flex items-start gap-4">
                      <div className="flex size-12 aspect-square items-center justify-between p-2 rounded-full bg-[#FFB1B1]">
                        <img
                          src={item?.image || DEFAULT_PUNISH_IMAGE}
                          alt="Punishment Icon"
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-sm text-black">
                            {item?.title || item?.nama || item?.jenis || "Pelanggaran"}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDetailDateLong(item?.date || item?.tanggal || item?.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Belum ada data punishment.</p>
                )}
              </div>
            </Card>

            <Card className="py-4 rounded-2xl flex flex-col gap-4 h-48">
              <h3 className="text-xl font-semibold">Status SP</h3>
              <div className="flex items-center gap-3">
                {hasSp ? (
                  <>
                    <div className="bg-yellow-100 h-full p-3 rounded-xl flex items-center justify-center">
                      <BsExclamationOctagonFill className="text-yellow-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">{spLabel || "Memiliki SP"}</h4>
                      <p className="text-[12px] text-gray-500">
                        {spDescription || `Peserta ini terdeteksi mendapatkan ${spLabel || "surat peringatan"}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-green-100 h-full p-3 rounded-xl flex items-center justify-center">
                      <BsPatchCheckFill className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold">Tidak Ada SP</h4>
                      <p className="text-[12px] text-gray-500">Peserta ini tidak terdeteksi SP!</p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            <Card className="rounded-2xl py-4">
              <h3 className="text-lg font-semibold">Route Project</h3>
              <p className="text-sm text-gray-500 mb-4">Project yang diselesaikan</p>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {routeItems.length > 0 ? (
                  routeItems.map((item, index) => {
                    const statusRaw = item?.status || item?.progress || item?.state || "";
                    const status = toTitleCase(statusRaw);
                    const isSelesai = status.toLowerCase() === "selesai";

                    return (
                      <div key={item?.id || index} className="flex items-start gap-4">
                        <img
                          src={item?.image || item?.foto || DEFAULT_ROUTE_IMAGE}
                          alt="Project Icon"
                          className="size-12 aspect-square rounded-md object-cover"
                        />

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between w-full">
                            <p className="font-semibold text-sm w-2 text-black">
                              {item?.tahap || item?.nama || item?.judul || `Route ${index + 1}`}
                            </p>

                            <div className="flex items-center gap-2">
                              {status !== "-" && (
                                <Badge2
                                  rounded="20px"
                                  textSize="10px"
                                  color={isSelesai ? "#E7F4EE" : "#FFE4CA"}
                                  textColor={isSelesai ? "green" : "orange"}
                                  className="whitespace-nowrap"
                                >
                                  {status}
                                </Badge2>
                              )}
                              <div className="text-[10px] text-gray-400">
                                {formatDetailDateLong(item?.endDate || item?.end_date || item?.tanggal_selesai)}
                              </div>
                            </div>
                          </div>

                          <div className="text-[11px] text-gray-500">
                            {formatDetailDateLong(item?.startDate || item?.start_date || item?.tanggal_mulai)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">Belum ada route project.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FormModal
        open={isDetailModalOpen}
        onClose={closeDetailModal}
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
        fields={getDetailPesertaModalFields()}
      />

      {isImageOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999]">
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-lg">
            <img src={selectedImage} alt="Bukti" className="w-full h-auto rounded-md" />
            <button
              onClick={closeImageModal}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailPeserta;
