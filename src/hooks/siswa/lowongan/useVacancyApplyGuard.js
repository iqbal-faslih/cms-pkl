import { useCallback, useEffect, useState } from "react";
import { getRiwayatLowongan, getStatusMagang } from "../../../helpers/apiClient";

const normalizeRole = (role) => String(role || "").trim().toLowerCase();
const normalizeText = (value) => String(value || "").trim().toLowerCase();
const ACCEPTED_STATUSES = new Set([
  "diterima",
  "accepted",
  "approve",
  "approved",
  "aktif",
  "active",
  "1",
  "true",
]);

const isAcceptedStatus = (value) => ACCEPTED_STATUSES.has(normalizeText(value));

const extractArrayFromRiwayatResponse = (responsePayload) => {
  if (Array.isArray(responsePayload)) return responsePayload;
  if (!responsePayload || typeof responsePayload !== "object") return [];

  const candidates = [
    responsePayload?.data,
    responsePayload?.data?.data,
    responsePayload?.data?.items,
    responsePayload?.data?.rows,
    responsePayload?.data?.results,
    responsePayload?.items,
    responsePayload?.rows,
    responsePayload?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const resolveCompanyIdCandidates = (item = {}) => {
  const values = [
    item?.id_perusahaan,
    item?.perusahaan_id,
    item?.company_id,
    item?.perusahaan?.id,
    item?.perusahaan?.id_perusahaan,
    item?.nama_perusahaan?.id,
    item?.nama_perusahaan?.id_perusahaan,
    item?.company?.id,
    item?.lowongan?.id_perusahaan,
    item?.lowongan?.perusahaan_id,
    item?.lowongan?.perusahaan?.id,
    item?.lowongan?.perusahaan?.id_perusahaan,
    item?.magang?.id_perusahaan,
    item?.magang?.perusahaan_id,
    item?.magang?.perusahaan?.id,
    item?.magang?.perusahaan?.id_perusahaan,
  ];

  return values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
};

const resolveCompanyNameCandidates = (item = {}) => {
  const values = [
    item?.nama_perusahaan,
    item?.perusahaan?.nama,
    item?.perusahaan?.nama_perusahaan,
    item?.nama_perusahaan?.nama,
    item?.nama_perusahaan?.nama_perusahaan,
    item?.company?.name,
    item?.lowongan?.perusahaan?.nama,
    item?.lowongan?.perusahaan?.nama_perusahaan,
    item?.magang?.perusahaan?.nama,
    item?.magang?.perusahaan?.nama_perusahaan,
  ];

  return values.map((value) => normalizeText(value)).filter(Boolean);
};

const buildCompanySignatureSet = (item = {}) => {
  const signatures = new Set();
  resolveCompanyIdCandidates(item).forEach((id) => signatures.add(`id:${id}`));
  resolveCompanyNameCandidates(item).forEach((name) => signatures.add(`name:${name}`));
  return signatures;
};

const hasIntersectedSignature = (a = new Set(), b = new Set()) =>
  [...a].some((signature) => b.has(signature));

export const useVacancyApplyGuard = ({
  token,
  user,
  role,
  navigate,
  currentJob = null,
  isLowonganClosed = false,
}) => {
  const [userMagangStatus, setUserMagangStatus] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [companyApplyBlocked, setCompanyApplyBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchUserMagangStatus = async () => {
      if (!token || !user || normalizeRole(role) !== "peserta") return;

      try {
        const [magangResult, riwayatResult] = await Promise.allSettled([
          getStatusMagang(),
          getRiwayatLowongan(),
        ]);

        if (cancelled) return;

        const isTerdaftar = magangResult.value?.data?.data === "true";
        setUserMagangStatus(isTerdaftar ? "terdaftar" : "belum_terdaftar");

        if (riwayatResult.status === "fulfilled") {
          const items = extractArrayFromRiwayatResponse(riwayatResult.value?.data);
          const acceptedItems = items.filter((item) =>
            isAcceptedStatus(item?.status || item?.status_lamaran || item?.status_magang)
          );
          setAcceptedApplications(acceptedItems);
        }
      } catch (error) {
        if (cancelled) return;

        if (error?.response?.status === 401) {
          setUserMagangStatus("belum_terdaftar");
        }
        console.error("Gagal memuat status magang:", error);
      }
    };

    fetchUserMagangStatus();

    return () => {
      cancelled = true;
    };
  }, [token, user, role]);

  useEffect(() => {
    const isPeserta = normalizeRole(role) === "peserta";
    if (!token || !user || !isPeserta) {
      setCompanyApplyBlocked(false);
      return;
    }

    if (!currentJob || acceptedApplications.length === 0) {
      setCompanyApplyBlocked(false);
      return;
    }

    const targetSignatures = buildCompanySignatureSet({
      id_perusahaan: currentJob?.company?.id || currentJob?.id_perusahaan || currentJob?.perusahaan_id,
      perusahaan: {
        id: currentJob?.company?.id,
        nama: currentJob?.company?.name || currentJob?.perusahaan,
        nama_perusahaan: currentJob?.company?.name,
      },
      nama_perusahaan: currentJob?.company?.name || currentJob?.perusahaan,
      company: {
        id: currentJob?.company?.id,
        name: currentJob?.company?.name || currentJob?.perusahaan,
      },
    });

    if (targetSignatures.size === 0) {
      setCompanyApplyBlocked(false);
      return;
    }

    const blocked = acceptedApplications.some((item) =>
      hasIntersectedSignature(targetSignatures, buildCompanySignatureSet(item))
    );

    setCompanyApplyBlocked(blocked);
  }, [acceptedApplications, currentJob, role, token, user]);

  const openApplyModal = useCallback(
    (event) => {
      event.preventDefault();
      setStatusError("");

      if (!token || !user) {
        navigate("/auth/login");
        return;
      }

      const currentRole = normalizeRole(role);
      if (currentRole && currentRole !== "peserta") {
        setStatusError("Hanya peserta yang dapat melamar lowongan.");
        return;
      }

      if (isLowonganClosed) {
        setStatusError("Lowongan ini sudah ditutup.");
        return;
      }

      if (userMagangStatus === "terdaftar") {
        setStatusError(
          "Anda sudah terdaftar magang. Tidak dapat melamar lowongan baru."
        );
        return;
      }

      if (companyApplyBlocked) {
        setStatusError(
          "Anda sudah diterima di perusahaan ini. Tidak dapat melamar lowongan lain pada perusahaan yang sama."
        );
        return;
      }

      setIsModalOpen(true);
    },
    [
      companyApplyBlocked,
      isLowonganClosed,
      navigate,
      role,
      token,
      user,
      userMagangStatus,
    ]
  );

  const closeApplyModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openApplyModal,
    closeApplyModal,
    statusError,
    userMagangStatus,
    companyApplyBlocked,
  };
};
