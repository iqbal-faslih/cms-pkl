import { useEffect, useMemo, useState } from "react";
import { api } from "../helpers/apiClient";
import { resolveApplicantCountValue } from "../helpers/lowonganStatusHelper";
import {
  extractApprovalItems,
  extractApprovalMeta,
  normalizeLowonganId,
  resolveLowonganIdFromApprovalItem,
  resolveLowonganNameFromApprovalItem,
} from "../helpers/lowonganApplicantHelper";

const resolveRole = () =>
  String(sessionStorage.getItem("role") || localStorage.getItem("role") || "")
    .trim()
    .toLowerCase();

const resolveApprovalEndpoint = () =>
  resolveRole() === "cabang" ? "/cabang/approval/daftar" : "/perusahaan/approval/daftar";

const buildPageParams = (page, perPage) => ({
  page,
  per_page: perPage,
});

const normalizeName = (value) => String(value || "").trim().toLowerCase();

const countApplicantsForLowongan = (items, lowonganId, lowonganName = "") => {
  const normalizedId = normalizeLowonganId(lowonganId);
  const normalizedName = normalizeName(lowonganName);
  if (!normalizedId) return 0;
  return items.reduce((total, item) => {
    const itemId = resolveLowonganIdFromApprovalItem(item);
    if (itemId && itemId === normalizedId) return total + 1;

    if (!itemId && normalizedName) {
      const itemName = normalizeName(resolveLowonganNameFromApprovalItem(item));
      return itemName && itemName === normalizedName ? total + 1 : total;
    }

    return total;
  }, 0);
};

export const useLowonganApplicantCount = (
  jobId,
  jobData,
  options = {}
) => {
  const { perPage = 200 } = options;
  const baseCount = useMemo(
    () => resolveApplicantCountValue(jobData),
    [jobData]
  );
  const jobName = useMemo(
    () => jobData?.nama || jobData?.judul || jobData?.title || "",
    [jobData]
  );
  const [count, setCount] = useState(baseCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(baseCount);
  }, [baseCount]);

  useEffect(() => {
    const normalizedJobId = normalizeLowonganId(jobId);
    if (!normalizedJobId) return;
    if (baseCount > 0) return;

    let isActive = true;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const endpoint = resolveApprovalEndpoint();
        const firstResponse = await api.get(endpoint, {
          params: buildPageParams(1, perPage),
        });

        const firstItems = extractApprovalItems(firstResponse?.data);
        let totalCount = countApplicantsForLowongan(
          firstItems,
          normalizedJobId,
          jobName
        );

        const meta = extractApprovalMeta(firstResponse?.data);
        const lastPage = Number(meta?.last_page || meta?.lastPage || 1);

        if (Number.isFinite(lastPage) && lastPage > 1) {
          for (let page = 2; page <= lastPage; page += 1) {
            const nextResponse = await api.get(endpoint, {
              params: buildPageParams(page, perPage),
            });
            const pageItems = extractApprovalItems(nextResponse?.data);
            totalCount += countApplicantsForLowongan(
              pageItems,
              normalizedJobId,
              jobName
            );
          }
        }

        if (isActive) setCount(totalCount);
      } catch (error) {
        if (isActive) setCount(baseCount);
        console.error("Failed to fetch applicant count:", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchApplicants();

    return () => {
      isActive = false;
    };
  }, [jobId, baseCount, perPage, jobName]);

  return { count, loading };
};

export default useLowonganApplicantCount;
