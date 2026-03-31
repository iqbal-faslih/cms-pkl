import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  api,
  getLowonganList,
  getLowonganById,
  getCabangLowonganList,
  getCabangLowonganById,
  deleteLowongan,
} from "../helpers/apiClient";
import {
  getEffectiveLowonganStatus,
  markLowonganClosedInCache,
} from "../helpers/lowonganStatusHelper";

export const useLowonganData = () => {
  const role =
    String(localStorage.getItem("role") || sessionStorage.getItem("role") || "").toLowerCase();
  const isCabangRole = role === "cabang";
  const [sortStatus, setSortStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [lowongan, setLowongan] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const isExplicitlyClosedStatus = (value) => {
    if (value === 0 || value === false) return true;
    const normalized = String(value ?? "").trim().toLowerCase();
    return ["0", "false", "closed", "close", "selesai", "ditutup", "tutup"].includes(normalized);
  };

  const normalizeJobStatus = (job) => {
    if (!job || typeof job !== "object") return job;
    const normalizedStatus = getEffectiveLowonganStatus(job);
    const rawStatusCandidates = [
      job?.status_lowongan,
      job?.statusLowongan,
      job?.is_closed,
      job?.isClosed,
      job?.closed,
      job?.buka_tutup,
      job?.bukaTutup,
      job?.status,
    ];

    if (
      job?.id &&
      (normalizedStatus === 0 || rawStatusCandidates.some(isExplicitlyClosedStatus))
    ) {
      markLowonganClosedInCache(job.id);
    }

    if (normalizedStatus === job.status) return job;
    return { ...job, status: normalizedStatus };
  };

  const extractDetailItem = (responseData) => {
    if (!responseData) return null;

    const candidates = [
      responseData?.data,
      responseData?.data?.data,
      responseData?.result,
      responseData?.item,
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate) && candidate.length > 0) return candidate[0];
      if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        return candidate;
      }
    }

    return null;
  };

  const GetData = async () => {
    try {
      setLoading(true);

      const res = isCabangRole ? await getCabangLowonganList() : await getLowonganList();

      setLowongan((res.data.data || []).map(normalizeJobStatus));
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.meta?.message ||
        "Gagal memuat data lowongan";
      console.error("Error fetching data:", {
        status,
        message,
        data: error?.response?.data,
      });
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: status === 500 ? `Server error: ${message}` : message,
      });
      setLowongan([]);
    } finally {
      setLoading(false);
    }
  };

  const GetJobDetail = async (jobId) => {
    try {
      setDetailLoading(true);
      console.log(`Fetching detail for job ID: ${jobId}`);

      const res = isCabangRole
        ? await getCabangLowonganById(jobId)
        : await getLowonganById(jobId);

      console.log("Detail response:", res.data);
      const jobDetailData = extractDetailItem(res?.data);

      if (jobDetailData) {

        // Process cabang photos
        if (
          jobDetailData.cabang &&
          jobDetailData.cabang.foto &&
          Array.isArray(jobDetailData.cabang.foto)
        ) {
          const cabangFotos = jobDetailData.cabang.foto;
          const profilePhoto = cabangFotos.find(
            (foto) => foto.type === "profile",
          );
          const coverPhoto = cabangFotos.find(
            (foto) => foto.type === "profil_cover",
          );

          // Gunakan VITE_API_URL sebagai base URL dan tambahkan /storage/
          const baseURL = import.meta.env.VITE_API_URL_FILE;

          jobDetailData.cabang.profilePhotoUrl = profilePhoto
            ? `${baseURL}/storage/${profilePhoto.path}`
            : null;
          jobDetailData.cabang.coverPhotoUrl = coverPhoto
            ? `${baseURL}/storage/${coverPhoto.path}`
            : null;

          console.log("Cabang photos processed:", {
            profilePhoto: jobDetailData.cabang.profilePhotoUrl,
            coverPhoto: jobDetailData.cabang.coverPhotoUrl,
          });
        }

        // Process perusahaan photos
        if (
          jobDetailData.perusahaan &&
          jobDetailData.perusahaan.foto &&
          Array.isArray(jobDetailData.perusahaan.foto)
        ) {
          const perusahaanFotos = jobDetailData.perusahaan.foto;
          const profilePhoto = perusahaanFotos.find(
            (foto) => foto.type === "profile",
          );
          const coverPhoto = perusahaanFotos.find(
            (foto) => foto.type === "profil_cover",
          );

          const baseURL = import.meta.env.VITE_API_URL_FILE;

          jobDetailData.perusahaan.profilePhotoUrl = profilePhoto
            ? `${baseURL}/storage/${profilePhoto.path}`
            : null;
          jobDetailData.perusahaan.coverPhotoUrl = coverPhoto
            ? `${baseURL}/storage/${coverPhoto.path}`
            : null;

          console.log("Perusahaan photos processed:", {
            profilePhoto: jobDetailData.perusahaan.profilePhotoUrl,
            coverPhoto: jobDetailData.perusahaan.coverPhotoUrl,
          });
        }

        // Process divisi photos
        if (
          jobDetailData.divisi &&
          jobDetailData.divisi.foto &&
          Array.isArray(jobDetailData.divisi.foto)
        ) {
          const divisiFotos = jobDetailData.divisi.foto;
          const coverPhoto = divisiFotos.find(
            (foto) => foto.type === "foto_cover",
          );

          const baseURL = import.meta.env.VITE_API_URL_FILE;

          jobDetailData.divisi.coverPhotoUrl = coverPhoto
            ? `${baseURL}/storage/${coverPhoto.path}`
            : null;

          console.log("Divisi photos processed:", {
            coverPhoto: jobDetailData.divisi.coverPhotoUrl,
          });
        }

        const normalizedJobDetail = normalizeJobStatus(jobDetailData);
        setSelectedJobDetail(normalizedJobDetail);
        setSelectedJob((prevJob) =>
          prevJob?.id === jobId
            ? normalizeJobStatus({ ...prevJob, ...normalizedJobDetail })
            : prevJob,
        );
        setLowongan((prevLowongan) =>
          prevLowongan.map((job) =>
            job.id === jobId ? normalizeJobStatus({ ...job, ...normalizedJobDetail }) : job,
          ),
        );
      } else {
        try {
          const directDetail = await api.get(`/lowongan/${jobId}/detail`);
          const directDetailData = extractDetailItem(directDetail?.data);
          if (directDetailData) {
            const normalizedDirectDetailData = normalizeJobStatus(directDetailData);
            setSelectedJobDetail(normalizedDirectDetailData);
            setSelectedJob((prevJob) =>
              prevJob?.id === jobId
                ? normalizeJobStatus({ ...prevJob, ...normalizedDirectDetailData })
                : prevJob,
            );
            setLowongan((prevLowongan) =>
              prevLowongan.map((job) =>
                job.id === jobId
                  ? normalizeJobStatus({ ...job, ...normalizedDirectDetailData })
                  : job,
              ),
            );
            return;
          }
        } catch (fallbackError) {
          console.warn("Fallback detail endpoint failed:", fallbackError);
        }

        // Fallback terakhir ke data basic list
        const basicJob = lowongan.find((job) => job.id === jobId);
        setSelectedJobDetail(normalizeJobStatus(basicJob) || null);
        console.log("Using basic job data as fallback:", basicJob);
      }
    } catch (error) {
      console.error("Error fetching job detail:", error);

      if (error.response && error.response.status === 404) {
        console.log("Detail endpoint not found, using basic job data");
        const basicJob = lowongan.find((job) => job.id === jobId);
        setSelectedJobDetail(normalizeJobStatus(basicJob) || null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal memuat detail lowongan",
        });

        const basicJob = lowongan.find((job) => job.id === jobId);
        setSelectedJobDetail(normalizeJobStatus(basicJob) || null);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  // Function to update job in list without refetching all data
  const updateJobInList = (jobId, updatedJobData) => {
    setLowongan((prevLowongan) =>
      prevLowongan.map((job) =>
        job.id === jobId ? normalizeJobStatus({ ...job, ...updatedJobData }) : job,
      ),
    );

    // Update selectedJob if it's currently selected
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prevJob) => normalizeJobStatus({ ...prevJob, ...updatedJobData }));
    }

    // Update selectedJobDetail if available
    if (selectedJobDetail && selectedJobDetail.id === jobId) {
      setSelectedJobDetail((prevDetail) => ({
        ...normalizeJobStatus({ ...prevDetail, ...updatedJobData }),
      }));
    }
  };

  // Calculate summary statistics
  const { totalLowonganBerlangsung, totalLowonganSelesai } = lowongan.reduce(
    (acc, job) => {
      if (job.status === 1 || job.status === true) {
        acc.totalLowonganBerlangsung += 1;
      } else if (job.status === 0 || job.status === false) {
        acc.totalLowonganSelesai += 1;
      }
      return acc;
    },
    { totalLowonganBerlangsung: 0, totalLowonganSelesai: 0 },
  );

  useEffect(() => {
    GetData();
  }, []);

  const summaryCardsData = [
    {
      id: 1,
      title: "Total Lowongan",
      count: lowongan.length,
      color: "blue",
      icon: "/src/assets/icons/perusahaan/icon1.svg",
      chartData: [10, 12, 15, 14, 16, 17, 18, 20],
    },
    {
      id: 2,
      title: "Total Lowongan Berlangsung",
      count: totalLowonganBerlangsung,
      color: "orange",
      icon: "/src/assets/icons/perusahaan/icon2.svg",
      chartData: [5, 7, 10, 12, 13, 15, 14, 15],
    },
    {
      id: 3,
      title: "Total Lowongan Selesai",
      count: totalLowonganSelesai,
      color: "green",
      icon: "/src/assets/icons/perusahaan/icon3.svg",
      chartData: [2, 3, 3, 4, 4, 5, 5, 5],
    },
  ];

  const filteredData =
    sortStatus === "All"
      ? lowongan
      : lowongan.filter((job) => {
          const statusValue = sortStatus === "1" ? 1 : 0;
          return job.status === statusValue;
        });

  const handleChevronClick = async (jobId) => {
    if (selectedJob && selectedJob.id === jobId) {
      // Close detail if clicking same job
      setSelectedJob(null);
      setSelectedJobDetail(null);
    } else {
      // Find job from list and set it immediately
      const job = lowongan.find((job) => job.id === jobId);
      if (job) {
        setSelectedJob(job);
        setSelectedJobDetail(job);

        // Fetch detailed data
        await GetJobDetail(jobId);
      }
    }
  };

  const handleEditJob = (job) => {
    // Use matching detailed data only when it belongs to the clicked row
    const matchedDetail =
      selectedJobDetail && selectedJobDetail.id === job?.id
        ? selectedJobDetail
        : null;
    setEditingData(matchedDetail || job);
    setShowModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedJob(null);
    setSelectedJobDetail(null);
  };

  const handleModalSuccess = (updatedJobData = null) => {
    // If data is passed from modal, update directly without refetch
    if (updatedJobData && editingData) {
      updateJobInList(editingData.id, updatedJobData);
    } else {
      // Fallback: refetch data if no data is passed
      GetData();
    }

    // Refresh detail if currently open
    if (selectedJob) {
      GetJobDetail(selectedJob.id);
    }

    // Reset modal state
    setShowModal(false);
    setEditingData(null);
  };

  // Handle success from JobDetail with data update
  const handleJobDetailSuccess = (updatedData = null) => {
    if (selectedJob) {
      // If there's updatedData from JobDetail component, use it
      // Otherwise, default update status to 0 (finished)
      const dataToUpdate = updatedData || { status: 0 };

      updateJobInList(selectedJob.id, dataToUpdate);
    }
  };

  const handleAddNewJob = () => {
    setEditingData(null);
    setShowModal(true);
  };

  const handleDeleteJob = async (job) => {
    const jobId = job?.id;
    if (!jobId) return;

    const confirm = await Swal.fire({
      title: "Hapus Lowongan?",
      text: "Data lowongan yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteLowongan(jobId);
      setLowongan((prev) => prev.filter((item) => item.id !== jobId));

      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
        setSelectedJobDetail(null);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Lowongan berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting lowongan:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error?.response?.data?.message || "Gagal menghapus lowongan",
      });
    }
  };

  return {
    sortStatus,
    setSortStatus,
    selectedJob,
    selectedJobDetail,
    showModal,
    setShowModal,
    loading,
    detailLoading,
    lowongan,
    editingData,
    totalLowonganBerlangsung,
    summaryCardsData,
    filteredData,
    handleChevronClick,
    handleEditJob,
    handleCloseDetail,
    handleModalSuccess,
    handleJobDetailSuccess,
    handleAddNewJob,
    handleDeleteJob,
  };
};
