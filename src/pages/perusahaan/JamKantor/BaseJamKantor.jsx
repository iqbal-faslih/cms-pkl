import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import FormModal from "../../../shared/components/modal/FormModal";
import ModalAddSesi from "../../../shared/config/Perusahaan/ModalAddSesi";

export default function BaseJamKantor() {
  const sessions = [
    { title: "Data Peserta Sesi 1", total: 25 },
    { title: "Data Peserta Sesi 2", total: 25 },
    { title: "Data Peserta Sesi 3", total: 25 },
    { title: "Data Peserta Sesi 4", total: 25 },
  ];

  const [openModal, setOpenModal] = useState(false);

  const formFields = [
    {
      name: "namaSesi",
      label: "Nama Sesi",
      type: "text",
      required: true,
      placeholder: "Masukkan nama sesi",
    },
    {
      name: "kuota",
      label: "Kuota Peserta",
      type: "number",
      required: true,
      placeholder: "Masukkan jumlah kuota peserta",
    },
  ];

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const updateSesiFields = [
    {
      name: "namaSiswa",
      label: "Nama Siswa",
      type: "text",
      required: true,
      readonly: false,
    },
    {
      name: "sesi",
      label: "Sesi",
      type: "select",
      required: true,
      placeholder: "Pilih Sesi",
      options: [
        { label: "Sesi 1", value: "1" },
        { label: "Sesi 2", value: "2" },
        { label: "Sesi 3", value: "3" },
        { label: "Sesi 4", value: "4" },
      ],
    },
  ];

  const updateSesiLayout = [["namaSiswa"], ["sesi"]];

  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex min-h-screen bg-[#ECF2FF] font-sans">
      <main className="flex-1 p-2">
        {/* banner */}
        

        <div className="bg-white rounded-xl shadow p-10">
          
          <div className="flex justify-center lg:justify-end mb-6 gap-3">
            <h2 className="w-98 font-semibold text-lg">Jam Kantor <br /><span className="text-[#16C098] text-sm font-normal">Atur waktu operasional kantor dengan mudah</span></h2>
            <button
              onClick={() => setOpenUpdateModal(true)}
              className="flex items-center gap-3 px-5 py-3 bg-[#304FFE] text-white rounded-lg whitespace-nowrap hover:bg-blue-800 duration-300 hover:duration-300 transition text-[10px] md:text-sm font-medium"
            >
              <Icon
                icon="lucide:pencil-line"
                width="21"
                className="p-0.5 border-2 border-white rounded-md"
              />
              Update Sesi
            </button>

            <Link
              to="/perusahaan/jam-kantor-setting"
              className="flex items-center gap-2 px-5 py-3 bg-[#304FFE] text-white rounded-lg whitespace-nowrap shadow hover:bg-blue-800 duration-300 hover:duration-300 transition text-[10px] md:text-sm font-medium"
            >
              <Icon icon="mingcute:time-line" width="24" />
              Setting Jam Kantor
            </Link>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#304FFE] text-white rounded-lg whitespace-nowrap hover:bg-blue-800 duration-300 hover:duration-300 transition text-[10px] md:text-sm font-medium"
            >
              <Icon icon="mynaui:plus-square" width="24" />
              Tambah Sesi
            </button>
          </div>

          {/* session grup */}
          <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {sessions.map((item, idx) => (
              <SessionCard key={idx} title={item.title} total={item.total} />
            ))}
          </div>
        </div>
        </div>
      </main>

      {/* form modal */}
      <ModalAddSesi
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={(data) => {
          console.log("Data sesi baru:", data);
          setOpenModal(false);
        }}
      />

      {/* modal update sesi */}
      <FormModal
        key={resetKey}
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onSubmit={(formData) => {
          console.log("Update sesi siswa:", formData);
          setOpenUpdateModal(false);
        }}
        title="Edit Sesi Siswa"
        subtitle=""
        showClose={true}
        fields={updateSesiFields}
        layout={updateSesiLayout}
        initialValues={{
          namaSiswa: selectedStudent?.nama || "Reivan Elsyafir Pratama",
          sesi: selectedStudent?.sesi || "",
        }}
        actions={[
          {
            label: "Reset",
            type: "button",
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-600 hover:bg-gray-400 hover:text-white transition duration-300 hover:duration-300 hover:scale-105 w-full",
            onClick: () => {
              setResetKey((prev) => prev + 1);
            },
          },
          {
            label: "Simpan",
            type: "submit",
            className:
              "px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-800 transition duration-300 hover:duration-300 hover:scale-105 w-full",
          },
        ]}
      />
    </div>
  );
}

const SessionCard = ({ title, total }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md/30 transition">
      <div className="bg-blue-50 rounded-lg flex justify-center items-center h-32 mb-4 overflow-hidden">
        <img src="/assets/img/Cover3.png" alt={title} className="w-full h-auto object-contain" />
      </div>

      <h2 className="font-semibold text-base mb-2">{title}</h2>

      <hr className="w-[267px] mb-3 text-gray-300" />

      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-blue-600" />
        <p className="text-gray-600 text-sm">{total} Peserta</p>
      </div>

      <Link
        to={`/perusahaan/jam-kantor-sesi?sesi=${title}`}
        className="flex justify-center w-full py-2 bg-[#304FFE] text-white rounded-lg hover:bg-[#1127a5] duration-300 hover:duration-300 transition text-sm"
      >
        Lihat Detail
      </Link>
    </div>
  );
};
