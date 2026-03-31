import React, { useContext } from "react";
import { Calendar } from "lucide-react";
import AddJobModal from "../../../components/modal/AddJobModal";
import LowonganTable from "../../../components/lowongan/LowonganTable";
import LowonganSummaryCards from "../../../components/lowongan/LowonganSummaryCards";
import LowonganDetailSidebar from "../../../components/lowongan/LowonganDetailSidebar";
import CompanyWelcomeCard from "../../../components/perusahaan/CompanyWelcomeCard";
import { useLowonganData } from "../../../hooks/useLowonganData";
import { AuthContext } from "../../../contexts/AuthContext";
import { useLowonganViewState } from "./hooks/useLowonganViewState";

export default function Lowongan() {
  const {
    showModal,
    setShowModal,
    loading,
    editingData,
    filteredData,
    summaryCardsData,
    lowongan,
    selectedJob,
    selectedJobDetail,
    detailLoading,
    handleModalSuccess,
    handleAddNewJob,
    handleChevronClick,
    handleEditJob,
    handleCloseDetail,
    handleJobDetailSuccess,
    handleDeleteJob,
  } = useLowonganData();

  const { role } = useContext(AuthContext);
  const { searchQuery, setSearchQuery, showFilter, setShowFilter, companyName, visibleData } =
    useLowonganViewState({ filteredData, lowongan });

  return (
    <div className="bg-[#edf2ff] min-h-screen py-6">
      <div className="max-w-[1440px] mx-auto px-5">
        {role && String(role).toLowerCase() === "perusahaan" ? (
          <div className="mb-3">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 mb-0">
              <CompanyWelcomeCard companyName={companyName} />

              <div className="xl:col-span-3 bg-[#f3f6ff] border border-[#dbe4ff] rounded-2xl px-3 py-1 min-h-[180px] flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                  <LowonganSummaryCards summaryCardsData={summaryCardsData} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Cabang Perusahaan
            </h1>
            <p className="text-xs text-teal-600">
              Kelola data cabang perusahaan
            </p>
          </div>
        )}

        <div className={`flex gap-4 ${selectedJob ? "flex-col xl:flex-row" : "flex-col"}`}>
          <LowonganTable
            filteredData={visibleData}
            loading={loading}
            handleAddNewJob={handleAddNewJob}
            searchQuery={searchQuery}
            onViewJob={handleChevronClick}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
            role={role}
            onSearchChange={(event) => setSearchQuery(event.target.value)}
            onToggleFilter={() => setShowFilter((prev) => !prev)}
            filterOpen={showFilter}
            renderFilterPanel={() => (
              <div className="bg-white rounded-xl">
                <div className="px-4 py-3 border-b border-[#d7dfef]">
                  <h3 className="text-[24px] leading-none font-semibold text-[#222]">
                    Filter
                  </h3>
                </div>

                <div className="p-4 space-y-5">
                  <div>
                    <label className="block text-base font-semibold text-slate-900 mb-2">
                      Tanggal Pembuatan
                    </label>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="block mb-1">Dari :</span>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            className="w-full rounded-md border border-[#d7dfef] bg-white pl-8 pr-2 py-2 text-xs text-slate-700 shadow-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="block mb-1">Ke :</span>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            className="w-full rounded-md border border-[#d7dfef] bg-white pl-8 pr-2 py-2 text-xs text-slate-700 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#d7dfef] pt-4">
                    <label className="block text-base font-semibold text-slate-900 mb-3">
                      Pilih Status
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 text-base text-slate-700">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-slate-300" />
                        Berlangsung
                      </label>
                      <label className="flex items-center gap-3 text-base text-slate-700">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-slate-300" />
                        Selesai
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-[#d7dfef] pt-4 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 rounded-md border border-[#d7dfef] px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-md bg-[#3c68ff] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3158dc]"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}
          />

          <LowonganDetailSidebar
            selectedJob={selectedJob}
            selectedJobDetail={selectedJobDetail}
            showModal={showModal}
            handleCloseDetail={handleCloseDetail}
            handleEditJob={handleEditJob}
            handleJobDetailSuccess={handleJobDetailSuccess}
            detailLoading={detailLoading}
            className="xl:w-[380px] w-full"
            sticky={false}
          />
        </div>

        <AddJobModal
          showModal={showModal}
          setShowModal={setShowModal}
          editingData={editingData}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
}
