import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useFileUpload } from "../../../../shared/hooks/useFileUpload.js";
import {
  getDivisiList,
  getDivisiDetail,
  getKategoriProyekList,
  createKategoriProyek,
  deleteKategoriProyek,
  createDivisi,
  updateDivisi,
  deleteDivisi,
} from "../../../../helpers/apiClient.js";

const FILE_BASE = (
  import.meta.env.VITE_API_URL_FILE ||
  import.meta.env.VITE_FILE_URL ||
  ""
).replace(/\/+$/, "");

const MIN_CATEGORY_NAME_LENGTH = 3;
const normalizeCategoryName = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const toFileUrl = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return "";
  if (value.startsWith("http")) return value;

  const normalized = value.replace(/^\/+/, "").replace(/^storage\/+/, "");
  if (!FILE_BASE) return `/${normalized}`;

  const baseHasStorage = /\/storage$/i.test(FILE_BASE);
  if (baseHasStorage) return `${FILE_BASE}/${normalized}`;
  return `${FILE_BASE}/storage/${normalized}`;
};

const formatDivisionDate = (rawDate) => {
  if (!rawDate) return "-";
  if (typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [year, month, day] = rawDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("id-ID");
  }
  if (typeof rawDate === "object") {
    const nested =
      rawDate?.date ||
      rawDate?.datetime ||
      rawDate?.value ||
      rawDate?.tgl ||
      rawDate?.tanggal;
    if (nested) return formatDivisionDate(nested);
  }
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return String(rawDate);
  return date.toLocaleDateString("id-ID");
};

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getErrorMessage = (error, fallback) => {
  const data = error?.response?.data || {};
  const metaMessage = data?.meta?.message;
  const message = data?.message;

  if (typeof metaMessage === "string" && metaMessage.trim()) return metaMessage;
  if (typeof message === "string" && message.trim()) return message;

  if (typeof message === "object" && message !== null) {
    const first = Object.values(message).find(
      (value) =>
        (Array.isArray(value) && value[0]) ||
        (typeof value === "string" && value.trim())
    );
    if (Array.isArray(first) && first[0]) return first[0];
    if (typeof first === "string" && first.trim()) return first;
  }

  const errors = data?.errors;
  if (typeof errors === "object" && errors !== null) {
    const first = Object.values(errors).find(
      (value) =>
        (Array.isArray(value) && value[0]) ||
        (typeof value === "string" && value.trim())
    );
    if (Array.isArray(first) && first[0]) return first[0];
    if (typeof first === "string" && first.trim()) return first;
  }

  return fallback;
};

const mapDivision = (item) => {
  const categoryRaw = Array.isArray(item?.kategori)
    ? [...item.kategori]
    : Array.isArray(item?.kategori_proyek)
      ? [...item.kategori_proyek]
      : [];

  const categoryObjects = categoryRaw
    .sort((a, b) => (a?.urutan || 0) - (b?.urutan || 0))
    .map((k) => ({
      id: k?.id ?? k?.id_kategori ?? k?.id_kategori_proyek,
      name: k?.nama ?? k?.nama_kategori ?? "",
      urutan: k?.urutan || 0,
    }))
    .filter((k) => k?.name)
    .filter((category, index, array) => {
      const categoryId = String(category?.id ?? "").trim();
      const categoryName = normalizeCategoryName(category?.name);
      return (
        array.findIndex((item) => {
          const itemId = String(item?.id ?? "").trim();
          const itemName = normalizeCategoryName(item?.name);
          if (categoryId && itemId) return categoryId === itemId;
          return categoryName && itemName && categoryName === itemName;
        }) === index
      );
    });

  const categories = categoryObjects.map((k) => k.name);

  const coverFromFoto = Array.isArray(item?.foto)
    ? item.foto.find((f) => f?.type === "foto_cover" || f?.type === "profil_cover")
    : null;

  const coverPath = (() => {
    if (typeof item?.foto_cover === "string") return item.foto_cover;
    if (item?.foto_cover?.url) return item.foto_cover.url;
    if (item?.foto_cover?.path) return item.foto_cover.path;
    if (coverFromFoto?.url) return coverFromFoto.url;
    if (coverFromFoto?.path) return coverFromFoto.path;
    return "";
  })();

  const dateValue = item?.created_at || item?.tgl || "";

  return {
    id: item?.id,
    title: item?.nama || item?.name || item?.nama_divisi || "-",
    note:
      item?.catatan || item?.note || item?.deskripsi || item?.description || "",
    rules:
      item?.ketentuan_divisi ||
      item?.ketentuan ||
      item?.rules ||
      item?.peraturan ||
      "",
    tanggal: formatDivisionDate(dateValue),
    dateRaw: dateValue,
    categoryObjects,
    categories,
    project: categories,
    cover: toFileUrl(coverPath) || "/assets/img/Cover3.png",
    raw: item,
  };
};

