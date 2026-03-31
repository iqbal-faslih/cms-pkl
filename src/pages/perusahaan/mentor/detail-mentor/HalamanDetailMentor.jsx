import React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import Card from "@/components/cards/Card";
import Button from "@/components/Button";
import AddStudentModal from "@/components/modal/AddStudentModal";
import ChangeDivisionModal from "@/components/modal/ChangeDivisionModal";
import Search from "@/shared/components/Search";
import { useMentorDetailPage } from "../hooks/useMentorDetailPage";
import { resolveStudentRowData } from "../helpers/mentorResolvers";

const DetailMentorSkeleton = () => (
  <Card className="rounded-2xl p-5 lg:p-6">
    <div className="animate-pulse">
      <div className="h-5 w-5 rounded bg-slate-200 mb-4" />

      <div className="flex flex-col lg:flex-row gap-7 mt-1">
        <div className="lg:w-[285px] w-full border-r-0 lg:border-r border-gray-200 lg:pr-8">
          <div className="h-6 w-32 rounded bg-slate-200 mb-6" />
          <div className="flex flex-col items-center">
            <div className="w-[118px] h-[118px] rounded-full bg-slate-200" />
            <div className="h-9 w-40 rounded bg-slate-200 mt-6" />
            <div className="h-6 w-24 rounded-full bg-slate-200 mt-3" />
            <div className="h-10 w-36 rounded-xl bg-slate-200 mt-7" />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[520px]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
            <div>
              <div className="h-8 w-64 rounded bg-slate-200" />
              <div className="h-4 w-36 rounded bg-slate-200 mt-2" />
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="h-9 w-full sm:w-[360px] rounded bg-slate-200" />
              <div className="h-9 w-32 rounded bg-slate-200" />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <div className="w-full min-w-[860px]">
              <div className="h-11 rounded bg-slate-200 mb-3" />
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`mentor-detail-skeleton-row-${index}`} className="h-14 rounded bg-slate-100 mb-2" />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-6">
            <div className="h-4 w-64 rounded bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-slate-200" />
              <div className="h-8 w-8 rounded bg-slate-200" />
              <div className="h-8 w-8 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

const MentorSidebar = ({ mentorPhoto, mentorName, mentorDivision, onAddStudent }) => (
  <div className="lg:w-[285px] w-full border-r-0 lg:border-r border-gray-200 lg:pr-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-gray-800 font-semibold text-lg">Detail Mentor</h2>
      <MoreVertical size={16} className="text-gray-400" />
    </div>

    <div className="flex flex-col items-center">
      {mentorPhoto ? (
        <img
          src={mentorPhoto}
          alt={mentorName}
          className="w-[118px] h-[118px] rounded-full object-cover shadow"
        />
      ) : (
        <div className="w-[118px] h-[118px] rounded-full bg-slate-100 border flex items-center justify-center text-3xl font-bold text-slate-600">
          {mentorName?.charAt(0)?.toUpperCase() || "M"}
        </div>
      )}

      <h3 className="font-semibold text-[36px] leading-[1.05] text-center mt-6 max-w-[230px] break-words">
        {mentorName}
      </h3>
      <span className="text-[11px] bg-blue-700 text-white px-4 py-1.5 rounded-full mt-2 font-semibold tracking-wide shadow-sm border border-blue-300/60">
        {mentorDivision}
      </span>
      <Button
        onClick={onAddStudent}
        className="mt-7 bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-xl text-sm font-semibold"
      >
        Tambah Siswa
      </Button>
    </div>
  </div>
);

