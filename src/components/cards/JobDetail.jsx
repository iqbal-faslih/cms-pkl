import React, { useEffect, useState } from "react";
import {
  X,
  Building,
  TrendingUp,
  Users,
  Calendar,
  Globe,
  Loader2,
} from "lucide-react";
import { useCloseLowonganAction } from "./hooks/useCloseLowonganAction";
import { getEffectiveLowonganStatus, resolveMaxQuotaValue } from "../../helpers/lowonganStatusHelper";
import { getLowonganStatusBadge } from "../../helpers/lowonganStatusBadgeHelper";
import useLowonganApplicantCount from "../../hooks/useLowonganApplicantCount";

const JobDetail = ({ job, onClose, onEdit, onSucces, loading }) => {
  const role =
    String(localStorage.getItem("role") || sessionStorage.getItem("role") || "").toLowerCase();
  const isCabangRole = role === "cabang";
  const [localJobPatch, setLocalJobPatch] = useState({});
  const jobData = (() => {
    const incomingJob = Array.isArray(job) ? job[0] : job;
    if (!incomingJob) return null;
    return { ...incomingJob, ...localJobPatch };
  })();

  // State untuk handle image load error
  const [profileImageError, setProfileImageError] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose && onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Reset local patch ketika source job berubah
  useEffect(() => {
    setLocalJobPatch({});
    // Reset image error states when job data changes
    setProfileImageError(false);
    setCoverImageError(false);
  }, [job]);

  const { requestCloseLowongan } = useCloseLowonganAction({
    onLocalClosed: () =>
      setLocalJobPatch((prevData) => ({
        ...prevData,
        status: 0,
      })),
    onSuccess: onSucces,
  });
  const handleTutupClick = () => {
    if (!jobData?.id) return;
    requestCloseLowongan(jobData.id);
  };

  if (!jobData) {
    return null;
  }

  // Simplified close detail function - no SweetAlert
  const handleCloseDetail = () => {
    onClose && onClose();
  };

  // Fixed edit function - format data properly
  const handleEditClick = () => {
    // Format data sesuai dengan yang diharapkan AddJobModal
    const editData = {
      id: jobData.id,
      nama: jobData.nama || "",
      tanggal_mulai: jobData.tanggal_mulai,
      tanggal_selesai: jobData.tanggal_selesai,
      id_cabang: jobData.id_cabang || jobData.cabang?.id,
      id_divisi: jobData.id_divisi || jobData.divisi?.id,
      max_kuota: jobData.max_kuota,
      requirement: jobData.requirement || '',
      jobdesc: jobData.jobdesc || ''
    };
    
    onEdit && onEdit(editData);
  };

  const { count: totalPendaftar } = useLowonganApplicantCount(jobData?.id, jobData);
  const maxKuota = resolveMaxQuotaValue(jobData);

  const getPerusahaanData = () => {
    if (jobData?.perusahaan && typeof jobData.perusahaan === "object") {
      return jobData.perusahaan?.perusahaan || jobData.perusahaan;
    }
    if (jobData?.nama_perusahaan && typeof jobData.nama_perusahaan === "object") {
      return jobData.nama_perusahaan;
    }
    if (jobData?.company && typeof jobData.company === "object") {
      return jobData.company;
    }
    return null;
  };

  const getPerusahaanName = () => {
    const perusahaan = getPerusahaanData();
    if (typeof jobData?.perusahaan === "string" && jobData.perusahaan.trim()) {
      return jobData.perusahaan.trim();
    }
    if (typeof jobData?.nama_perusahaan === "string" && jobData.nama_perusahaan.trim()) {
      return jobData.nama_perusahaan.trim();
    }
    return (
      perusahaan?.nama ||
      perusahaan?.nama_perusahaan ||
      jobData?.company_name ||
      jobData?.perusahaan_nama ||
      jobData?.nama ||
      null
    );
  };

  const getLowonganName = () => {
    return jobData?.nama || jobData?.judul || "Nama lowongan tidak tersedia";
  };

  const getHeaderName = () => {
    const perusahaanName = getPerusahaanName();
    if (isCabangRole) {
      return jobData?.cabang?.nama || perusahaanName || "Cabang tidak tersedia";
    }
    return perusahaanName || "Perusahaan tidak tersedia";
  };

  const getWebsite = () => {
    const perusahaan = getPerusahaanData();
    return perusahaan?.website || jobData?.website || null;
  };

  const getBidangUsaha = () => {
    const perusahaan = getPerusahaanData();
    if (isCabangRole) {
      return (
        jobData?.cabang?.bidang_usaha ||
        perusahaan?.bidang_usaha ||
        "Bidang usaha tidak tersedia"
      );
    }
    return (
      perusahaan?.bidang_usaha ||
      jobData?.cabang?.bidang_usaha ||
      "Bidang usaha tidak tersedia"
    );
  };

  const getProvinsi = () => {
    const perusahaan = getPerusahaanData();
    if (isCabangRole) {
      return jobData?.cabang?.provinsi || perusahaan?.provinsi || null;
    }
    return perusahaan?.provinsi || jobData?.provinsi || jobData?.cabang?.provinsi || null;
  };

  const resolvePhotoFromEntity = (entity, type) => {
    if (!entity) return null;
    if (type === "cover" && entity.coverPhotoUrl) return entity.coverPhotoUrl;
    if (type === "profile" && entity.profilePhotoUrl) return entity.profilePhotoUrl;
    if (!Array.isArray(entity.foto)) return null;
    const acceptedTypes =
      type === "cover"
        ? ["profil_cover", "cover", "foto_cover"]
        : ["profile", "profil"];
    const photo = entity.foto.find((f) =>
      acceptedTypes.includes(String(f?.type || "").toLowerCase()),
    );
    return photo?.path ? `${import.meta.env.VITE_API_URL}/storage/${photo.path}` : null;
  };

  const getCoverPhoto = () => {
    const perusahaan = getPerusahaanData();
    const primary = isCabangRole
      ? resolvePhotoFromEntity(jobData?.cabang, "cover")
      : resolvePhotoFromEntity(perusahaan, "cover");
    const secondary = isCabangRole
      ? resolvePhotoFromEntity(perusahaan, "cover")
      : resolvePhotoFromEntity(jobData?.cabang, "cover");
    return primary || secondary || null;
  };

  const getProfilePhoto = () => {
    const perusahaan = getPerusahaanData();
    const primary = isCabangRole
      ? resolvePhotoFromEntity(jobData?.cabang, "profile")
      : resolvePhotoFromEntity(perusahaan, "profile");
    const secondary = isCabangRole
      ? resolvePhotoFromEntity(perusahaan, "profile")
      : resolvePhotoFromEntity(jobData?.cabang, "profile");
    return primary || secondary || null;
  };

  const formatDateId = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const effectiveStatus = getEffectiveLowonganStatus(jobData);
  const statusBadge = getLowonganStatusBadge(jobData);

  // Simplified website click handler - no SweetAlert
  const handleWebsiteClick = (e) => {
    e.preventDefault();
    const website = getWebsite();
    const url = website.startsWith("http") ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to format requirement text into numbered list
  const formatRequirementList = (requirement) => {
    if (!requirement) return null;
    
    // Split by new lines and filter out empty lines
    const lines = requirement.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return null;
    
    // If only one line, show without numbering
    if (lines.length === 1) {
      return <p className="text-xs text-gray-600">{lines[0].trim()}</p>;
    }
    
    // Multiple lines, create numbered list
    return (
      <ol className="text-xs text-gray-600 space-y-1 list-none">
        {lines.map((line, index) => (
          <li key={index} className="flex">
            <span className="mr-2 font-medium text-blue-600 min-w-[1.2rem]">
              {index + 1}.
            </span>
            <span className="flex-1">{line.trim()}</span>
          </li>
        ))}
      </ol>
    );
  };

  // Function to format job description into numbered list
  const formatJobdescList = (jobdesc) => {
    if (!jobdesc) return null;
    
    // Split by new lines and filter out empty lines
    const lines = jobdesc.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return null;
    
    // If only one line, show without numbering
    if (lines.length === 1) {
      return <p className="text-xs text-gray-600">{lines[0].trim()}</p>;
    }
    
    // Multiple lines, create numbered list
    return (
      <ol className="text-xs text-gray-600 space-y-1 list-none">
        {lines.map((line, index) => (
          <li key={index} className="flex">
            <span className="mr-2 font-medium text-blue-600 min-w-[1.2rem]">
              {index + 1}.
            </span>
            <span className="flex-1">{line.trim()}</span>
          </li>
        ))}
      </ol>
    );
  };

  // Handler untuk error loading cover image - IMPROVED VERSION
  const handleCoverImageError = (e) => {
    if (!coverImageError) {
      setCoverImageError(true);
      e.target.src = '/assets/img/Container.png'; // Fallback ke default
    }
  };

  // Handler untuk error loading profile image - IMPROVED VERSION
  const handleProfileImageError = () => {
    if (!profileImageError) {
      setProfileImageError(true);
      // Jangan langsung hide, biarkan fallback icon yang tampil
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg h-fit w-full">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Memuat detail...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <>
          <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detail Lowongan</h2>
            <button onClick={handleCloseDetail} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4 relative">
            {/* Cover Image - IMPROVED VERSION */}
            <img
              src={getCoverPhoto() || '/assets/img/Container.png'}
              alt={getHeaderName()}
              className="w-full h-32 object-cover rounded-lg"
              onError={handleCoverImageError}
            />
            
            {/* Profile Image Container - IMPROVED VERSION */}
            <div className="relative -mt-8 flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {/* Profile Image */}
                  {getProfilePhoto() && !profileImageError && (
                    <img
                      src={getProfilePhoto()}
                      alt={getHeaderName()}
                      className="w-full h-full object-cover rounded-full"
                      onError={handleProfileImageError}
                    />
                  )}
                  
                  {/* Building Icon - shown when no profile image or image error */}
                  {(!getProfilePhoto() || profileImageError) && (
                    <Building className="text-blue-500 w-8 h-8" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-center text-xl font-semibold leading-tight mt-2">
            {getLowonganName()}
          </h3>
          <p className="text-center text-[11px] uppercase tracking-wide text-gray-400 mt-2">
            Perusahaan
          </p>
          <p className="text-center text-sm font-normal text-gray-600 mt-0.5">
            {getHeaderName()}
          </p>
          <p className="text-center text-sm text-gray-500 mb-1">
            {getProvinsi() || "Provinsi tidak tersedia"}, Indonesia
          </p>
          <p className="text-center text-xs text-gray-600 mb-6">
            Bidang usaha: {getBidangUsaha()}
          </p>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Informasi Detail</h4>

            {/* Status Lowongan */}
            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Status:</span>
              </div>
              <div className="w-1/2">
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </span>
              </div>
            </div>

            {/* Total Pendaftar */}
            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Pendaftar:</span>
              </div>
              <div className="w-1/2 text-sm font-medium">
                <span className="text-blue-600">{totalPendaftar}</span>
                <span className="text-gray-400"> / {maxKuota} orang</span>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Tanggal Mulai:</span>
              </div>
              <div className="w-1/2 text-sm font-medium text-gray-700">
                {formatDateId(jobData.tanggal_mulai)}
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div className="flex items-center gap-2 w-1/2">
                <div className="w-5 h-5 text-blue-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Tanggal Selesai:</span>
              </div>
              <div className="w-1/2 text-sm font-medium text-gray-700">
                {formatDateId(jobData.tanggal_selesai)}
              </div>
            </div>

            {/* Website */}
            {getWebsite() && (
              <div className="flex items-center mb-3 gap-2">
                <div className="w-5 h-5 text-blue-500">
                  <Globe className="w-5 h-5" />
                </div>
                <button
                  onClick={handleWebsiteClick}
                  className="text-sm font-medium text-sky-500 underline hover:text-sky-600 break-all text-left"
                >
                  {getWebsite()}
                </button>
              </div>
            )}

            {/* Requirements - Updated with numbered list */}
            {jobData.requirement && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Persyaratan:</h5>
                {formatRequirementList(jobData.requirement)}
              </div>
            )}

            {/* Job Description - Updated with numbered list */}
            {jobData.jobdesc && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Job Desk:</h5>
                {formatJobdescList(jobData.jobdesc)}
              </div>
            )}
          </div>

          {effectiveStatus === 1 && (
            <div className="mt-8 flex gap-2">
              <button
                onClick={handleTutupClick}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 flex-1 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex-1 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobDetail;
