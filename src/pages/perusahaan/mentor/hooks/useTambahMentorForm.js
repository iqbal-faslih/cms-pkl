import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { TambahMentorFields } from "@/shared/fields/perusahaan/dashboard/TambahMentor";
import {
  createCabangMentor,
  getCabangDivisiList,
  getCabangMentorById,
  getCabangMentorList,
  createPerusahaanMentor,
  getDivisiList,
  getMentorById,
  getPerusahaanMentorById,
  getPerusahaanMentorList,
  updateCabangMentor,
  updatePerusahaanMentor,
} from "@/helpers/apiClient";
import { resolveMentorRoleContext } from "../helpers/mentorRoleContext";
import {
  extractDivisiList,
  extractMentorItem,
  extractMentorList,
  mergeMentorData,
  pickFirstText,
  resolveMentorDivisionId,
  resolveMentorDivisionName,
  resolveMentorEmail,
  resolveMentorEntityId,
  resolveMentorName,
  resolveMentorPhone,
  resolveMentorPhotoName,
} from "../helpers/mentorResolvers";

const EMPTY_FORM = {
  Nama: "",
  Foto: "",
  Nomor: "",
  Email: "",
  Password: "",
  Divisi: "",
};
const BACKEND_MENTOR_DESCRIPTION_FALLBACK = "-";

const mapMentorToFormData = (mentor) => ({
  Nama: resolveMentorName(mentor),
  Foto: resolveMentorPhotoName(mentor),
  Nomor: resolveMentorPhone(mentor),
  Email: resolveMentorEmail(mentor),
  Password: "",
  Divisi: resolveMentorDivisionId(mentor),
});

const mergeFormData = (...formCandidates) =>
  formCandidates.reduce(
    (acc, current) => ({
      Nama: pickFirstText([acc.Nama, current?.Nama], ""),
      Foto: pickFirstText([acc.Foto, current?.Foto], ""),
      Nomor: pickFirstText([acc.Nomor, current?.Nomor], ""),
      Email: pickFirstText([acc.Email, current?.Email], ""),
      Password: "",
      Divisi: pickFirstText([acc.Divisi, current?.Divisi], ""),
    }),
    { ...EMPTY_FORM }
  );

const validateMentorForm = (formData) => {
  const errors = {};
  if (!String(formData.Nama || "").trim()) errors.Nama = "Nama wajib diisi!";
  if (!String(formData.Nomor || "").trim()) errors.Nomor = "Nomor HP wajib diisi!";
  if (!String(formData.Email || "").trim()) errors.Email = "Email wajib diisi!";
  if (!String(formData.Divisi || "").trim()) errors.Divisi = "Divisi wajib diisi!";

  return errors;
};

