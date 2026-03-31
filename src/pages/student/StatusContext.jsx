import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import {
  api,
  getPesertaDetail,
  getRiwayatLowongan,
  getStatusMagang,
} from "../../helpers/apiClient";

export const StatusContext = createContext();

const STATUS_ERROR_TOAST_ID = "status-fetch-error";
const STATUS_ENDPOINT = "/complete/peserta";
const ACCEPTED_STATUSES = new Set([
  "diterima",
  "accepted",
  "approve",
  "approved",
]);
const PENDING_STATUSES = new Set(["pending", "menunggu", "menunggu konfirmasi", "diproses", "verifikasi"]);
const REJECTED_STATUSES = new Set(["rejected", "reject", "ditolak"]);

const parseBooleanValue = (value, fallback = null) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (
      [
        "true",
        "1",
        "yes",
        "ya",
        "approved",
        "accept",
        "accepted",
        "diterima",
        "aktif",
        "active",
        "terdaftar",
        "magang",
        "ongoing",
        "in_progress",
        "verified",
      ].includes(normalized)
    ) {
      return true;
    }
    if (
      [
        "false",
        "0",
        "no",
        "tidak",
        "pending",
        "menunggu",
        "diproses",
        "verifikasi",
        "rejected",
        "ditolak",
        "blocked",
        "inactive",
        "nonaktif",
      ].includes(normalized)
    ) {
      return false;
    }
  }
  return fallback;
};

const parseBooleanStatus = (source, candidateKeys, fallback = null) => {
  for (const key of candidateKeys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return parseBooleanValue(source[key], fallback);
    }
  }
  return fallback;
};

const parseApprovalDecision = (value, fallback = null) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return fallback;
  if (ACCEPTED_STATUSES.has(normalized)) return true;
  if (PENDING_STATUSES.has(normalized) || REJECTED_STATUSES.has(normalized)) return false;
  return fallback;
};

const parseApprovalStatus = (source, candidateKeys, fallback = null) => {
  for (const key of candidateKeys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return parseApprovalDecision(source[key], fallback);
    }
  }
  return fallback;
};

const resolveStatusPayload = (response) => {
  const root = response?.data;
  if (root === undefined || root === null) {
    return null;
  }

  // API can return a primitive boolean/string for completion status.
  if (typeof root !== "object") {
    const normalized = parseBooleanValue(root, null);
    return normalized === null ? null : { is_profil_lengkap: normalized };
  }

  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data;
  }

  if (root.data !== undefined && root.data !== null) {
    const normalized = parseBooleanValue(root.data, null);
    if (normalized !== null) {
      return { ...root, is_profil_lengkap: normalized };
    }
  }

  return root;
};

const extractArrayFromResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const candidates = [
    payload?.data,
    payload?.data?.data,
    payload?.data?.items,
    payload?.data?.rows,
    payload?.data?.results,
    payload?.items,
    payload?.rows,
    payload?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const isFilled = (value) => String(value ?? "").trim().length > 0;
const firstFilled = (source, keys = []) =>
  keys.find((key) => isFilled(source?.[key]));

const inferProfileCompleteFromDetail = (detailResponse) => {
  const payload = detailResponse?.data?.data || detailResponse?.data;
  const source =
    payload?.detail_peserta ||
    payload?.user ||
    payload?.peserta ||
    payload;

  if (!payload || typeof payload !== "object") {
    return false;
  }

  const requiredGroups = [
    ["nama", "name"],
    ["alamat", "address"],
    ["jenis_kelamin", "gender"],
    ["tempat_lahir", "birth_place"],
    ["tanggal_lahir", "birth_date"],
    ["telepon", "no_telp", "phone"],
    ["sekolah", "asal_sekolah", "school"],
    ["jurusan", "major"],
  ];

  const hasBaseFields = requiredGroups.every((group) =>
    Boolean(firstFilled(source, group))
  );
  const hasIdentity = Boolean(
    firstFilled(source, ["nomor_identitas", "nisn", "nim"])
  );
  return hasBaseFields && hasIdentity;
};

const hasMeaningfulValue = (value) => {
  if (!isFilled(value)) return false;
  const normalized = String(value).trim().toLowerCase();
  return !["-", "n/a", "null", "undefined", "belum", "belum terdaftar magang"].includes(
    normalized
  );
};

const isAcceptedStatus = (value) =>
  ACCEPTED_STATUSES.has(String(value ?? "").trim().toLowerCase());

const inferInternshipFromRiwayat = (riwayatResponse) => {
  const rows = extractArrayFromResponse(riwayatResponse?.data);
  return rows.some((item) => {
    const explicitApprovalToken =
      item?.status_lamaran ??
      item?.status_pendaftaran ??
      item?.approval_status ??
      item?.approval?.status ??
      item?.pendaftaran?.status;

    // Fallback only when no explicit approval field exists.
    const fallbackToken = explicitApprovalToken == null ? item?.status : explicitApprovalToken;
    return isAcceptedStatus(fallbackToken);
  });
};

const inferInternshipFromDetail = (detailResponse) => {
  const payload = detailResponse?.data?.data || detailResponse?.data;
  const source =
    payload?.detail_peserta ||
    payload?.user ||
    payload?.peserta ||
    payload;

  if (!source || typeof source !== "object") return false;

  const explicitStatus = parseBooleanStatus(
    source,
    ["is_magang", "magang", "status_magang", "internship_status"],
    null
  );
  if (explicitStatus === true) return true;

  const mentorAssigned = hasMeaningfulValue(source?.id_mentor);
  const divisionAssigned = hasMeaningfulValue(source?.id_divisi);
  const startDateAssigned = hasMeaningfulValue(
    source?.mulai_magang || source?.tanggal_mulai_magang
  );

  // Strict fallback: treat as active internship only when placement markers exist.
  // Avoid inferring from generic fields (e.g. perusahaan/progress) because they can
  // also exist in pre-approval flow and unlock protected routes incorrectly.
  return mentorAssigned || divisionAssigned || startDateAssigned;
};

export const StatusProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const initializedTokenRef = useRef(null);
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(
    JSON.parse(sessionStorage.getItem("profileComplete")) || false
  );
  const [internshipStatus, setInternshipStatus] = useState(
    JSON.parse(sessionStorage.getItem("internshipStatus")) || false
  );
  const [applyingStatus, setApplyingStatus] = useState(
    JSON.parse(sessionStorage.getItem("applyingStatus")) || false
  );
  const [userLoading, setUserLoading] = useState(true);

  const fetchUserData = async ({ silent = false } = {}) => {
    try {
      if (!token) return;

      if (!silent) {
        setUserLoading(true);
      }

      const res = await api.get(STATUS_ENDPOINT);

      const statusData = resolveStatusPayload(res);
      const nextProfileComplete = parseBooleanStatus(statusData, [
        "is_profil_lengkap",
        "is_profile_lengkap",
        "profil_lengkap",
        "profile_complete",
      ], null);
      let nextInternshipStatus = parseBooleanStatus(statusData, [
        "is_magang",
        "magang",
        "internship_status",
      ], internshipStatus);
      if (nextInternshipStatus !== true) {
        nextInternshipStatus = parseApprovalStatus(statusData, [
        "status_magang",
        "status_lamaran",
        "status_pendaftaran",
        "approval_status",
        ], nextInternshipStatus);
      }
      let nextApplyingStatus = parseBooleanStatus(statusData, [
        "is_apply_lowongan",
        "apply_lowongan",
        "is_applying",
      ], applyingStatus);
      let pesertaDetailRes = null;

      if (nextInternshipStatus !== true) {
        try {
          const magangRes = await getStatusMagang();
          const explicitMagangStatus = parseBooleanValue(
            magangRes?.data?.data,
            null
          );
          if (explicitMagangStatus !== null) {
            nextInternshipStatus = explicitMagangStatus;
          }
        } catch {
          // Keep previous parsed value when dedicated endpoint is unavailable.
        }
      }

      if (nextInternshipStatus !== true) {
        try {
          pesertaDetailRes = pesertaDetailRes || (await getPesertaDetail());
          const inferredInternship = inferInternshipFromDetail(pesertaDetailRes);
          if (inferredInternship) {
            nextInternshipStatus = true;
          }
        } catch {
          // Ignore detail fallback errors and keep current internship status.
        }
      }

      if (nextInternshipStatus !== true) {
        try {
          const riwayatRes = await getRiwayatLowongan();
          if (inferInternshipFromRiwayat(riwayatRes)) {
            nextInternshipStatus = true;
          }
        } catch {
          // Ignore riwayat fallback errors and keep current internship status.
        }
      }

      let resolvedProfileComplete = nextProfileComplete;
      if (resolvedProfileComplete !== true) {
        pesertaDetailRes = pesertaDetailRes || (await getPesertaDetail());
        const inferredFromDetail = inferProfileCompleteFromDetail(pesertaDetailRes);

        // Fallback safeguard:
        // if status endpoint is stale/lagging but profile detail is complete,
        // trust detail to prevent false lock.
        resolvedProfileComplete = inferredFromDetail || resolvedProfileComplete;
      }

      if (nextInternshipStatus === true) {
        nextApplyingStatus = false;
      }

      setProfileComplete(resolvedProfileComplete);
      setInternshipStatus(nextInternshipStatus);
      setApplyingStatus(nextApplyingStatus);
      setRole("peserta");

      // Simpan ke sessionStorage sebagai cache
      sessionStorage.setItem(
        "profileComplete",
        JSON.stringify(resolvedProfileComplete)
      );
      sessionStorage.setItem(
        "internshipStatus",
        JSON.stringify(nextInternshipStatus)
      );
      sessionStorage.setItem(
        "applyingStatus",
        JSON.stringify(nextApplyingStatus)
      );
    } catch (error) {
      const statusCode = error?.response?.status;

      // Hindari menampilkan error 500 mentah saat auto-load login.
      if (!silent && statusCode !== 500) {
        toast.error(
          `Gagal fetch data user: ${
            error?.response?.data?.message || error.message
          }`,
          { toastId: STATUS_ERROR_TOAST_ID }
        );
      }
    } finally {
      if (!silent) {
        setUserLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      initializedTokenRef.current = null;
      return;
    }
    if (initializedTokenRef.current === token) return;
    initializedTokenRef.current = token;

    const savedProfileComplete = sessionStorage.getItem("profileComplete");
    const savedInternshipStatus = sessionStorage.getItem("internshipStatus");
    const savedApplyingStatus = sessionStorage.getItem("applyingStatus");

    if (savedProfileComplete && savedInternshipStatus && savedApplyingStatus) {
      setProfileComplete(JSON.parse(savedProfileComplete));
      setInternshipStatus(JSON.parse(savedInternshipStatus));
      setApplyingStatus(JSON.parse(savedApplyingStatus));
      setUserLoading(false);
    }

    // Always revalidate from API on mount so stale cache cannot lock user.
    fetchUserData({ silent: false });
  }, [token]);

  return (
    <StatusContext.Provider
      value={{
        role,
        setRole,
        profileComplete,
        internshipStatus,
        applyingStatus,
        userLoading,
        refreshUserData: fetchUserData,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;

