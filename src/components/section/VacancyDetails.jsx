import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useJobDetails, useRelatedJobs } from "../../hooks";
import {
  MapPin,
  Mail,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  ChevronRight,
} from "lucide-react";
import PemberkasanModal from "../modal/PemberkasanModal";
import DataNotAvaliable from "../DataNotAvaliable";
import JobsCard from "../../components/cards/JobsCard";
import PrimaryButton from "../button/PrimaryButton";
import {
  renderCompactLocation,
  getImportantDates,
} from "../../helpers/jobDetailsHelper";
import { useVacancyApplyGuard } from "../../hooks/siswa/lowongan/useVacancyApplyGuard";
import {
  getLowonganLifecycleLabel,
  isLowonganClosed,
  resolveLowonganClosureReason,
} from "../../helpers/lowonganStatusHelper";

const stripHtmlTags = (value = "") =>
  String(value || "")
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const toLines = (items = []) =>
  items
    .map((item) => stripHtmlTags(item))
    .filter(Boolean);

const formatInternshipSystem = (value) => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "online") {
    return { label: "Online", className: "bg-[#e9f2ff] text-[#2f66ff]" };
  }
  if (normalized === "offline") {
    return { label: "Offline", className: "bg-[#f3f4f6] text-[#4b5563]" };
  }
  return { label: "-", className: "bg-[#f3f4f6] text-[#9ca3af]" };
};