export const useTambahMentorForm = () => {
  const formRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isCabangRole, mentorRouteBase } = resolveMentorRoleContext();
  const isEditMode = Boolean(id);
  const mentorFromState = location.state?.mentor || null;

  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(isEditMode);
  const [loadingDivisi, setLoadingDivisi] = useState(false);
  const [hasFetchedDivisi, setHasFetchedDivisi] = useState(false);
  const [initialData, setInitialData] = useState(EMPTY_FORM);
  const [formVersion, setFormVersion] = useState(0);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [mentorEntityId, setMentorEntityId] = useState("");
  const [mentorRawData, setMentorRawData] = useState(null);

  const layout = [
    ["Nama", "Foto"],
    ["Nomor", "Email"],
    ["Divisi", "Password"],
  ];

  const fetchDivisi = useCallback(async () => {
    if (loadingDivisi) return;

    setLoadingDivisi(true);
    try {
      const response = isCabangRole ? await getCabangDivisiList() : await getDivisiList();
      let list = extractDivisiList(response);

      if (list.length === 0) {
        const fallbackResponse = isCabangRole
          ? await getCabangDivisiList()
          : await getDivisiList();
        list = extractDivisiList(fallbackResponse);
      }

      const formatLabel = (raw = "") =>
        String(raw)
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());

      const normalizedNameCounts = {};
      list.forEach((item) => {
        const name = formatLabel(item?.nama || item?.nama_divisi || item?.name || "");
        if (!name) return;
        const key = name.toLowerCase();
        normalizedNameCounts[key] = (normalizedNameCounts[key] || 0) + 1;
      });

      const seenDivisiIds = new Set();
      const options = [];
      list.forEach((item) => {
        const value = String(item.id ?? item.id_divisi ?? "").trim();
        const baseLabel = formatLabel(item.nama || item.nama_divisi || item?.name || "");
        const cabangName = formatLabel(item?.cabang?.nama || item?.nama_cabang || "");
        const normalizedName = baseLabel.toLowerCase();
        const isDuplicateName = (normalizedNameCounts[normalizedName] || 0) > 1;

        const label = isDuplicateName
          ? `${baseLabel} - ${cabangName || "Cabang"}`
          : baseLabel;

        if (!value || !label) return;
        if (seenDivisiIds.has(value)) return;
        seenDivisiIds.add(value);

        options.push({ label, value });
      });

      setDivisiOptions(options);
      setHasFetchedDivisi(true);
    } catch (error) {
      console.error("Gagal mengambil data divisi:", error);
      setDivisiOptions([]);
      setHasFetchedDivisi(false);
    } finally {
      setLoadingDivisi(false);
    }
  }, [isCabangRole, loadingDivisi]);

  useEffect(() => {
    if (isEditMode && !hasFetchedDivisi && !loadingDivisi) {
      fetchDivisi();
    }
  }, [fetchDivisi, hasFetchedDivisi, isEditMode, loadingDivisi]);

  useEffect(() => {
    if (!isEditMode || !id) return;

    if (mentorFromState) {
      setMentorEntityId(resolveMentorEntityId(mentorFromState) || String(id));
      setInitialData(mapMentorToFormData(mentorFromState));
      setFormVersion((prev) => prev + 1);
      setLoadingDetail(false);
    }

    const fetchMentorDetail = async () => {
      if (!mentorFromState) setLoadingDetail(true);
      try {
        const sourceResults = await Promise.allSettled([
          isCabangRole ? getCabangMentorById(id) : getPerusahaanMentorById(id),
          getMentorById(id),
          isCabangRole ? getCabangMentorList() : getPerusahaanMentorList(),
        ]);

        const mentorFromPerusahaan =
          sourceResults[0]?.status === "fulfilled"
            ? extractMentorItem(sourceResults[0].value)
            : null;

        const mentorFromMentorEndpoint =
          sourceResults[1]?.status === "fulfilled"
            ? extractMentorItem(sourceResults[1].value)
            : null;

        const mentorList =
          sourceResults[2]?.status === "fulfilled"
            ? extractMentorList(sourceResults[2].value)
            : [];

        const normalizedId = String(id).trim();
        const mentorFromList =
          mentorList.find((item) => String(item?.id ?? "").trim() === normalizedId) ||
          mentorList.find(
            (item) =>
              String(item?.id_mentor ?? item?.mentor_id ?? "").trim() === normalizedId
          ) ||
          null;

        const mentorMerged = mergeMentorData(
          mergeMentorData(mentorFromPerusahaan, mentorFromMentorEndpoint),
          mentorFromList
        );

        const mentor = mergeMentorData(mentorMerged, mentorFromState);
        if (!mentor) {
          throw new Error("Data mentor tidak ditemukan");
        }

        const mergedForm = mergeFormData(
          mapMentorToFormData(mentorFromState),
          mapMentorToFormData(mentorFromList),
          mapMentorToFormData(mentorFromMentorEndpoint),
          mapMentorToFormData(mentorFromPerusahaan)
        );

        const entityId = pickFirstText(
          [
            resolveMentorEntityId(mentorFromPerusahaan),
            resolveMentorEntityId(mentorFromMentorEndpoint),
            resolveMentorEntityId(mentorFromList),
            resolveMentorEntityId(mentorFromState),
            resolveMentorEntityId(mentor),
          ],
          ""
        );

        setMentorRawData(mentor);
        setMentorEntityId(entityId);
        setInitialData(mergedForm);
        setFormVersion((prev) => prev + 1);
      } catch (error) {
        console.error("Gagal memuat data mentor untuk edit:", error);
        if (!mentorFromState) {
          await Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal memuat data mentor untuk diedit",
          });
          navigate(mentorRouteBase);
        }
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchMentorDetail();
  }, [id, isEditMode, isCabangRole, mentorFromState, navigate, mentorRouteBase]);

  useEffect(() => {
    if (!isEditMode) return;
    if (!mentorRawData) return;
    if (!Array.isArray(divisiOptions) || divisiOptions.length === 0) return;
    if (initialData.Divisi) return;

    const normalizedDivisionName = resolveMentorDivisionName(mentorRawData)
      .trim()
      .toLowerCase();
    if (!normalizedDivisionName) return;

    const matchedOption = divisiOptions.find(
      (option) => String(option.label).trim().toLowerCase() === normalizedDivisionName
    );
    if (!matchedOption?.value) return;

    setInitialData((prev) => ({ ...prev, Divisi: matchedOption.value }));
    setFormVersion((prev) => prev + 1);
  }, [divisiOptions, initialData.Divisi, isEditMode, mentorRawData]);

  const fields = useMemo(
    () =>
      TambahMentorFields.map((field) => {
        if (field.name === "Description") return null;
        if (field.name === "Divisi") {
          return {
            ...field,
            options: divisiOptions,
            loading: loadingDivisi,
            loadingText: "Memuat data divisi...",
            onOpenChange: (isOpen) => {
              if (!isOpen) return;
              if (isEditMode && hasFetchedDivisi) return;
              if (!isEditMode && hasFetchedDivisi && divisiOptions.length > 0) return;
              fetchDivisi();
            },
          };
        }
        if (field.name === "Foto") return { ...field, required: !isEditMode };
        if (field.name === "Password") return { ...field, required: !isEditMode };
        return field;
      }).filter(Boolean),
    [divisiOptions, fetchDivisi, hasFetchedDivisi, isEditMode, loadingDivisi]
  );

  const handleSubmit = async (formData) => {
    const validation = validateMentorForm(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitLoading(true);
    try {
      const payload = new FormData();
      payload.append("nama", formData.Nama || "");
      payload.append("email", formData.Email || "");
      payload.append("telepon", formData.Nomor || "");
      payload.append("id_divisi", formData.Divisi || "");
      // Backend still validates description fields; send a neutral fallback.
      payload.append("deskripsi", BACKEND_MENTOR_DESCRIPTION_FALLBACK);
      payload.append("description", BACKEND_MENTOR_DESCRIPTION_FALLBACK);

      if (!isEditMode || String(formData.Password || "").trim()) {
        payload.append("password", formData.Password || "");
      }

      if (formData.Foto instanceof File) {
        payload.append("avatar", formData.Foto);
        payload.append("profile", formData.Foto);
        payload.append("foto", formData.Foto);
      }

      if (isEditMode) {
        const targetMentorId = mentorEntityId || String(id || "").trim();
        if (!targetMentorId) {
          throw new Error("ID mentor untuk update tidak ditemukan");
        }
        if (isCabangRole) {
          await updateCabangMentor(targetMentorId, payload);
        } else {
          await updatePerusahaanMentor(targetMentorId, payload);
        }
      } else if (isCabangRole) {
        await createCabangMentor(payload);
      } else {
        await createPerusahaanMentor(payload);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: isEditMode
          ? "Akun mentor berhasil diperbarui"
          : "Akun mentor berhasil dibuat",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(mentorRouteBase);
    } catch (error) {
      console.error("Gagal menyimpan mentor:", error);
      const responseData = error?.response?.data || {};
      const metaErrors =
        responseData?.meta && typeof responseData.meta === "object"
          ? Object.fromEntries(
              Object.entries(responseData.meta).filter(
                ([, value]) => Array.isArray(value) && value.length > 0
              )
            )
          : {};
      const backendErrors = {
        ...(responseData?.errors || {}),
        ...metaErrors,
      };

      const firstFieldError = Object.values(backendErrors).flat().find(Boolean);
      const readableErrors = Object.entries(backendErrors)
        .map(([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`
        )
        .join("\n");

      setErrors((prev) => ({
        ...prev,
        Foto: backendErrors.avatar?.[0] || backendErrors.foto?.[0] || prev.Foto,
        Email: backendErrors.email?.[0] || prev.Email,
        Nomor: backendErrors.telepon?.[0] || prev.Nomor,
        Divisi: backendErrors.id_divisi?.[0] || prev.Divisi,
        Password: backendErrors.password?.[0] || prev.Password,
      }));

      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          firstFieldError ||
          readableErrors ||
          responseData?.message ||
          responseData?.meta?.message ||
          "Terjadi kesalahan saat menyimpan data mentor",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    formRef.current?.reset();
    setErrors({});
    navigate(mentorRouteBase);
  };

  return {
    formRef,
    isEditMode,
    loadingDetail,
    fields,
    initialData,
    errors,
    layout,
    submitLoading,
    handleSubmit,
    handleCancel,
    formVersion,
    emptyForm: EMPTY_FORM,
  };
};
