import { useContext, useState } from "react";
import { HeaderInfo } from "../../../shared/components/header/HeaderInfo";
import DataPerusahaan from "./DataPerusahaan";
import Password from "./DataAdminPerusahaan";
import { usePerusahaan } from "../../../hooks/usePerusahaan";
import { AuthContext } from "../../../contexts/AuthContext";
import { ModalUpdateProfile } from "../../../components/modal/siswa/account-settings";
import { resolveProfileFileUrl } from "./helpers/profileImageUtils";
import { useCompanyProfileAvatar } from "./hooks/useCompanyProfileAvatar";


const CompanyCard = () => {
  const { data, refetch, loading } = usePerusahaan();
  const { user, setUser } = useContext(AuthContext);
  const [companyName] = useState("");
  const [description] = useState("");

  const [coverImage] = useState("");
  const {
    displayLogo,
    handleCloseModal,
    handleDragOver,
    handleDrop,
    handleImageSelect,
    handleOpenModal,
    handleSaveImages,
    isUploading,
    profileFile,
    profileFileName,
    profileInputRef,
    resetTempImage,
    showUploadModal,
    tempProfilePreview,
  } = useCompanyProfileAvatar({
    data,
    user,
    setUser,
    refetch,
  });

  const [activeTab, setActiveTab] = useState("data-admin-perusahaan");

  const tabs = [
    { key: "data-perusahaan", label: "Data Perusahaan" },
    { key: "data-admin-perusahaan", label: "Data Admin Perusahaan" },
  ];

  const displayName = data?.nama || companyName || "Perusahaan";
  const displayDescription = data?.deskripsi || description || "-";
  const displayAddress = [data?.alamat, data?.kecamatan, data?.kota, data?.provinsi]
    .filter(Boolean)
    .join(", ");
  const displayCover = resolveProfileFileUrl(coverImage || data?.profil_bg) || "";

  return (
    <div className="w-full font-sans">
      <HeaderInfo
        nameCabang={displayName}
        nameDescription={displayDescription}
        alamat={displayAddress || "-"}
        cover={displayCover}
        coverLoading={loading}
        logo={displayLogo}
        enableTabs={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        onEditLogo={handleOpenModal}
      />

      <div className="mt-6">
        {activeTab === "data-perusahaan" && (
          <DataPerusahaan onProfileUpdated={refetch} />
        )}
        {activeTab === "data-admin-perusahaan" && <Password />}
      </div>

      <ModalUpdateProfile
        showUploadModal={showUploadModal}
        handleCloseModal={handleCloseModal}
        handleSaveImages={handleSaveImages}
        tempProfilePreview={tempProfilePreview}
        profileFileName={profileFileName}
        profileImage={displayLogo}
        profileInputRef={profileInputRef}
        handleImageSelect={handleImageSelect}
        handleDrop={handleDrop}
        handleDragOver={handleDragOver}
        resetTempImage={resetTempImage}
        isUploading={isUploading}
        isDisabled={!profileFile || isUploading}
        hasChanges={Boolean(profileFile)}
      />
    </div>
  );
};

export default CompanyCard;