export default function JobVacancyDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, token, role } = useContext(AuthContext);

  const { jobDetails: job, loading, error } = useJobDetails(jobId);
  const {
    relatedJobs,
    loading: relatedJobsLoading,
    error: relatedJobsError,
  } = useRelatedJobs(job, jobId, 5);

  const DEFAULT_IMAGE = "/assets/img/Cover.png";
  const sidePreviewImage = job?.cover || job?.company?.logo || DEFAULT_IMAGE;

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  const {
    isModalOpen,
    openApplyModal,
    closeApplyModal,
    statusError,
  } =
    useVacancyApplyGuard({
      token,
      user,
      role,
      navigate,
      currentJob: job,
      isLowonganClosed: isLowonganClosed(job),
    });

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 mt-10">
        <div className="w-full h-screen bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading job details:", error);
    return (
      <div className="container mx-auto px-6 py-8 mt-10">
        <DataNotAvaliable />
        <h1 className="text-4xl font-bold text-center py-10">
          Terjadi Kesalahan
        </h1>
        <p className="text-center text-gray-600 mb-4">
          {error.message || "Gagal memuat detail lowongan. Silakan coba lagi."}
        </p>
        <div className="flex justify-center">
          <Link
            to="/lowongan"
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-6 py-8 mt-10">
        <DataNotAvaliable />
        <h1 className="text-4xl font-bold text-center py-10">
          Lowongan Tidak Ditemukan
        </h1>
        <div className="flex justify-center">
          <Link
            to="/lowongan"
            className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </div>
    );
  }

  const importantDates = getImportantDates(job);
  const companyDescription = stripHtmlTags(job?.company?.description);
  const requirementLines = toLines(job?.requirement || []);
  const jobdeskLines = toLines(job?.jobdesc || []);
  const internshipSystem = formatInternshipSystem(job?.internshipSystem);
  const lowonganClosed = isLowonganClosed(job);
  const lowonganStatusLabel = getLowonganLifecycleLabel(job, {
    openLabel: "Open",
    closedLabel: "Closed",
  });
  const closureReason = lowonganClosed ? resolveLowonganClosureReason(job) : null;
  const locationComponents = job?.cabang?.locationComponents || {};
  const cityProvince = [locationComponents.kota, locationComponents.provinsi]
    .filter(Boolean)
    .join(", ");
  const hasAddress = Boolean(locationComponents.alamatPerusahaan);

  return (
    <div className="container mx-auto px-6 py-8 mt-10">
      <div className="mb-6">
        <Link
          to="/lowongan"
          className="text-blue-600 hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Kembali ke Daftar Lowongan
        </Link>
      </div>
      {statusError && (
        <div className="mx-2 mb-4 flex items-center rounded-md bg-red-100 p-3 text-red-700">
          <AlertCircle size={16} className="mr-2" />
          <span>{statusError}</span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bagian kiri (2/3) - Detail lowongan */}
        <div className="lg:w-2/3">
          {lowonganClosed && closureReason?.description && (
            <div className="mx-2 my-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {closureReason.description}
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 p-10 mx-2 my-2">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="flex flex-col flex-1">
                <h1 className="text-xl font-bold text-gray-800 mb-2">
                  {job.title || `Magang di divisi ${job.position}`}
                </h1>
                <p className="font-medium opacity-50 mb-2">
                  {job.company.name}
                </p>
                <p className="text-gray-600 text-sm flex items-center mb-4">
                  <MapPin size={14} className="mr-1" />
                  {renderCompactLocation(job)}
                </p>
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${internshipSystem.className}`}
                  >
                    Sistem Magang: {internshipSystem.label}
                  </span>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      lowonganClosed ? "bg-[#ffe8e8] text-[#dc2626]" : "bg-[#e8f7ee] text-[#16a34a]"
                    }`}
                  >
                    {lowonganStatusLabel}
                  </span>
                </div>
                <div className="mt-6">
                  <PrimaryButton
                    onClick={openApplyModal}
                  >
                    LAMAR LOWONGAN
                  </PrimaryButton>
                </div>
              </div>
              <div className="md:w-1/4 flex justify-end mt-4 md:mt-0 w-full md:max-w-[240px]">
                <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={sidePreviewImage}
                    alt={job.company.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              </div>
            </div>
            <div className="border-b border-gray-300 mb-8" />
            <div className="mb-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tentang Perusahaan
              </h2>
              <div className="ml-6 space-y-5">
                <div className="font-light opacity-80 leading-relaxed">
                  {companyDescription || "Deskripsi perusahaan tidak tersedia"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={20} className="text-black" />
                    <span className="font-light opacity-80 truncate">
                      {job.company.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0 md:justify-end">
                    <ExternalLink size={20} className="text-black" />
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-light opacity-80 hover:underline truncate"
                    >
                      {job.company.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-300 mb-8" />
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex gap-2 items-center">
                <MapPin size={20} className="text-black" />
                Lokasi Penempatan
              </h2>
              <div className="ml-6 space-y-2 font-light opacity-80">
                {cityProvince && <div>{cityProvince}</div>}
                {hasAddress && (
                  <div className="text-black opacity-80 font-light">
                    <span className="font-medium">Alamat:</span>{" "}
                    {locationComponents.alamatPerusahaan}
                  </div>
                )}
                {!cityProvince && !hasAddress && (
                  <div className="text-black opacity-80 font-light">
                    Lokasi tidak tersedia
                  </div>
                )}
              </div>
            </div>
            <div className="border-b border-gray-300 mb-8" />
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-black" /> Dokumen Yang
                Dibutuhkan
              </h2>
              <ul className="flex flex-wrap gap-3 ml-6 font-light opacity-80">
                {job.documents.map((doc, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200"
                  >
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-b border-gray-300 mb-8" />
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-black" /> Tanggal Penting
              </h2>
              {importantDates && (
                <div className="ml-6">
                  <div className="grid grid-cols-1 md:grid-cols-[160px_auto] font-light opacity-80 mb-2">
                    <span className="font-medium opacity-100">Pembukaan</span>
                    <span>: {importantDates.Pembukaan}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[160px_auto] font-light opacity-80 mb-2">
                    <span className="font-medium opacity-100">Penutupan</span>
                    <span>: {importantDates.Penutupan}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-gray-300 mb-8" />

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Rincian Lowongan
              </h2>

              <div className="mb-6 ml-6">
                <h3 className="font-semibold text-gray-800 mb-3 ml-6">
                  Persyaratan :
                </h3>
                <div className="pl-6 font-light opacity-80 space-y-2 text-justify">
                  {requirementLines.length > 0 ? (
                    requirementLines.map((req, index) => (
                      <p key={index} className="text-justify leading-relaxed">
                        {req}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Tidak ada persyaratan khusus
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 ml-6">
                <h3 className="font-semibold text-gray-800 mb-3 ml-6">
                  Jobdesk :
                </h3>
                <div className="pl-6 font-light opacity-80 space-y-2 text-justify">
                  {jobdeskLines.length > 0 ? (
                    jobdeskLines.map((desc, index) => (
                      <p key={index} className="text-justify leading-relaxed">
                        {desc}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Tidak ada deskripsi pekerjaan
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian kanan (1/3) - Daftar lowongan terkait */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg px-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Lowongan Terkait
            </h2>

            {/* Loading state for related jobs */}
            {relatedJobsLoading && (
              <div className="flex flex-col gap-10">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-black/10 rounded-xl p-4 relative transition-opacity duration-200"
                  >
                    <div className="w-35 h-32 rounded-md absolute animate-pulse bg-gray-400 -left-8 -top-4" />
                    <div className="ml-25 space-y-2">
                      <div className="w-full p-4 bg-gray-400 rounded-md animate-pulse"></div>
                      <div className="w-full p-2 py-2 bg-gray-400 rounded-md animate-pulse"></div>
                      <div className="w-[100px] p-2 py-2 bg-gray-400 rounded-md animate-pulse"></div>
                    </div>
                    <div className="mt-8 space-y-2">
                      <div className="w-[100px] p-3 bg-gray-400 rounded-md animate-pulse"></div>
                      <div className="w-[50px] p-3 bg-gray-400 rounded-md animate-pulse"></div>
                      <div className="mt-4 flex items-center justify-end">
                        <div className="w-[150px] p-6 bg-gray-400 rounded-md animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state for related jobs */}
            {relatedJobsError && (
              <p className="text-gray-500 text-center py-4 text-sm">
                Gagal memuat lowongan terkait
              </p>
            )}

            {/* Success state for related jobs */}
            {!relatedJobsLoading &&
              !relatedJobsError &&
              relatedJobs.length > 0 && (
                <div className="flex flex-col gap-10">
                  {relatedJobs.map((job) => (
                    <JobsCard
                      key={job.id}
                      job={{
                        id: job.id,
                        image: job.company.logo,
                        perusahaan: job.company.name,
                        lokasi: job.company.location,
                        mulai:
                          job.importantDates?.Pembukaan || "Tidak tersedia",
                        selesai:
                          job.importantDates?.Penutupan || "Tidak tersedia",
                        divisi: job.position,
                        statusMagang: job.internshipSystem,
                        status: job.status,
                        statusLabel: job.statusLabel,
                        isClosed: job.isClosed,
                        pendaftar: job.total_pendaftar || 0,
                        maxKuota: job.max_kuota ?? 0,
                      }}
                    />
                  ))}
                </div>
              )}

            {/* No related jobs found */}
            {!relatedJobsLoading &&
              !relatedJobsError &&
              relatedJobs.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  Tidak ada lowongan terkait saat ini
                </p>
              )}

            <div className="mt-6 text-center">
              <Link
                to="/lowongan"
                className="text-blue-600 hover:underline text-sm flex items-center justify-center"
              >
                Lihat semua lowongan
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PemberkasanModal
          isOpen={isModalOpen}
          onClose={closeApplyModal}
          jobData={job}
        />
      )}
    </div>
  );
}
