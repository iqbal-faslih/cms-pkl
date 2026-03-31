import { getAllJobs } from "./apiClient";
import {
  getEffectiveLowonganStatus,
  getLowonganLifecycleLabel,
  isLowonganClosed,
  resolveApplicantCountValue,
  resolveMaxQuotaValue,
} from "./lowonganStatusHelper";

const DEFAULT_IMAGE = "/assets/img/Cover.png";
const DEFAULT_REQUIRED_DOCUMENTS = [
  "CV",
  "Surat Pernyataan Diri"
];

const getImageFromFoto = (fotoArray, type) => {
  if (!fotoArray || !Array.isArray(fotoArray)) return DEFAULT_IMAGE;
  const foto = fotoArray.find((f) => f.type === type);
  return foto ? `${import.meta.env.VITE_FILE_URL}/${foto.path}` : DEFAULT_IMAGE;
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "Tidak tersedia";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Tanggal tidak valid";
  }
  const diffTime = Math.abs(end - start);
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  return diffMonths + " Bulan";
};

const formatRelatedJobLocation = (jobData) => {
  const parts = [];
  if (jobData.kota) parts.push(jobData.kota);
  if (jobData.provinsi) parts.push(jobData.provinsi);
  return parts.join(", ") || "Lokasi tidak tersedia";
};

const mapRelatedJobData = (jobData) => {
  const internshipSystem = String(
    jobData?.status_magang ||
      jobData?.sistem_magang ||
      jobData?.metode_magang ||
      jobData?.tipe_magang ||
      ""
  )
    .trim()
    .toLowerCase();

  return {
    id: jobData.id,
    position: jobData.divisi || "-",
    company: {
      name: jobData.perusahaan || "-",
      location: formatRelatedJobLocation(jobData),
      logo: getImageFromFoto(jobData.foto, "profil_cover"),
      email: "-",
      website: "-",
      description: "-",
    },
    cabang: {
      nama: "",
      kota: jobData.kota || "",
      provinsi: jobData.provinsi || "",
    },
    documents: DEFAULT_REQUIRED_DOCUMENTS,
    importantDates: {
      duration: calculateDuration(jobData.tanggal_mulai, jobData.tanggal_selesai),
      Pembukaan: jobData.tanggal_mulai,
      Penutupan: jobData.tanggal_selesai,
    },
    requirement: [],
    jobdesc: [],
    total_pendaftar: resolveApplicantCountValue(jobData),
    max_kuota: resolveMaxQuotaValue(jobData),
    cover: getImageFromFoto(jobData.foto, "profil_cover"),
    internshipSystem:
      internshipSystem === "online" || internshipSystem === "offline"
        ? internshipSystem
        : "",
    status: getEffectiveLowonganStatus(jobData),
    statusLabel: getLowonganLifecycleLabel(jobData),
    isClosed: isLowonganClosed(jobData),
  };
};

const calculateRelevanceScore = (relatedJob, currentJob) => {
  let score = 0;
  
  if (relatedJob.position === currentJob.position) {
    score += 10;
  } else if (relatedJob.position.includes(currentJob.position) || 
             currentJob.position.includes(relatedJob.position)) {
    score += 5;
  }
  
  if (relatedJob.company.name === currentJob.company.name) {
    score += 8;
  }
  
  if (relatedJob.cabang.kota === currentJob.cabang.kota) {
    score += 3;
  }
  
  if (relatedJob.cabang.provinsi === currentJob.cabang.provinsi) {
    score += 2;
  }
  
  if (score === 0) {
    score = 1;
  }
  
  return score;
};

export const fetchRelatedJobs = async (currentJob, currentJobId, limit = 5) => {
  try {
    console.log("Fetching related jobs for:", currentJob.position);
    
    const res = await getAllJobs();
    
    // Validate response structure
    if (!res || !res.data) {
      console.warn("Invalid response structure:", res);
      return [];
    }

    const responseData = res.data.data || [];
    
    if (!Array.isArray(responseData)) {
      console.warn("Related jobs data is not an array:", responseData);
      return [];
    }

    const validJobs = responseData.filter(job => 
      job && 
      job.id && 
      job.id.toString() !== currentJobId.toString()
    );

    if (validJobs.length === 0) {
      console.log("No valid related jobs found");
      return [];
    }

    const allMappedJobs = validJobs.map(mapRelatedJobData);
    console.log("All mapped related jobs:", allMappedJobs.length);

    const jobsWithScores = allMappedJobs.map(job => ({
      ...job,
      relevanceScore: calculateRelevanceScore(job, currentJob)
    }));

    const sortedRelatedJobs = jobsWithScores
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map((job) => {
        const cleanedJob = { ...job };
        delete cleanedJob.relevanceScore;
        return cleanedJob;
      });

    console.log(`Found ${sortedRelatedJobs.length} related jobs`);
    return sortedRelatedJobs;

  } catch (error) {
    console.error("Failed to fetch related jobs:", error);
    throw new Error(error.message || "Failed to fetch related jobs");
  }
};
