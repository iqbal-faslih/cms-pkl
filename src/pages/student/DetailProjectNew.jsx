import React, { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjectDetailStore from "../../stores/useProjectDetailStore";
import EditRevisionModal from "../../components/modal/EditRevisionModal";

import ProjectHeader from "../../components/cards/student/ProjectHeader";
import ProgresProject from "../../components/cards/ProgresProject";
import MentorCard from "../../components/cards/student/MentorCard";
import StatusFilter from "../../components/cards/student/StatusFilter";
import AddRevisionButton from "../../components/cards/student/AddRevisionbutton";
import RevisionCard from "../../components/cards/RevisionCard";
import { statusColors } from "../../utils/revisionUtils";

const DetailProjectNew = () => {
    const { routeId } = useParams();

    // Mengambil state dan fungsi dari store Zustand
    const {
        detailProject,
        detailLoading,
        detailError,
        activeFilter,
        fetchDetailProject,
        setActiveFilter,
        handleAddRevision,
        handleAddTask,
        handleUpdateTask,
        handleUpdateRevision,
    } = useProjectDetailStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRevision, setSelectedRevision] = useState(null);

    const openEditModal = (revisi) => {
    setSelectedRevision(revisi);
    setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedRevision(null);
    };

    const handleSaveEdit = (updatedRevisi) => {
    handleUpdateRevision(updatedRevisi.id, updatedRevisi); 
    closeEditModal();
    };

    // Memanggil fetch data saat komponen dimuat
    useEffect(() => {
        if (routeId) {
            fetchDetailProject(routeId);
        }
    }, [routeId, fetchDetailProject]);

    if (detailLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                <span className="ml-3">Memuat data proyek...</span>
            </div>
        );
    }

    if (detailError) {
        return <div className="text-center p-8 text-red-600">Terjadi kesalahan: {detailError}</div>;
    }

    if (!detailProject) {
        return <div className="text-center p-8 text-gray-500">Tidak ada data proyek tersedia.</div>;
    }

    const { route = {}, mentor = null } = detailProject;
    const revisions = detailProject.revisi;

    // Menghitung progress
    const completedRevisi = revisions.filter(r => r.status === "selesai").length;
    const totalRevisi = revisions.length;
    const progressPercent = totalRevisi === 0 ? 0 : ((completedRevisi / totalRevisi) * 100).toFixed(1);

    // Filter dan mengurutkan revisi
    const filteredRevisi = useMemo(() => {
        if (activeFilter === "semua") return revisions;
        return revisions.filter(rev => rev.status.toLowerCase() === activeFilter);
    }, [revisions, activeFilter]);

    const sortedRevisi = useMemo(() => {
        return [...filteredRevisi].sort((a, b) => b.id - a.id);
    }, [filteredRevisi]);

    const projectName = route?.nama || "Belum diketahui";
    const mentorName = mentor?.user?.nama || "Belum diketahui";
    const mentorTitle = mentor?.divisi?.nama || "Belum diketahui";
    const mentorPhotoUrl = mentor?.user?.foto || "";
    const studentTitle = route?.user?.divisi?.nama || "Belum diketahui";

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg p-8 shadow-md">
                    <ProjectHeader
                        projectTitle={projectName}
                        studentTitle={studentTitle}
                    />

                    <div className="my-8 space-y-2">
                        <h2 className="text-md font-semibold">Progress Kamu</h2>
                        <ProgresProject progressPercent={parseFloat(progressPercent)} />
                    </div>

                    <div className="my-8">
                        <MentorCard
                            mentorName={mentorName}
                            mentorTitle={mentorTitle}
                            mentorPhotoUrl={mentorPhotoUrl}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <StatusFilter onFilterChange={setActiveFilter} allRevisi={revisions} />
                        <AddRevisionButton onClick={handleAddRevision} />
                    </div>

                    <div className="border-t border-gray-200 mt-4"></div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedRevisi.map(rev => {
                            const statusKey = rev.isLate ? "terlambat" : rev.status.toLowerCase();
                            const { backgroundClass, statusText, icon } = statusColors[statusKey] || {};

                            return (
                                <RevisionCard
                                    key={rev.id}
                                    revisi={rev}
                                    backgroundClass={backgroundClass}
                                    statusText={statusText}
                                    icon={icon}
                                    onAddTask={handleAddTask}
                                    onUpdateTask={handleUpdateTask}
                                    onEditClick={() => openEditModal(rev)}
                                />
                            );
                        })}

                        {selectedRevision && (
                          <EditRevisionModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            revisi={selectedRevision}
                            onSave={handleSaveEdit}
                          />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProjectNew;