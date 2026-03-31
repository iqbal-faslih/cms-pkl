import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../Loading";
import AddEditModal from "../../components/modal/AddEditModal";
import DeleteModal from "../../components/modal/DeleteModal";
import DetailModal from "../../components/modal/DetailModal";
import useDaftarMitra from "../../hooks/useDaftarMitra";
import useMitraModal from "../../hooks/useMitraModal";
import MitraFilterBar from "./MitraFilterBar";
import MitraGrid from "./MitraGrid";

const categories = ["All", "Sekolah", "Universitas", "Politeknik"];

export default function DaftarMitra() {
  const { partners, loading, fetchAllData } = useDaftarMitra();
  const {
    showModal,
    setShowModal,
    editingPartner,
    formData,
    setFormData,
    showDeleteModal,
    setShowDeleteModal,
    partnerToDelete,
    setPartnerToDelete,
    deleteLoading,
    setDeleteLoading,
    showDetailModal,
    setShowDetailModal,
    detailPartner,
    openAdd,
    openEdit,
    confirmDelete,
    viewDetail,
  } = useMitraModal();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered =
    selectedCategory === "All"
      ? partners
      : partners.filter((p) => p.jenis_institusi === selectedCategory);

  const handleDelete = async () => {
    if (!partnerToDelete) return;
    setDeleteLoading(true);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/mitra/${partnerToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowDeleteModal(false);
      setPartnerToDelete(null);
      window.location.href = "/perusahaan/mitra";
    } catch (err) {
      console.error("Gagal menghapus mitra:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const BASE_URL = import.meta.env.VITE_API_URL_FILE + "/storage";

  if (loading) return <Loading />;

  return (
    <div className="p-2 min-h-screen">
      <div className="max-w-9xl mx-auto space-y-6">
        <MitraFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddClick={openAdd}
          categories={categories}
        />

        <MitraGrid
          filtered={filtered}
          baseUrl={BASE_URL}
          onDelete={confirmDelete}
          onEdit={openEdit}
          onView={viewDetail}
        />
      </div>

      {/* Modals */}
      {showModal && (
        <AddEditModal
          show={showModal}
          onClose={() => setShowModal(false)}
          editingPartner={editingPartner}
          formData={formData}
          setFormData={setFormData}
          onSave={fetchAllData}
          categories={categories.filter((cat) => cat !== "All")}
        />
      )}

      {showDeleteModal && partnerToDelete && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          partnerToDelete={partnerToDelete}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />
      )}

      {showDetailModal && detailPartner && (
        <DetailModal
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          partner={detailPartner}
          baseUrl={BASE_URL}
        />
      )}
    </div>
  );
}