import React from "react";
import { usePesertaData } from "../../hooks/siswa";
import { ProfileSkeleton } from "../skeletons/siswa/account-settings";
import { PersonalDataSection } from "../peserta/PersonalDataSection";
import { AssignmentSection } from "../peserta/AssignmentSection";
import { FileUploadSection } from "../peserta/FileUploadSection";

const DataDiriCard = () => {
  const {
    data: dataPeserta,
    loading,
    error,
    coverImage,
    profileImage,
    setCoverImage,
    setProfileImage,
    refetch,
  } = usePesertaData();

  if (loading) {
    return <DataDiriCardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center py-8">
          <i className="bi bi-exclamation-circle text-4xl text-red-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.response?.data?.message ||
              error?.message ||
              "Gagal mengambil data peserta"}
          </p>
        </div>
      </div>
    );
  }

  if (!dataPeserta) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="text-center py-8">
          <i className="bi bi-person-x text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Data Tidak Ditemukan
          </h3>
          <p className="text-gray-600">Data peserta tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 min-h-full">
      <PersonalDataSection dataPeserta={dataPeserta} />
      <AssignmentSection dataPeserta={dataPeserta} />
      <FileUploadSection dataPeserta={dataPeserta} />
    </div>
  );
};

export default DataDiriCard;