const isCategoryUsedByAnyDivision = (category, divisions = []) => {
  if (!category) return false;

  const categoryId = String(category.id ?? "").trim();
  const categoryName = String(category.name ?? "").trim().toLowerCase();

  return divisions.some((division) => {
    const categoryObjects = Array.isArray(division?.categoryObjects)
      ? division.categoryObjects
      : [];
    const rawCategories = Array.isArray(division?.raw?.kategori)
      ? division.raw.kategori
      : Array.isArray(division?.raw?.kategori_proyek)
        ? division.raw.kategori_proyek
        : [];

    const combinedCategories = [...categoryObjects, ...rawCategories];

    return combinedCategories.some((item) => {
      const itemId = String(
        item?.id ?? item?.id_kategori ?? item?.id_kategori_proyek ?? ""
      ).trim();
      const itemName = String(item?.name ?? item?.nama ?? "").trim().toLowerCase();

      if (categoryId && itemId && categoryId === itemId) return true;
      if (categoryName && itemName && categoryName === itemName) return true;
      return false;
    });
  });
};

const hasCategoryPayload = (division) => {
  if (!division || typeof division !== "object") return false;

  const hasCategoryObjects =
    Array.isArray(division.categoryObjects) && division.categoryObjects.length > 0;
  const hasRawKategori =
    Array.isArray(division?.raw?.kategori) && division.raw.kategori.length > 0;
  const hasRawKategoriProyek =
    Array.isArray(division?.raw?.kategori_proyek) &&
    division.raw.kategori_proyek.length > 0;

  return hasCategoryObjects || hasRawKategori || hasRawKategoriProyek;
};