const StudentTable = ({
  currentData,
  page,
  itemsPerPage,
  resolveStudentDivision,
  resolveStudentPhotoUrl,
  handleOpenChangeDivisionModal,
}) => (
  <div className="overflow-x-auto flex-1">
    <table className="w-full min-w-[860px] border-collapse table-auto">
      <thead>
        <tr className="text-[#8B93A4] text-[15px] border-b border-[#E8EEF9]">
          <th className="py-3 px-3 text-left font-semibold w-[80px] align-middle">Number</th>
          <th className="py-3 px-3 text-left font-semibold min-w-[220px] align-middle">Name</th>
          <th className="py-3 px-3 text-left font-semibold min-w-[260px] align-middle">Email</th>
          <th className="py-3 px-3 text-left font-semibold min-w-[210px] align-middle">Asal Sekolah</th>
          <th className="py-3 px-3 text-right font-semibold w-[160px] align-middle">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {currentData.length > 0 ? (
          currentData.map((student, index) => {
            const rowData = resolveStudentRowData(student, index);
            const studentDivision = resolveStudentDivision(student);
            const studentPhoto = resolveStudentPhotoUrl(student);
            return (
              <tr key={rowData.rowKey} className="border-b border-[#E8EEF9]">
                <td className="py-3 px-3 text-sm text-gray-800 align-middle whitespace-nowrap">
                  {(page - 1) * itemsPerPage + index + 1}
                </td>
                <td className="py-3 px-3 text-sm text-gray-800 align-middle">
                  <div className="flex items-center gap-3">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt={rowData.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                        {rowData.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                    )}
                    <span className="font-medium text-[15px] truncate" title={rowData.name}>
                      {rowData.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-gray-800 align-middle">
                  <span className="block truncate" title={rowData.email}>
                    {rowData.email}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-gray-800 align-middle">
                  <span className="block truncate" title={rowData.school}>
                    {rowData.school}
                  </span>
                </td>
                <td className="py-3 px-3 text-sm text-right align-middle">
                  <Button
                    onClick={() => handleOpenChangeDivisionModal(student)}
                    className="inline-flex h-9 items-center justify-center bg-[#0D5EF4] hover:bg-[#0a53d8] text-white rounded-lg px-4 text-sm leading-none font-semibold min-w-[126px]"
                    title={studentDivision}
                  >
                    Pindah Divisi
                  </Button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
              Tidak ada data siswa bimbingan
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const HalamanDetailMentor = () => {
  const {
    id,
    loading,
    navigate,
    mentorRouteBase,
    mentorName,
    mentorDivision,
    mentorPhoto,
    companyId,
    currentData,
    page,
    setPage,
    totalItems,
    totalPages,
    itemsPerPage,
    paginationItems,
    rangeStart,
    rangeEnd,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    sortNewest,
    sortOldest,
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
    isChangeDivisionModalOpen,
    setIsChangeDivisionModalOpen,
    selectedStudent,
    effectiveDivisionId,
    resolveStudentDivision,
    resolveStudentPhotoUrl,
    handleOpenAddStudentModal,
    handleOpenChangeDivisionModal,
    handleRefreshData,
  } = useMentorDetailPage();

  if (loading) {
    return <DetailMentorSkeleton />;
  }

  return (
    <Card className="rounded-2xl p-5 lg:p-6">
      <div className="flex items-center mb-3">
        <button onClick={() => navigate(mentorRouteBase)} className="p-1">
          <ArrowLeft size={20} className="text-gray-700 cursor-pointer" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-7 mt-1">
        <MentorSidebar
          mentorPhoto={mentorPhoto}
          mentorName={mentorName}
          mentorDivision={mentorDivision}
          onAddStudent={handleOpenAddStudentModal}
        />

        <div className="flex-1 flex flex-col min-h-[520px]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-semibold text-[24px] leading-tight lg:whitespace-nowrap">
                Detail Siswa Bimbingan
              </h2>
              <p className="text-[12px] text-[#1FC89A] mt-1">Peserta Active & Non Active</p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="w-full sm:w-[400px]">
                <Search
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                <select
                  className="h-8 border border-gray-300 rounded-md px-2 text-[11px] text-gray-500 bg-white min-w-[118px]"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value={sortNewest}>Terbaru - Lama</option>
                  <option value={sortOldest}>Lama - Terbaru</option>
                </select>
              </div>
            </div>
          </div>

          <StudentTable
            currentData={currentData}
            page={page}
            itemsPerPage={itemsPerPage}
            resolveStudentDivision={resolveStudentDivision}
            resolveStudentPhotoUrl={resolveStudentPhotoUrl}
            handleOpenChangeDivisionModal={handleOpenChangeDivisionModal}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-6 text-xs text-gray-500">
            <span>
              Showing data {rangeStart} to {rangeEnd} of {totalItems} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="w-8 h-8 border border-gray-200 rounded-md disabled:opacity-40"
              >
                {"<"}
              </button>
              {paginationItems.map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => setPage(item)}
                    className={`w-8 h-8 rounded-md text-xs border ${
                      page === item
                        ? "bg-[#2E66F8] border-[#2E66F8] text-white"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 border border-gray-200 rounded-md disabled:opacity-40"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        mentorId={id}
        divisionId={effectiveDivisionId}
        divisionName={mentorDivision}
        companyId={companyId}
        mentorName={mentorName}
        onSuccess={handleRefreshData}
      />

      <ChangeDivisionModal
        isOpen={isChangeDivisionModalOpen}
        onClose={() => setIsChangeDivisionModalOpen(false)}
        student={selectedStudent}
        onSuccess={handleRefreshData}
      />
    </Card>
  );
};

export default HalamanDetailMentor;
