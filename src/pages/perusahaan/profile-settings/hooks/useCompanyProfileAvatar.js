import { useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { api } from "@/helpers/apiClient";
import {
  persistAvatarToStorage,
  resolveProfileFileUrl,
  validateProfileImageFile,
  withCacheBust,
} from "../helpers/profileImageUtils";

export const useCompanyProfileAvatar = ({ data, user, setUser, refetch }) => {
  const [logoImage, setLogoImage] = useState("");
  const [logoVersion, setLogoVersion] = useState(Date.now());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profileFileName, setProfileFileName] = useState("");
  const [tempProfilePreview, setTempProfilePreview] = useState(null);
  const profileInputRef = useRef(null);

  const displayLogoBase = useMemo(
    () =>
      resolveProfileFileUrl(
        logoImage || user?.logo || user?.avatar || data?.logo || data?.profil
      ) || "/assets/img/defaultPP.png",
    [data?.logo, data?.profil, logoImage, user?.avatar, user?.logo]
  );

  const displayLogo = useMemo(
    () => withCacheBust(displayLogoBase, logoVersion),
    [displayLogoBase, logoVersion]
  );

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    const validation = validateProfileImageFile(file);
    if (!validation.valid) {
      Swal.fire(validation.title, validation.message, "warning");
      return;
    }

    setProfileFile(file);
    setProfileFileName(file.name);
    setTempProfilePreview(URL.createObjectURL(file));
  };

  const handleOpenModal = () => {
    setTempProfilePreview(displayLogo);
    setProfileFile(null);
    setProfileFileName("");
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setProfileFile(null);
    setProfileFileName("");
    setTempProfilePreview(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer.files?.[0]) return;
    handleImageSelect({ target: { files: [event.dataTransfer.files[0]] } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const resetTempImage = () => {
    setProfileFile(null);
    setProfileFileName("");
    setTempProfilePreview(displayLogo);
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  const handleSaveImages = async () => {
    const validation = validateProfileImageFile(profileFile);
    if (!validation.valid) {
      Swal.fire(validation.title, validation.message, "warning");
      return;
    }

    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append("_method", "PUT");
      payload.append("avatar", profileFile);

      const uploadResponse = await api.post("/perusahaan/profile/update", payload);
      const latestLogoFromUpload =
        uploadResponse?.data?.data?.user?.avatar ||
        uploadResponse?.data?.data?.avatar ||
        uploadResponse?.data?.data?.user?.logo ||
        uploadResponse?.data?.data?.logo ||
        uploadResponse?.data?.data?.profil ||
        "";

      const optimisticLogo = tempProfilePreview || URL.createObjectURL(profileFile);
      const nextVersion = Date.now();

      setLogoImage(optimisticLogo);
      setLogoVersion(nextVersion);
      setUser((prev) =>
        !prev
          ? prev
          : {
              ...prev,
              logo: optimisticLogo,
              avatar: optimisticLogo,
              _avatarVersion: nextVersion,
            }
      );

      const refreshed = await refetch();
      const latestLogoPathRaw =
        latestLogoFromUpload || refreshed?.avatar || refreshed?.logo || refreshed?.profil || "";
      const latestLogoPath = latestLogoPathRaw ? resolveProfileFileUrl(latestLogoPathRaw) : "";
      const refreshVersion = Date.now();
      const shouldOverrideOptimistic =
        Boolean(latestLogoPath) &&
        latestLogoPath !== "/assets/img/defaultPP.png" &&
        !latestLogoPath.includes("/assets/img/defaultPP.png");

      if (shouldOverrideOptimistic) {
        setLogoImage(latestLogoPath);
        setLogoVersion(refreshVersion);
      }

      setUser((prev) =>
        !prev
          ? prev
          : {
              ...prev,
              logo: shouldOverrideOptimistic ? latestLogoPath : prev.logo,
              avatar: shouldOverrideOptimistic ? latestLogoPath : prev.avatar,
              _avatarVersion: refreshVersion,
            }
      );

      persistAvatarToStorage({
        storage: sessionStorage,
        avatarUrl: latestLogoPath,
        useOptimisticValue: !shouldOverrideOptimistic,
        refreshVersion,
      });
      persistAvatarToStorage({
        storage: localStorage,
        avatarUrl: latestLogoPath,
        useOptimisticValue: !shouldOverrideOptimistic,
        refreshVersion,
      });

      handleCloseModal();
      await Swal.fire("Berhasil", "Foto profil perusahaan berhasil diperbarui", "success");
      window.location.reload();
    } catch (error) {
      const backendMessage =
        error?.response?.data?.meta?.message || error?.response?.data?.message || "";
      const mentionsRequiredField =
        /Undefined array key/i.test(backendMessage) || /harus berupa file/i.test(backendMessage);
      const message = mentionsRequiredField
        ? "Endpoint backend saat ini masih mewajibkan file dokumen lain saat update profil. Frontend tidak bisa override aturan ini."
        : backendMessage || "Upload foto profil perusahaan gagal. Coba lagi.";
      Swal.fire("Gagal", message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    displayLogo,
    isUploading,
    profileFile,
    profileFileName,
    profileInputRef,
    resetTempImage,
    showUploadModal,
    tempProfilePreview,
    handleCloseModal,
    handleDragOver,
    handleDrop,
    handleImageSelect,
    handleOpenModal,
    handleSaveImages,
  };
};