export const useDivisiManagement = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortOption, setSortOption] = useState("terbaru-terlama");
  const [isFormPageOpen, setIsFormPageOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formState, setFormState] = useState({
    id: null,
    name: "",
    note: "",
    rules: "",
    categories: [],
    cover: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryDraft, setCategoryDraft] = useState("");
  const [categoryActionError, setCategoryActionError] = useState("");
  const [categoryActionSuccess, setCategoryActionSuccess] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [initialEditCategoryIds, setInitialEditCategoryIds] = useState([]);

  const upload = useFileUpload({
    validate: (file) => {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        return "Format file harus PNG atau JPG";
      }
      if (file.size > 5 * 1024 * 1024) {
        return "Ukuran maksimal 5MB";
      }
      return null;
    },
  });

  const loadDivisionDetail = useCallback(async (divisionId) => {
    if (!divisionId) return null;
    const res = await getDivisiDetail(divisionId);
    const detail = res?.data?.data;
    if (!detail || typeof detail !== "object") return null;
    return mapDivision(detail);
  }, []);

  const fetchDivisions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDivisiList();
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      const normalizedRows = await Promise.all(
        rows.map(async (item) => {
          if (item?.tgl || item?.created_at) return item;
          if (!item?.id) return item;
          try {
            const detail = await loadDivisionDetail(item.id);
            if (!detail?.raw) return item;
            return {
              ...item,
              tgl: detail?.raw?.tgl || item?.tgl || "",
              created_at: detail?.raw?.created_at || item?.created_at || "",
            };
          } catch {
            return item;
          }
        })
      );
      setDivisions(normalizedRows.map(mapDivision));
    } catch (error) {
      console.error("Gagal memuat data divisi:", error);
      setDivisions([]);
    } finally {
      setLoading(false);
    }
  }, [loadDivisionDetail]);

  const fetchCategoryOptions = useCallback(async () => {
    try {
      const res = await getKategoriProyekList();
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      const mapped = rows
        .map((item) => ({
          id: item?.id ?? item?.id_kategori ?? item?.id_kategori_proyek,
          name: item?.nama ?? item?.nama_kategori ?? item?.title ?? "",
        }))
        .filter((item) => item.id !== undefined && item.id !== null && item.name);
      setCategoryOptions(mapped);
    } catch (error) {
      console.error("Gagal memuat kategori proyek:", error);
      setCategoryOptions([]);
    }
  }, []);

  const handleAddCategory = async () => {
    const normalizedName = String(categoryDraft || "")
      .trim()
      .replace(/\s+/g, " ");

    if (!normalizedName) {
      setCategoryActionError("Nama kategori wajib diisi");
      setCategoryActionSuccess("");
      return;
    }

    if (normalizedName.length < MIN_CATEGORY_NAME_LENGTH) {
      setCategoryActionError(
        `Nama kategori minimal ${MIN_CATEGORY_NAME_LENGTH} karakter`
      );
      setCategoryActionSuccess("");
      return;
    }

    const exists = categoryOptions.some(
      (item) => String(item.name || "").trim().toLowerCase() === normalizedName.toLowerCase()
    );
    if (exists) {
      setCategoryActionError("Kategori ini sudah ada");
      setCategoryActionSuccess("");
      return;
    }

    try {
      setCreatingCategory(true);
      setCategoryActionError("");
      setCategoryActionSuccess("");
      await createKategoriProyek({ nama: normalizedName });
      await fetchCategoryOptions();
      setCategoryDraft("");
      setCategoryActionSuccess("Kategori berhasil ditambahkan");
    } catch (error) {
      setCategoryActionError(getErrorMessage(error, "Gagal menambahkan kategori"));
      setCategoryActionSuccess("");
      console.error("Gagal menambahkan kategori:", error?.response?.data || error);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (category, options = {}) => {
    const { skipUsageValidation = false } = options;
    if (!category?.id) return false;

    if (!skipUsageValidation) {
      let divisionsForValidation = divisions;
      try {
        const res = await getDivisiList();
        const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
        divisionsForValidation = await Promise.all(
          rows.map(async (item) => {
            const mapped = mapDivision(item);
            if (hasCategoryPayload(mapped)) return mapped;
            if (!item?.id) return mapped;

            try {
              const detail = await loadDivisionDetail(item.id);
              if (detail) return detail;
            } catch {
              return mapped;
            }

            return mapped;
          })
        );
      } catch (error) {
        console.warn("Gagal memuat ulang data divisi untuk validasi kategori:", error);
      }

      const categoryInUse = isCategoryUsedByAnyDivision(
        category,
        divisionsForValidation
      );
      if (categoryInUse) {
        setCategoryActionError(
          "Kategori tidak dapat dihapus karena masih digunakan pada divisi."
        );
        setCategoryActionSuccess("");
        return false;
      }
    }

    try {
      setDeletingCategoryId(category.id);
      setCategoryActionError("");
      setCategoryActionSuccess("");
      await deleteKategoriProyek(category.id);
      setFormState((prev) => ({
        ...prev,
        categories: prev.categories.filter(
          (selected) => String(selected.id) !== String(category.id)
        ),
      }));
      await fetchCategoryOptions();
      await fetchDivisions();
      setCategoryActionSuccess("Kategori berhasil dihapus");
      return true;
    } catch (error) {
      setCategoryActionError(getErrorMessage(error, "Kategori tidak dapat dihapus"));
      setCategoryActionSuccess("");
      console.error("Gagal menghapus kategori:", error?.response?.data || error);
      return false;
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const handleRemoveSelectedCategory = async (category) => {
    const categoryId = category?.id;
    setFormState((prev) => ({
      ...prev,
      categories: prev.categories.filter(
        (selected) => String(selected.id) !== String(categoryId)
      ),
    }));
    return true;
  };

  const handleCategoryDraftChange = (value) => {
    setCategoryDraft(value);
    if (categoryActionError) {
      setCategoryActionError("");
    }
    if (categoryActionSuccess) {
      setCategoryActionSuccess("");
    }
  };

  const handleReorderCategory = (draggedCategoryId, targetCategoryId) => {
    setCategoryOptions((prev) => {
      const sourceIndex = prev.findIndex(
        (item) => String(item.id) === String(draggedCategoryId)
      );
      const targetIndex = prev.findIndex(
        (item) => String(item.id) === String(targetCategoryId)
      );
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);

      setFormState((currentForm) => {
        const rankMap = new Map(
          next.map((item, index) => [String(item.id), index])
        );
        const sortedSelected = [...currentForm.categories].sort((a, b) => {
          const rankA = rankMap.has(String(a.id))
            ? rankMap.get(String(a.id))
            : Number.MAX_SAFE_INTEGER;
          const rankB = rankMap.has(String(b.id))
            ? rankMap.get(String(b.id))
            : Number.MAX_SAFE_INTEGER;
          return rankA - rankB;
        });

        return { ...currentForm, categories: sortedSelected };
      });

      setCategoryActionError("");
      setCategoryActionSuccess("Urutan kategori diperbarui");
      return next;
    });
  };

  useEffect(() => {
    fetchDivisions();
    fetchCategoryOptions();
  }, [fetchCategoryOptions, fetchDivisions]);

  const resetForm = () => {
    setFormState({
      id: null,
      name: "",
      note: "",
      rules: "",
      categories: [],
      cover: "",
    });
    setFormErrors({});
    setCategoryActionError("");
    setCategoryActionSuccess("");
    setCategoryDraft("");
    setIsCategoryModalOpen(false);
    setInitialEditCategoryIds([]);
    upload.deleteFile();
  };

  const openAddPage = () => {
    setFormMode("add");
    setInitialEditCategoryIds([]);
    resetForm();
    setIsFormPageOpen(true);
  };

  const toSelectedCategories = (baseDivision) => {
    const rawDivision = baseDivision?.raw || {};
    const rawCategoryArray = Array.isArray(rawDivision?.kategori)
      ? rawDivision.kategori
      : Array.isArray(rawDivision?.kategori_proyek)
        ? rawDivision.kategori_proyek
        : [];
    const sourceCategories = (baseDivision.categoryObjects && baseDivision.categoryObjects.length)
      ? baseDivision.categoryObjects
      : rawCategoryArray;

    return (sourceCategories || [])
      .map((cat, index) => {
        const categoryId =
          typeof cat === "object"
            ? cat?.id ?? cat?.id_kategori ?? cat?.id_kategori_proyek
            : null;
        const categoryName =
          typeof cat === "object" ? cat?.name || cat?.nama : cat;

        const foundById =
          categoryId !== null && categoryId !== undefined
            ? categoryOptions.find((item) => String(item.id) === String(categoryId))
            : null;
        if (foundById) return foundById;

        const foundByName = categoryOptions.find(
          (item) =>
            normalizeCategoryName(item?.name) ===
            normalizeCategoryName(categoryName || "")
        );
        if (foundByName) return foundByName;

        return { id: categoryId ?? `custom-${index}`, name: categoryName || "" };
      })
      .filter((item) => item?.name)
      .filter((category, index, array) => {
        const categoryId = String(category?.id ?? "").trim();
        const categoryName = normalizeCategoryName(category?.name);
        return (
          array.findIndex((item) => {
            const itemId = String(item?.id ?? "").trim();
            const itemName = normalizeCategoryName(item?.name);
            if (categoryId && itemId) return categoryId === itemId;
            return categoryName && itemName && categoryName === itemName;
          }) === index
        );
      });
  };

  const applyDivisionToForm = (sourceDivision) => {
    const rawDivision = sourceDivision?.raw || {};
    const selectedCategories = toSelectedCategories(sourceDivision);
    setFormMode("edit");
    setFormState({
      id: sourceDivision.id,
      name:
        sourceDivision.title || rawDivision?.nama || rawDivision?.name || "",
      note:
        sourceDivision.note ||
        rawDivision?.catatan ||
        rawDivision?.note ||
        rawDivision?.deskripsi ||
        "",
      rules:
        sourceDivision.rules ||
        rawDivision?.ketentuan_divisi ||
        rawDivision?.ketentuan ||
        rawDivision?.rules ||
        rawDivision?.peraturan ||
        "",
      categories: selectedCategories,
      cover: sourceDivision.cover || "",
    });
  };

  const openEditPage = async (division) => {
    if (!division) return;

    const initialSelectedCategories = toSelectedCategories(division);
    setInitialEditCategoryIds(
      initialSelectedCategories
        .map((item) => item?.id)
        .filter(
          (id) =>
            id !== undefined &&
            id !== null &&
            id !== "" &&
            !String(id).startsWith("custom-")
        )
        .map((id) => String(id))
    );
    applyDivisionToForm(division);
    setFormErrors({});
    setCategoryActionError("");
    setCategoryActionSuccess("");
    setCategoryDraft("");
    setIsCategoryModalOpen(false);
    upload.deleteFile();
    setIsFormPageOpen(true);

    try {
      const detailDivision = await loadDivisionDetail(division.id);
      if (detailDivision) {
        const detailSelectedCategories = toSelectedCategories(detailDivision);
        setInitialEditCategoryIds(
          detailSelectedCategories
            .map((item) => item?.id)
            .filter(
              (id) =>
                id !== undefined &&
                id !== null &&
                id !== "" &&
                !String(id).startsWith("custom-")
            )
            .map((id) => String(id))
        );
        applyDivisionToForm(detailDivision);
      }
    } catch (error) {
      console.warn("Detail divisi tidak tersedia, gunakan data list:", error);
    }
  };

  const validateForm = () => {
    const e = {};

    if (!formState.name.trim()) e.name = "Nama divisi wajib diisi";
    if (!formState.note.trim()) e.note = "Catatan wajib diisi";
    if (!formState.rules.trim()) e.rules = "Ketentuan divisi wajib diisi";
    if (!formState.categories.length) e.categories = "Minimal 1 kategori";
    if (!upload.fileState.file && formMode === "add") e.file = "Foto cover wajib";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const mapApiErrors = (error) => {
    const data = error?.response?.data || {};
    const meta = data?.meta || {};
    const errors = data?.errors || {};
    const message = data?.message || {};
    const next = {};

    const pickFirst = (...values) => {
      for (const value of values) {
        if (Array.isArray(value) && value[0]) return value[0];
        if (typeof value === "string" && value.trim()) return value;
      }
      return "";
    };

    next.name = pickFirst(meta?.nama, errors?.nama, message?.nama);
    next.note = pickFirst(meta?.catatan, errors?.catatan, message?.catatan);
    next.rules = pickFirst(
      meta?.ketentuan_divisi,
      errors?.ketentuan_divisi,
      message?.ketentuan_divisi
    );
    next.categories = pickFirst(
      meta?.kategori_proyek,
      errors?.kategori_proyek,
      message?.kategori_proyek,
      meta?.kategori,
      errors?.kategori,
      message?.kategori,
      meta?.["kategori.0.id"],
      meta?.["kategori.0.urutan"],
      errors?.["kategori.0.id"],
      errors?.["kategori.0.urutan"]
    );
    next.branch = pickFirst(
      meta?.id_cabang,
      errors?.id_cabang,
      message?.id_cabang
    );
    next.file = pickFirst(
      meta?.foto_cover,
      errors?.foto_cover,
      message?.foto_cover
    );

    Object.keys(next).forEach((key) => {
      if (!next[key]) delete next[key];
    });

    return next;
  };

  const handleSaveForm = async () => {
    if (!validateForm()) return;

    const cabangId =
      localStorage.getItem("id_cabang") || sessionStorage.getItem("id_cabang");
    const payload = new FormData();
    payload.append("nama", formState.name);
    payload.append("catatan", formState.note);
    payload.append("ketentuan_divisi", formState.rules);
    if (formMode === "add") {
      const today = getTodayDateString();
      payload.append("tgl", today);
      payload.append("tanggal", today);
    }
    if (cabangId) {
      payload.append("id_cabang", cabangId);
    }

    const existingCategoryByName = new Map(
      categoryOptions.map((item) => [
        normalizeCategoryName(item?.name),
        item?.id ?? item?.id_kategori ?? item?.id_kategori_proyek,
      ])
    );
    const uniqueCategories = [];
    const seenCategoryKey = new Set();

    formState.categories.forEach((item) => {
      const name = String(item?.name || item?.nama || "")
        .trim()
        .replace(/\s+/g, " ");
      const normalizedName = normalizeCategoryName(name);
      let categoryId = item?.id ?? item?.id_kategori ?? item?.id_kategori_proyek ?? "";
      const isCustomCategoryId = String(categoryId).startsWith("custom-");

      if ((!categoryId || isCustomCategoryId) && normalizedName) {
        const resolvedId = existingCategoryByName.get(normalizedName);
        if (resolvedId !== undefined && resolvedId !== null && resolvedId !== "") {
          categoryId = resolvedId;
        }
      }

      const persistedCategoryId = String(categoryId || "").trim();
      const dedupeKey = persistedCategoryId
        ? `id:${persistedCategoryId}`
        : normalizedName
          ? `name:${normalizedName}`
          : "";

      if (!dedupeKey || seenCategoryKey.has(dedupeKey)) return;
      seenCategoryKey.add(dedupeKey);

      uniqueCategories.push({
        id: persistedCategoryId,
        name,
      });
    });

    const finalizedCategories = [];
    for (const item of uniqueCategories) {
      if (item.id) {
        finalizedCategories.push(item);
        continue;
      }

      const normalizedName = normalizeCategoryName(item.name);
      if (!normalizedName) continue;

      let resolvedId = existingCategoryByName.get(normalizedName);
      if (!resolvedId) {
        try {
          const createRes = await createKategoriProyek({ nama: item.name });
          const createdData = createRes?.data?.data || {};
          resolvedId =
            createdData?.id ??
            createdData?.id_kategori ??
            createdData?.id_kategori_proyek ??
            null;
          if (!resolvedId) {
            await fetchCategoryOptions();
            const latestCategoriesRes = await getKategoriProyekList();
            const latestCategories = Array.isArray(latestCategoriesRes?.data?.data)
              ? latestCategoriesRes.data.data
              : [];
            const matchedCategory = latestCategories.find(
              (category) =>
                normalizeCategoryName(category?.nama ?? category?.nama_kategori) ===
                normalizedName
            );
            resolvedId =
              matchedCategory?.id ??
              matchedCategory?.id_kategori ??
              matchedCategory?.id_kategori_proyek ??
              null;
          }
        } catch (error) {
          console.error("Gagal membuat kategori baru saat simpan divisi:", error);
          setFormErrors((prev) => ({
            ...prev,
            categories: getErrorMessage(
              error,
              `Kategori "${item.name}" belum tersedia. Coba simpan lagi.`
            ),
          }));
          return;
        }
      }

      if (!resolvedId) {
        setFormErrors((prev) => ({
          ...prev,
          categories: `Kategori "${item.name}" belum tersedia. Coba simpan lagi.`,
        }));
        return;
      }

      existingCategoryByName.set(normalizedName, resolvedId);
      finalizedCategories.push({ ...item, id: String(resolvedId) });
    }

    finalizedCategories.forEach((item, index) => {
      if (item.id) {
        payload.append(`kategori[${index}][id]`, item.id);
        payload.append(`kategori[${index}][urutan]`, String(index + 1));
      }
    });

    if (formMode === "edit") {
      const selectedCategoryIdSet = new Set(
        uniqueCategories
          .map((item) => String(item?.id || "").trim())
          .filter(Boolean)
      );
      const removedCategoryIds = initialEditCategoryIds.filter(
        (id) => !selectedCategoryIdSet.has(String(id))
      );

      if (removedCategoryIds.length > 0) {
        for (const removedId of removedCategoryIds) {
          await deleteKategoriProyek(removedId);
        }
      }
    }

    if (upload.fileState.file) {
      payload.append("foto_cover", upload.fileState.file);
    }

    try {
      setSubmitting(true);
      setFormErrors({});
      if (formMode === "edit" && formState.id) {
        await updateDivisi(formState.id, payload);
      } else {
        await createDivisi(payload);
      }
      await fetchDivisions();
      setInitialEditCategoryIds([]);
      setIsFormPageOpen(false);
      resetForm();
    } catch (error) {
      setFormErrors(mapApiErrors(error));
      console.error("Gagal simpan divisi:", error?.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDetail = async (division) => {
    setDetailData(division);
    setDetailOpen(true);
    try {
      const detailDivision = await loadDivisionDetail(division.id);
      if (detailDivision) {
        setDetailData(detailDivision);
      }
    } catch (error) {
      console.warn("Gagal memuat detail divisi:", error);
    }
  };

  const handleDeleteClick = (division) => {
    setSelectedDivision(division);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDivision?.id) return;
    try {
      await deleteDivisi(selectedDivision.id);
      await fetchDivisions();
    } catch (error) {
      console.error("Gagal hapus divisi:", error);
      const message = getErrorMessage(error, "Gagal menghapus divisi");
      const divisionUsedByMentor = /divisi.*mentor|mentor.*divisi|dipakai mentor/i.test(
        message
      );

      await Swal.fire({
        icon: divisionUsedByMentor ? "warning" : "error",
        title: divisionUsedByMentor ? "Tidak Bisa Hapus Divisi" : "Gagal",
        text: message,
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedDivision(null);
    }
  };

  const sortedDivisions = useMemo(() => {
    return [...divisions].sort((a, b) => {
      if (sortOption === "a-z" || sortOption === "terbaru-terlama") {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === "z-a" || sortOption === "terlama-terbaru") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [divisions, sortOption]);

  return {
    loading,
    submitting,
    sortOption,
    setSortOption,
    isFormPageOpen,
    formMode,
    formState,
    setFormState,
    formErrors,
    upload,
    detailOpen,
    setDetailOpen,
    detailData,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedDivision,
    openActionId,
    setOpenActionId,
    categoryOptions,
    categoryDraft,
    onCategoryDraftChange: handleCategoryDraftChange,
    onAddCategory: handleAddCategory,
    onDeleteCategory: handleDeleteCategory,
    onRemoveSelectedCategory: handleRemoveSelectedCategory,
    onReorderCategory: handleReorderCategory,
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    categoryActionError,
    categoryActionSuccess,
    creatingCategory,
    deletingCategoryId,
    onOpenAddPage: openAddPage,
    onOpenEditPage: openEditPage,
    onCancelForm: () => {
      setIsFormPageOpen(false);
      setIsCategoryModalOpen(false);
      resetForm();
    },
    onSaveForm: handleSaveForm,
    sortedDivisions,
    onDetail: handleDetail,
    onDeleteClick: handleDeleteClick,
    onConfirmDelete: handleConfirmDelete,
  };
};
