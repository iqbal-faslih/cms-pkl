import Card from "../../../components/cards/Card";
import Badge2 from "../../../shared/components/Badge2";
import RoundedProfile from "../../../shared/components/RoundedProfile";
import BackHeader from "../../../shared/components/header/BackHeader";
import { jurnalDataConf, trackRecordConfig } from "./config";
import { useState } from "react";
import TableHeader from "../../../shared/components/table/TableHeader";
import DataTable from "../../../shared/components/table/Table";
import Button from "../../../components/Button";
import { Info, TriangleAlert } from "lucide-react";
import TrackCard from "./TrackCard";
import { useNavigate, useParams } from "react-router-dom";
import StatusModal from "../../../shared/components/modal/StatusModal";
import { divisionFields } from "./fields";
import FormModal from "../../../shared/components/modal/FormModal";
import { journalDetailFields } from "./fields";
import { Icon } from "@iconify/react";
import Notifikasi from "../../../shared/components/modal/NotifikasiModal";
import ErrorOverlay from "../../../shared/components/cards/ErrorOverlay";
import { useDetailPeserta } from "./hooks/useDetailPeserta";
import { useEffect } from "react";
import { useGantiDivisi } from "./hooks/useGantiDivisi";

const DetailPeserta = () => {
  const { id } = useParams();
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { profile, jurnal, loading, trackRecords, error, refetch } =
    useDetailPeserta(id);

  const { GantiDivisi, loading: gantiDivisiLoading } = useGantiDivisi(id);

  const [page, setPage] = useState(1);
  const totalItems = jurnal?.length;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = jurnal?.slice(startIndex, endIndex);
  const nav = useNavigate();

  const statusOptions = [
    {
      label: "IN WORK",
      value: "in_work",
      activeClass: "bg-[#306BFF] text-white",
      inactiveClass: "bg-[#F0F4FF] text-[#306BFF] hover:bg-gray-200",
    },
    {
      label: "COMPLETED",
      value: "completed",
      activeClass: "bg-[#78C552] text-white",
      inactiveClass: "text-[#78C552] bg-[#F3FAF0] hover:bg-gray-200",
    },
  ];

  const handlers = {
    handleLihatTask: (item) => nav(`revisi/${item.id}`),
  };

  const handleDetail = (row) => {
    setSelectedJournal(row);
    setIsDetailModalOpen(true);
  };

    useEffect(() => {
      if (error) setShowError(true);
    }, [error]);

  const handleDivisionSubmit = async (formData) => {
    try {
      await GantiDivisi({ id_divisi: formData.division, id_mentor: formData.mentor });
      setIsDivisionModalOpen(false);
      setNotifOpen(true);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
          <Button
            onClick={() => nav("/mentor/peserta")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* PROFILE SECTION */}
      <Card className="rounded-2xl mb-4">
        <div className="flex items-center gap-13 mb-8">
          <BackHeader title="Detail Peserta" backTo={`/mentor/peserta`} />
        </div>
        <div className="flex items-start gap-10 ml-23 mb-12">
          <RoundedProfile
            image={profile?.image}
            size="160px"
            borderColor="#306BFF"
          />
          <div className="space-y-2 w-full">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <div className="pl-5 flex items-center gap-4">
              <h2 className="text-xl text-gray-400">{profile?.role}</h2>
              <button onClick={() => setIsDivisionModalOpen(true)}>
                <Badge2 rounded="8px" textSize="14px" color="#304FFE">
                  Pindah Divisi
                </Badge2>
              </button>
            </div>
            <h4 className="text-md">
              {profile?.sekolah} | {profile?.nisn}
            </h4>
            <div className="flex mt-2 gap-x-4">
              <div className="grid grid-cols-3 gap-x-2 text-gray-600 text-sm">
                <div className="space-y-3 col-span-1">
                  <p>Email</p>
                  <p>Perusahaan</p>
                  <p>Cabang</p>
                </div>
                <div className="space-y-3 col-span-2">
                  <p className="line-clamp-1">: {profile?.email}</p>
                  <p className="line-clamp-1">: {profile?.company}</p>
                  <p className="line-clamp-1">: {profile?.branch}</p>
                </div>
              </div>
              <div className="border-r mx-5 border-gray-400" />
              <div className="grid grid-cols-3 gap-x-2 text-gray-600 text-sm">
                <div className="space-y-3 col-span-1">
                  <p>RFID</p>
                  <p>Mentor</p>
                  <p>Durasi Magang</p>
                </div>
                <div className="space-y-3 col-span-2">
                  <p className="line-clamp-1">: {profile?.rfid}</p>
                  <p className="line-clamp-1">: {profile?.mentor}</p>
                  <p className="line-clamp-1">: {profile?.internshipPeriod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* TRACK RECORD PROJECT */}
      <Card className="rounded-2xl mb-4 py-6 px-7 ">
        <h2 className="text-xl font-semibold mb-6">Track Record Project</h2>

        <div className="grid grid-cols-3 gap-x-4">
          {trackRecordConfig.columns.map((col) => {
            const records = trackRecords[col.key] || [];

            return (
              <div key={col.key} className="flex flex-col gap-y-4">
                <div className="flex items-center gap-x-5 pb-2 mb-4 border-b-2 border-gray-600">
                  <h4 className="uppercase font-medium">{col.label}</h4>
                  <div className="flex items-center bg-gray-200 rounded-full px-5 py-1">
                    <span className="text-sm font-light">{records.length}</span>
                  </div>
                </div>

                {records.map((item) => (
                  <TrackCard
                    key={item.id}
                    route={item.route}
                    task={item.task}
                    task_status={item.task_status}
                    date={item.date}
                    color={trackRecordConfig.colors[col.key]}
                    color2={trackRecordConfig.colors2[col.key]}
                    buttonLabel={trackRecordConfig.buttonLabel[col.key]}
                    onButtonClick={() =>
                      handlers[trackRecordConfig.actions[col.key]]?.(item)
                    }
                    onEllipsisClick={() => setIsStatusOpen(true)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </Card>

      {/* REKAP JURNAL */}
      <Card className="rounded-2xl">
        <TableHeader config={jurnalDataConf.headerConfig} />

        <DataTable
          config={{
            ...jurnalDataConf.tableConfig,
            columns: jurnalDataConf.tableConfig.columns.map((col) => {
              if (col.key === "actions") {
                return {
                  ...col,
                  render: (value, row) => {
                    return (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleDetail(row)}
                          className="bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-2 px-2 text-white rounded-md text-sm transition duration-300 ease-in-out"
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    );
                  },
                };
              }

              if (col.key === "gambar") {
                return {
                  ...col,
                  render: (value, row) => {
                    return (
                      <div className="flex items-center justify-center mx-auto">
                        <Button
                          onClick={() => {
                            setSelectedImage(row.bukti);
                            setIsImageOpen(true);
                          }}
                          className="bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer py-2 px-2 text-white rounded-md text-sm transition duration-300 ease-in-out"
                        >
                          <Icon
                            icon="streamline-plump:landscape-view"
                            width="28"
                            height="28"
                          />
                        </Button>
                      </div>
                    );
                  },
                };
              }

              return col;
            }),
          }}
          data={paginatedData}
          pagination={{
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: itemsPerPage,
            totalItems: totalItems,
            onPageChange: setPage,
            label: "jurnal",
          }}
        />
      </Card>

      {/* STATUS MODAL */}
      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={(val) => {
          setSelectedStatus(val);
          setIsStatusOpen(false);
          setConfirmOpen(true);
        }}
        description="Select the button that matches your progress:  
                      Completed or In Progress"
        options={statusOptions}
        initialValue={selectedStatus}
      />

      {/* PINDAH DIVISI MODAL */}
      <FormModal
        open={isDivisionModalOpen}
        onClose={() => setIsDivisionModalOpen(false)}
        title="Pindah Divisi"
        subtitle="Change the participant's division in this profile."
        fields={divisionFields}
        onSubmit={handleDivisionSubmit}
        layout={[["division", "mentor"], ["description"]]}
        actions={[
          {
            label: "Cancel",
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 w-full",
            onClick: () => setIsDivisionModalOpen(false),
          },
          {
            label: "Confirm",
            type: "submit",
            className:
              " px-6 py-2 rounded-md font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 w-full",
          },
        ]}
      />

      {/* DETAIL JURNAL MODAL */}
      <FormModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detail Data Jurnal"
        subtitle="View complete details of this journal entry."
        fields={journalDetailFields}
        initialValues={selectedJournal || {}}
        onSubmit={() => {}}
        layout={[["test"], ["judul"], ["desc"]]}
      />

      {/* NOTIFIKASI */}
      <Notifikasi
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        hideCancel={true}
        hideCloseButton={false}
        confirmText="Understood"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        title="Changes applied successfully!"
        message="Your division has been successfully changed. You may now continue to the next step."
        icon={Info}
        iconColor="text-blue-500"
        onConfirm={() => setNotifOpen(false)}
      />

      <Notifikasi
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        hideCancel={false}
        cancelText="Cancel"
        confirmText="Complete"
        confirmColor="bg-blue-600 hover:bg-blue-700"
        title="Are you sure?"
        message="You have pending revisions in this task. Are you sure the revisions are completed?  
If yes, you may proceed. Otherwise, please finish the revisions before continuing.
"
        icon={TriangleAlert}
        iconColor="text-[#E89F00]"
        onConfirm={() => setConfirmOpen(false)}
      />

      {/* MODAL GAMBAR SAJA */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-9999">
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-lg">
            <img
              src={selectedImage}
              alt="Bukti"
              className="w-full h-auto rounded-md"
            />

            <button
              onClick={() => setIsImageOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <ErrorOverlay
        open={showError}
        message={error?.response?.data?.message}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
        onClose={() => setShowError(false)}
      />
    </>
  );
};

export default DetailPeserta;
