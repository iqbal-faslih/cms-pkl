import React, { useState, useEffect, useContext } from "react";
import TableHeader from "@/shared/components/table/TableHeader";
import DataTable from "@/shared/components/table/Table";
import FormModal from "@/shared/components/modal/FormModal";
import { RfidCabangConfig } from "../../pages/cabang/CabangRFID/RfidCabangConfig";
import Notifikasi from "@/shared/components/modal/NotifikasiModal";
import { useRfid } from "../../pages/perusahaan/RFID/hooks/useRfidperusahaan";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import { usePesertaOptions } from "../../pages/perusahaan/RFID/hooks/usePesertaOptions";
import { getRfidFields } from "../../pages/cabang/CabangRFID/Fields";
import { useRfidActions } from "../../pages/perusahaan/RFID/hooks/useRfidActions";
import { AuthContext } from "../../contexts/AuthContext";

export default function RfidCabangPage() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [tanggalFrom, setTanggalFrom] = useState(null);
  const [tanggalTo, setTanggalTo] = useState(null);

  const [magangFrom, setMagangFrom] = useState(null);
  const [magangTo, setMagangTo] = useState(null);

  const {
    data,
    loading,
    error: fetchError,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handlePageChange,
    applyFilters,
    resetFilters,
    setSortOption,
    refetch,
  } = useRfid({ itemsPerPage: 10 });

  const {
    actionError,
    handleCreate,
    handleUpdate,
    handleDelete,
    isSubmitting,
    isUpdating,
    isDeleting,
  } = useRfidActions(editData, deleteData, () => refetch());

  const filterState = {
    apply: ({ dateFrom, dateTo, magangFrom, magangTo }) => {
      applyFilters({
        dateFrom,
        dateTo,
        magangFrom,
        magangTo,
      });
    },

    reset: () => {
      setTanggalFrom(null);
      setTanggalTo(null);
      setMagangFrom(null);
      setMagangTo(null);
      resetFilters();
    },
  };

  const openAdd = () => setIsTambahOpen(true);

  const openEdit = (row) => {
    setEditData(row);
    setIsEditOpen(true);
  };

  const openDelete = (row) => {
    setDeleteData(row);
    setIsDeleteOpen(true);
  };

  const config = RfidCabangConfig(
    tanggalFrom,
    setTanggalFrom,
    tanggalTo,
    setTanggalTo,
    magangFrom,
    setMagangFrom,
    magangTo,
    setMagangTo,
    filterState,
    searchTerm,
    setSearchTerm,
    { openAdd, setSortValue: setSortOption, openDelete, openEdit }
  );

  const { options: pesertaOptions, loading: pesertaLoading } =
    usePesertaOptions(isTambahOpen, userId);

  useEffect(() => {
    if (fetchError) {
      setErrorMessage(
        fetchError?.response?.data?.message || "Gagal mengambil data"
      );
      setShowError(true);
    }
  }, [fetchError]);

  useEffect(() => {
    if (actionError) {
      setErrorMessage(
        actionError?.response?.data?.message || "Gagal memproses permintaan"
      );
      setShowError(true);
    }
  }, [actionError]);

  return (
    <div className="bg-white rounded-2xl p-4">
      <TableHeader config={config.headerConfig} />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : data?.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">
            {searchTerm
              ? `Tidak ada hasil untuk "${searchTerm}"`
              : "Tidak ada data rfid"}
          </div>
        </div>
      ) : (
        <DataTable
          config={config.tableConfig}
          data={data}
          pagination={{
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            onPageChange: handlePageChange,
          }}
        />
      )}

      <FormModal
        open={isTambahOpen}
        title="TAMBAH RFID"
        fields={getRfidFields(pesertaOptions, pesertaLoading)}
        onClose={() => setIsTambahOpen(false)}
        onSubmit={async (formData) => {
          const success = await handleCreate(formData);
          if (success) setIsTambahOpen(false);
        }}
        actions={[
          {
            label: "Batal",
            onClick: () => setIsTambahOpen(false),
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 w-full",
            disabled: isSubmitting,
          },
          {
            label: isSubmitting ? "Menyimpan..." : "Simpan",
            type: "submit",
            loading: isSubmitting,
            className:
              "px-6 py-2 rounded-md font-semibold text-white bg-blue-600 w-full",
          },
        ]}
      />

      <FormModal
        open={isEditOpen}
        title="Edit RFID Siswa"
        fields={[
          {
            name: "rfidSiswa",
            label: "Kode RFID",
            type: "text",
            required: true,
          },
        ]}
        initialValues={{ rfidSiswa: editData?.rfid_code || "" }}
        onClose={() => setIsEditOpen(false)}
        onSubmit={async (formData) => {
          const success = await handleUpdate(formData);
          if (success) setIsEditOpen(false);
        }}
        actions={[
          {
            label: "Batal",
            onClick: () => setIsEditOpen(false),
            disabled: isUpdating,
            className:
              "px-6 py-2 rounded-md border border-gray-200 font-semibold text-gray-700 w-full",
          },
          {
            label: isUpdating ? "Menyimpan..." : "Simpan Perubahan",
            type: "submit",
            loading: isUpdating,
            className:
              "px-6 py-2 rounded-md font-semibold text-white bg-blue-600 w-full",
          },
        ]}
      />

      <Notifikasi
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          const success = await handleDelete();
          if (success) setIsDeleteOpen(false);
        }}
        confirmLoading={isDeleting}
        title="Hapus RFID"
        message={`Yakin hapus RFID ${deleteData?.name || ""}?`}
      />

      <ErrorOverlay
        open={showError}
        message={errorMessage}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
        onClose={() => setShowError(false)}
      />
    </div>
  );
}
