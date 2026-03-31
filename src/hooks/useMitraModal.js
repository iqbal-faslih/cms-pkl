import { useState } from "react";

const useMitraModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    jenis_institusi: "",
    website: "",
    foto_header: null,
    logo: null,
    jurusan: [],
    id_cabang: "1",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPartner, setDetailPartner] = useState(null);

  const openAdd = () => {
    setEditingPartner(null);
    setFormData({
      nama: "",
      alamat: "",
      telepon: "",
      jenis_institusi: "",
      website: "",
      foto_header: null,
      logo: null,
      jurusan: [],
      id_cabang: "1",
    });
    setShowModal(true);
  };

  const openEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      nama: partner.nama,
      alamat: partner.alamat,
      telepon: partner.telepon,
      jenis_institusi: partner.jenis_institusi,
      website: partner.website || "",
      foto_header: null,
      jurusan: partner.jurusan.map((j) => j.nama),
    });
    setShowModal(true);
  };

  const confirmDelete = (partner) => {
    setPartnerToDelete(partner);
    setShowDeleteModal(true);
  };

  const viewDetail = (partner) => {
    setDetailPartner(partner);
    setShowDetailModal(true);
  };

  return {
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
  };
};

export default useMitraModal;