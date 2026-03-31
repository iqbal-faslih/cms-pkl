import { usePesertaData } from "../../hooks/siswa";
import { useEditDataDiri } from "../../hooks/siswa/account-settings/useEditDataDiri";
import useEditPP from "../../hooks/siswa/account-settings/useEditPP";
import { usePasswordModal } from "../../hooks/siswa/account-settings/usePasswordModal";
import { ProfileSkeleton } from "../../components/skeletons/siswa/account-settings";
// import ProjectCard from "../../components/cards/ProjectCard";
import { EllipsisVertical, Eye, FileText, PencilLine } from "lucide-react";
import PrimaryButton from "../../components/button/PrimaryButton";
import {
  ModalUpdateProfile,
  ModalEditDataDiri,
  ModalUbahPassword,
} from "../../components/modal/siswa/account-settings";
import { buildProfilePesertaViewModel } from "./helpers/profilePesertaViewModel";
const ProfilePeserta = () => {
  const {
    data: dataPeserta,
    loading,
    error,
    cv,
    cvTanggal,
    suratPernyataan,
    suratPernyataanTanggal,
    profileImage,
    setProfileImage,
    refetch,
  } = usePesertaData();

  const {
    showUploadModal,
    tempProfilePreview,
    profileFileName,
    isUploading,
    profileInputRef,
    handleImageSelect,
    handleDrop,
    handleDragOver,
    handleOpenModal,
    handleSaveImages,
    handleCloseModal,
    resetTempImage,
    isDisabled,
    hasChanges,
  } = useEditPP({
    profileImage,
    setProfileImage,
    pesertaId: dataPeserta?.id,
    onSuccess: refetch,
    maxSizeMB: 5,
  });

  const {
    showModal: showEditModal,
    isSubmitting: isEditSubmitting,
    isValid: isEditValid,
    hasChanges: hasEditChanges,
    errors: editErrors,
    register: editRegister,
    handleSubmit: handleEditSubmit,
    handleOpenModal: handleOpenEditModal,
    handleCloseModal: handleCloseEditModal,
  } = useEditDataDiri({
    initialData: dataPeserta,
    onSuccess: refetch,
  });

  const {
    showPasswordModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  } = usePasswordModal();

  const {
    cvDateLabel,
    suratPernyataanDateLabel,
    hasAcceptedPlacement,
    profileFieldsLeft,
    profileFieldsRight,
    placementFieldsPrimary,
    placementFieldsPeriod,
    placementDivisionValue,
  } = buildProfilePesertaViewModel({
    dataPeserta,
    cvTanggal,
    suratPernyataanTanggal,
  });

  if (loading) {
    return <ProfileSkeleton />;
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
      <div className="bg-white rounded-lg p-6 h-full flex items-center justify-center">
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
    <div className="flex flex-col gap-y-6 h-full w-full">
      <h1 className="text-[35px] font-semibold">Data Diri</h1>
      <div className="grid grid-cols-12 gap-x-[18px] h-full">
        <div className="flex flex-col items-center gap-y-[18px] col-span-5">
          <div className="bg-white py-10 flex flex-col items-center gap-y-8 w-full rounded-2xl h-full">
            <div className="p-3 rounded-full border-[2px] border-[#306BFF]">
              <div className="p-2 rounded-full relative border-[2px] border-[#306BFF]">
                <div className="size-50 rounded-full bg-gray-400 border-[5px] border-[#306BFF] overflow-hidden">
                  <img
                    src={profileImage}
                    alt="Foto Profil"
                    className="size-full object-cover"
                  />
                </div>
                <button
                  className="p-2 rounded-full bg-[#0D5EF4] hover:bg-[#0D42EF] flex items-center justify-center absolute bottom-5 right-5 cursor-pointer"
                  onClick={handleOpenModal}
                >
                  <PencilLine size={20} className="aspect-ratio text-white" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center">
              <h4 className="uppercase font-semibold text-[18px]">
                {dataPeserta?.nama || ""}
              </h4>
              {hasAcceptedPlacement && (
                <div className="flex items-center justify-center px-3 py-2 bg-[#EFF4FF] text-[#306BFF] rounded-full">
                  <p className="text-base font-medium uppercase">
                    {dataPeserta?.divisi || ""}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white py-10 px-8 flex flex-col gap-y-4 w-full rounded-2xl h-full">
            <h1 className="text-[30px] font-semibold mb-4">
              Dokumen Pemberkasan
            </h1>
            <div className="flex flex-col gap-y-8 w-full">
              <div className="p-2 flex justify-between border border-[#BDBEC1] rounded-[10px]">
                <div className="flex items-center gap-2">
                  <div className="size-20 rounded-[10px] bg-gradient-to-br from-[#EAF2FF] to-[#DDEBFF] border border-[#BFD6FF] flex flex-col items-center justify-center gap-1 shadow-sm">
                    <FileText size={20} className="text-[#245CD6]" />
                    <span className="text-[9px] leading-none font-semibold text-[#245CD6]">
                      CV
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <p className="text-[13px] font-semibold">Curiculum Vitae</p>
                    <p className="text-[11px] font-medium">{cvDateLabel}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="relative group">
                    <EllipsisVertical size={20} />
                    <div className="py-1 px-3 absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white hover:bg-gray-100 backdrop-blur-sm rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {cv ? (
                        <a
                          href={cv}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-[#686868]"
                        >
                          <span className="">Lihat</span>
                          <Eye size={14} />
                        </a>
                      ) : (
                        <span className="text-sm text-[#9CA3AF]">Belum ada file</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 flex justify-between border border-[#BDBEC1] rounded-[10px]">
                <div className="flex items-center gap-2">
                  <div className="size-20 rounded-[10px] bg-gradient-to-br from-[#FFF3E8] to-[#FFE7CE] border border-[#FFD1A1] flex flex-col items-center justify-center gap-1 shadow-sm">
                    <FileText size={20} className="text-[#C35A00]" />
                    <span className="text-[9px] leading-none font-semibold text-[#C35A00]">
                      SP
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-semibold">
                      Surat Pernyataan Siswa
                    </p>
                    <p className="text-[11px] font-medium">
                      {suratPernyataanDateLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="relative group">
                    <EllipsisVertical size={20} />
                    <div className="py-1 px-3 absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white hover:bg-gray-100 backdrop-blur-sm rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      {suratPernyataan ? (
                        <a
                          href={suratPernyataan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-[#686868]"
                        >
                          <span className="">Lihat</span>
                          <Eye size={14} />
                        </a>
                      ) : (
                        <span className="text-sm text-[#9CA3AF]">Belum ada file</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 col-span-7">
          <div className="bg-white rounded-2xl w-full px-7 py-5 flex flex-col justify-center">
            <p className="text-[15px] font-medium text-[#686868]">Email</p>
            <p>{dataPeserta.email}</p>
          </div>
          <div className="bg-white rounded-2xl w-full px-7 py-5 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[15px] font-medium text-[#686868]">
                Kata Sandi
              </p>
              <p>********</p>
            </div>
            <PrimaryButton
              rounded="rounded-full"
              textSize="text-xs"
              onClick={handleOpenPasswordModal}
            >
              Ubah Kata Sandi?
            </PrimaryButton>
          </div>
          <div className="flex flex-col gap-y-4 h-full">
            <div className="relative bg-white rounded-2xl w-full px-7 py-5 grid grid-cols-2 gap-x-3 h-full">
              <div className="flex flex-col gap-y-4">
                {profileFieldsLeft.map((item, index) => (
                  <div className="flex flex-col" key={index}>
                    <p className="text-[15px] font-medium text-[#686868] capitalize">
                      {item.title}
                    </p>
                    <p className="capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-y-4">
                {profileFieldsRight.map((item, index) => (
                  <div className="flex flex-col" key={index}>
                    <p className="text-[15px] font-medium text-[#686868] capitalize">
                      {item.title}
                    </p>
                    <p className="capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-5 right-7">
                <PrimaryButton
                  rounded="rounded-full"
                  textSize="text-xs"
                  onClick={handleOpenEditModal}
                >
                  Edit Data Diri
                </PrimaryButton>
              </div>
            </div>

            <div className="bg-white rounded-2xl w-full px-8 pt-10 pb-20">
              <h1 className="text-[30px] font-semibold mb-8">Pemberkasan</h1>
              <div className="grid grid-cols-3 gap-x-3">
                <div className="flex flex-col gap-y-3">
                  {placementFieldsPrimary.map((item, index) => (
                    <div className="flex flex-col" key={index}>
                      <p className="text-[15px] font-medium text-[#686868] capitalize">
                        {item.title}
                      </p>
                      <p className="capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-y-3">
                  {placementFieldsPeriod.map((item, index) => (
                    <div className="flex flex-col" key={index}>
                      <p className="text-[15px] font-medium text-[#686868] capitalize">
                        {item.title}
                      </p>
                      <p className={`capitalize ${item.style} `}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="text-[15px] font-medium text-[#686868] capitalize">
                    divisi
                  </p>
                  <p className="capitalize">{placementDivisionValue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dataPeserta?.id && (
        <ModalUpdateProfile
          showUploadModal={showUploadModal}
          handleCloseModal={handleCloseModal}
          handleSaveImages={handleSaveImages}
          tempProfilePreview={tempProfilePreview}
          profileFileName={profileFileName}
          profileImage={profileImage}
          profileInputRef={profileInputRef}
          handleImageSelect={handleImageSelect}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          resetTempImage={resetTempImage}
          isUploading={isUploading}
          isDisabled={isDisabled}
          hasChanges={hasChanges}
        />
      )}

      <ModalEditDataDiri
        showModal={showEditModal}
        handleCloseModal={handleCloseEditModal}
        register={editRegister}
        isSubmitting={isEditSubmitting}
        errors={editErrors}
        isValid={isEditValid}
        hasChanges={hasEditChanges}
        handleSubmit={handleEditSubmit}
      />

      <ModalUbahPassword
        showModal={showPasswordModal}
        handleCloseModal={handleClosePasswordModal}
      />
    </div>
  );
};

export default ProfilePeserta;
