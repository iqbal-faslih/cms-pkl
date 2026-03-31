import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DataPenerimaan from "./components/DataPenerimaan";
import DataPeringatan from "./components/DataPeringatan"
import WarningLetterModal from "@/components/modal/WarningLetterModal";
import Search from "@/shared/components/Search";
import ExportButton from "../../../ExportButton";
import SortButton from "../../../shared/components/button/Sort";
import Checkbox from "../../../shared/components/Checkbox";
import { Icon } from "@iconify/react";
import FilterDropButton from "../../../shared/components/button/FilterDrop";
import Card from "../../../components/cards/Card";
import TableHeader from "../../../shared/components/table/TableHeader";
import { suratConf } from "./config";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";

export default function DataSurat() {
  const [activeTab, setActiveTab] = useState("DataPenerimaan");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataPeringatan, setSelectedDataPeringatan] = useState(null);
  const [dataPenerimaan, setDataPenerimaan] = useState([]);
  const [dataPeringatan, setDataPeringatan] = useState([]);
  const nav = useNavigate();

  const handleBuatSurat = (id) => {
    const selectedData = dataPeringatan.find((item) => item.id === id);
    setSelectedDataPeringatan(selectedData);
    setIsModalOpen(true);
  };

  const [tempJurusan, setTempJurusan] = useState({
    rpl: false,
    dkv: false,
    tkj: false,
    uiux: false,
  });

  const [selectedJurusan, setSelectedJurusan] = useState({
    rpl: false,
    dkv: false,
    tkj: false,
    uiux: false,
  });

  // sort option
  const [sortOption, setSortOption] = useState("latest");
  const sortOptions = [
    { label: "Terbaru - Lama", value: "latest" },
    { label: "Terlama - Baru", value: "oldest" },
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
  ];

  return (
    <div className="w-full">
      <Card className="rounded-2xl shadow-md ">
        <TableHeader
          config={{
            split: true,
            title: suratConf.headerConfig.title,
            subtitle: suratConf.headerConfig.subtitle,
            subtitleColor: suratConf.headerConfig.subtitleColor,
            titleLeftActions: [
              <div className="flex gap-2">
                {["DataPenerimaan", "DataPeringatan"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-2 md:px-5 md:py-2 rounded-lg text-[12px] md:text-sm border ${
                      activeTab === tab
                        ? "bg-[#0D5EF4] text-white"
                        : "border-gray-300 hover:bg-gray-200 duration-300 text-[#667797]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "DataPenerimaan"
                      ? "Surat Penerimaan"
                      : "Surat Peringatan"}
                  </button>
                ))}
              </div>,
            ],
            titleRightActions: [],

            bottom: {
              left: [
                <Search
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-indigo-300/10 lg:py-2.5 w-115"
                  iconClass="text-blue-500"
                />,
              ],

              right: [
                <SortButton
                  label={
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:filter-list-rounded"
                        className="w-4 h-4"
                      />
                      <span>
                        {sortOptions.find((o) => o.value === sortOption)?.label}
                      </span>
                      <Icon
                        icon="mdi:chevron-down"
                        className="w-4 h-4 text-gray-500"
                      />
                    </div>
                  }
                  showIcon={false}
                  options={sortOptions}
                  onSelect={(value) => setSortOption(value)}
                  className="text-[10px] md:text-sm font-normal text-[#667797]"
                  dropdownClassName="text-gray-700"
                />,
                <ExportButton
                  tableId={
                    activeTab === "DataPenerimaan"
                      ? "table-penerimaan"
                      : "table-peringatan"
                  }
                  filename={`data_${activeTab}.csv`}
                  className="border-none text-[10px] md:text-sm bg-teal-500/90 text-white px-6 py-2 rounded-lg hover:bg-teal-600/90 transition"
                />,

                <div>
                  {activeTab === "DataPeringatan" && (
                    <Button
                      onClick={() => nav("create/surat-peringatan")}
                      className="flex rounded-lg bg-blue-600 text-sm transition-colors duration-150 hover:bg-blue-700 items-center gap-1 px-4 py-2 text-white"
                    >
                      <span>Tambah Data</span>
                    </Button>
                  )}
                </div>,

                <FilterDropButton
                  showDateFilter={true}
                  dateLabel="Tanggal Pembuatan"
                  width="w-[359px] left-0 md:left-auto md:right-0 "
                  title="Filter"
                  content={{
                    render: () => (
                      <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium">Jurusan</p>

                        {[
                          ["RPL", "rpl"],
                          ["DKV", "dkv"],
                          ["TKJ", "tkj"],
                          ["UI/UX", "uiux"],
                        ].map(([label, key]) => (
                          <Checkbox
                            key={key}
                            label={label}
                            checked={tempJurusan[key]}
                            onChange={() =>
                              setTempJurusan((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            boxClass="w-4 h-4 border border-gray-400 rounded-md data-[checked=true]:bg-[#304FFE]"
                            checkIconClass="text-white"
                          />
                        ))}
                      </div>
                    ),

                    onApply: ({ dateFrom, dateTo }) => {
                      setSelectedJurusan(tempJurusan);
                      setSelectedDate({
                        from: dateFrom,
                        to: dateTo,
                      });
                    },
                  }}
                />,
              ],
            },
          }}
        />

        <div className="mt-4">
          {activeTab === "DataPenerimaan" ? (
            <>
              <DataPenerimaan
                data={dataPenerimaan}
                searchTerm={searchTerm}
                selectedDate={selectedDate}
                selectedJurusan={selectedJurusan}
                sortOption={sortOption}
              />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-2">
                Total data peringatan: {dataPeringatan.length}
              </p>
              <DataPeringatan
                data={dataPeringatan}
                searchTerm={searchTerm}
                selectedDate={selectedDate}
                onBuatSurat={handleBuatSurat}
              />
            </>
          )}
        </div>
      </Card>

      <WarningLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataPeringatan={selectedDataPeringatan}
        // onSucces={fetchData}
      />
    </div>
  );
}
