import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  createLowongan,
  updateLowongan,
  getDivisiList,
  getCabangDivisiList,
  createCabangLowongan,
  updateCabangLowongan,
} from "../../helpers/apiClient";
import {
  flattenValidationMessages,
  resolveLowonganError,
} from "./helpers/lowonganErrorMessage";

const STATUS_MAGANG_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

const AddJobModal = ({
  showModal,
  setShowModal,
  editingData = null,
  onSuccess,
  onSucces,
}) => {
  const role =
    String(localStorage.getItem("role") || sessionStorage.getItem("role") || "").toLowerCase();
  const isCabangRole = role === "cabang";
  const [divisi, setDivisi] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDivisi, setLoadingDivisi] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Track jika data sudah dimuat

  const [formData, setFormData] = useState({
    nama: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    id_cabang: "",
    id_divisi: "",
    status_magang: "online",
    max_kuota: "",
    requirement: "",
    jobdesc: "",
  });

  const getTodayDateInput = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const getNextDateInput = (dateString) => {
    if (!dateString) return "";
    const base = new Date(dateString);
    if (Number.isNaN(base.getTime())) return "";
    base.setDate(base.getDate() + 1);
    return base.toISOString().split("T")[0];
  };

  const resolveId = (item) => {
    if (!item) return "";
    return (
      item.id ??
      item.id_divisi ??
      item.id_cabang ??
      item.cabang_id ??
      item.divisi_id ??
      item.value ??
      ""
    );
  };

  const resolveName = (item) => {
    if (!item) return "-";
    return item.nama || item.nama_divisi || item.name || "-";
  };
  const resolveDivisionBranchId = (divisionItem) => {
    if (!divisionItem) return "";
    return (
      divisionItem.id_cabang ??
      divisionItem.cabang_id ??
      divisionItem.cabang?.id ??
      divisionItem.branch?.id ??
      ""
    );
  };

  const handleSuccess = (...args) => {
    const callback = onSuccess || onSucces;
    if (typeof callback === "function") {
      callback(...args);
    }
  };

  const loadDivisiOptions = useCallback(async () => {
    setLoadingDivisi(true);
    try {
      const response = isCabangRole
        ? await getCabangDivisiList()
        : await getDivisiList();
      const data = response?.data?.data || response?.data || [];

      console.log("Loaded divisi:", data);
      setDivisi(data || []);
      return data || [];
    } catch (error) {
      console.error("Error loading divisi:", error);
      setDivisi([]);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: "Tidak dapat memuat data divisi. Silakan coba lagi nanti.",
        confirmButtonColor: "#3085d6",
      });
      return [];
    } finally {
      setLoadingDivisi(false);
    }
  }, [isCabangRole]);

  // Effect terpisah untuk handle editing data
  useEffect(() => {
    const loadEditingData = async () => {
      console.log("EditingData received:", editingData);

      // Reset state terlebih dahulu
      setIsDataLoaded(false);
      setErrors({});
      setTouched({});

      if (editingData) {
        // Handle jika editingData adalah array atau object
        const dataToEdit = Array.isArray(editingData)
          ? editingData[0]
          : editingData;
        console.log("Processed editing data:", dataToEdit);

        if (!dataToEdit) {
          setIsDataLoaded(true);
          return;
        }

        const {
          nama,
          tanggal_mulai,
          tanggal_selesai,
          id_cabang,
          id_divisi,
          status_magang,
          max_kuota,
          requirement,
          jobdesc,
          cabang,
          divisi,
        } = dataToEdit;

        // Format tanggal
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          } catch (error) {
            console.error("Date formatting error:", error);
            return "";
          }
        };

        // Ambil ID dari nested object jika ada, atau dari field langsung
        const cabangId = resolveId(cabang) || resolveId({ id: id_cabang });
        const divisiId = resolveId(divisi) || resolveId({ id: id_divisi });

        // Set form data
        const newFormData = {
          nama: nama || "",
          tanggal_mulai: formatDateForInput(tanggal_mulai),
          tanggal_selesai: formatDateForInput(tanggal_selesai),
          id_cabang: cabangId || "",
          id_divisi: divisiId || "",
          status_magang: status_magang || "online",
          max_kuota: max_kuota ? parseInt(max_kuota) : "",
          requirement: requirement || "",
          jobdesc: jobdesc || "",
        };

        console.log("Setting form data:", newFormData);
        setFormData(newFormData);

        await loadDivisiOptions();

        setIsDataLoaded(true);
      } else {
        const activeCabangId =
          localStorage.getItem("id_cabang") || sessionStorage.getItem("id_cabang") || "";
        // Reset form untuk mode tambah
        setFormData({
          nama: "",
          tanggal_mulai: "",
          tanggal_selesai: "",
          id_cabang: isCabangRole ? String(activeCabangId) : "",
          id_divisi: "",
          status_magang: "online",
          max_kuota: "",
          requirement: "",
          jobdesc: "",
        });
        await loadDivisiOptions();
        setIsDataLoaded(true);
      }
    };

    // Hanya jalankan jika modal terbuka
    if (showModal) {
      loadEditingData();
    }
  }, [editingData, showModal, isCabangRole, loadDivisiOptions]);

  const handleClose = () => {
    const isFormModified = Object.values(formData).some((val) => val !== "");

    if (isFormModified) {
      Swal.fire({
        title: "Konfirmasi",
        text: "Perubahan yang Anda buat belum disimpan. Yakin ingin menutup?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, tutup",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          setShowModal(false);
          // Reset state saat modal ditutup
          setIsDataLoaded(false);
          setDivisi([]);
        }
      });
    } else {
      setShowModal(false);
      setIsDataLoaded(false);
      setDivisi([]);
    }
  };

  const handleValue = (e) => {
    const { name, value } = e.target;

    if (name === "id_divisi") {
      const divisiId = value || "";
      if (!isCabangRole) {
        const selectedDivision = divisi.find(
          (item) => String(resolveId(item)) === String(divisiId)
        );
        const inferredCabangId = resolveDivisionBranchId(selectedDivision);
        setFormData((prev) => ({
          ...prev,
          [name]: divisiId,
          id_cabang: inferredCabangId ? String(inferredCabangId) : prev.id_cabang,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: divisiId }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "max_kuota" && (isNaN(value) || parseInt(value) <= 0)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Kuota harus berupa angka positif",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "nama") {
      setErrors((prev) => ({ ...prev, form: "" }));
    }
  };

  useEffect(() => {
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      if (end <= start) {
        setErrors((prev) => ({
          ...prev,
          tanggal_selesai:
            "Tanggal selesai harus setelah tanggal mulai (tidak boleh sama)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, tanggal_selesai: "" }));
      }
    }
  }, [formData.tanggal_mulai, formData.tanggal_selesai]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { name: "nama", label: "Nama lowongan" },
      { name: "tanggal_mulai", label: "Tanggal mulai" },
      { name: "tanggal_selesai", label: "Tanggal selesai" },
      { name: "id_divisi", label: "Divisi" },
      { name: "status_magang", label: "Status magang" },
      { name: "max_kuota", label: "Jumlah kuota" },
      { name: "requirement", label: "Requirement" },
      { name: "jobdesc", label: "Deskripsi pekerjaan" },
    ];
    if (isCabangRole) {
      requiredFields.push({ name: "id_cabang", label: "Cabang" });
    }

    requiredFields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} wajib diisi`;
      }
    });

    const today = getTodayDateInput();
    if (formData.tanggal_mulai && formData.tanggal_mulai < today) {
      newErrors.tanggal_mulai = "Tanggal mulai tidak boleh sebelum hari ini";
    }

    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      const start = new Date(formData.tanggal_mulai);
      const end = new Date(formData.tanggal_selesai);
      if (end <= start) {
        newErrors.tanggal_selesai =
          "Tanggal selesai harus setelah tanggal mulai (tidak boleh sama)";
      }
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values({ ...errors, ...newErrors }).every((err) => !err);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (!formData[name]) {
      setErrors((prev) => ({ ...prev, [name]: `Field ini wajib diisi` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const touchedAll = {};
    Object.keys(formData).forEach((k) => {
      touchedAll[k] = true;
    });
    setTouched(touchedAll);

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validasi Gagal",
        text: "Silakan periksa kembali form isian Anda",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: editingData ? "Memperbarui Data" : "Menyimpan Data",
      text: "Mohon tunggu...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let editId = null;
      if (editingData) {
        if (Array.isArray(editingData)) {
          editId = editingData[0]?.id || null;
        } else {
          editId = editingData.id || null;
        }
      }

      const parsedDivisiId = Number(formData.id_divisi);
      const payload = {
        nama: formData.nama?.trim(),
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        id_divisi: Number.isNaN(parsedDivisiId)
          ? formData.id_divisi
          : parsedDivisiId,
        max_kuota: parseInt(formData.max_kuota),
        status_magang: formData.status_magang || "online",
        requirement: formData.requirement,
        jobdesc: formData.jobdesc,
      };
      if (formData.id_cabang) {
        const parsedCabangId = Number(formData.id_cabang);
        payload.id_cabang = Number.isNaN(parsedCabangId)
          ? formData.id_cabang
          : parsedCabangId;
      }

      // Convert to FormData for multipart/form-data
      const formDataPayload = new FormData();
      Object.keys(payload).forEach((key) => {
        formDataPayload.append(key, payload[key]);
      });

      console.log("Submitting:", {
        method: editId ? "PUT" : "POST",
        payload,
        editId,
        editingData,
      });

      let response;
      const submitPerusahaan = async (withCabang = false) => {
        const perusahaanPayload = new FormData();
        Object.keys(payload).forEach((key) => {
          if (key === "id_cabang" && !withCabang) return;
          perusahaanPayload.append(key, payload[key]);
        });
        if (editId) return updateLowongan(editId, perusahaanPayload);
        return createLowongan(perusahaanPayload);
      };

      if (isCabangRole) {
        response = editId
          ? await updateCabangLowongan(editId, formDataPayload)
          : await createCabangLowongan(formDataPayload);
      } else {
        try {
          response = await submitPerusahaan(false);
        } catch (firstError) {
          const selectedDivision = divisi.find(
            (item) => String(resolveId(item)) === String(formData.id_divisi)
          );
          const inferredCabangId = resolveDivisionBranchId(selectedDivision);
          const shouldRetryWithCabang =
            firstError?.response?.status === 422 &&
            Boolean(inferredCabangId) &&
            !payload.id_cabang;

          if (!shouldRetryWithCabang) throw firstError;

          payload.id_cabang = Number.isNaN(Number(inferredCabangId))
            ? String(inferredCabangId)
            : Number(inferredCabangId);
          response = await submitPerusahaan(true);
        }
      }

      console.log("Response:", response.data);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: editingData
          ? "Data lowongan berhasil diperbarui"
          : "Lowongan baru berhasil ditambahkan",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        nama: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        id_cabang: "",
        id_divisi: "",
        status_magang: "online",
        max_kuota: "",
        requirement: "",
        jobdesc: "",
      });
      setShowModal(false);
      setIsDataLoaded(false);
      handleSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      console.error("Error response:", err.response);
      console.error("Validation payload:", err?.response?.data);
      console.error(
        "Validation details:",
        flattenValidationMessages(err?.response?.data)
      );

      Swal.close();
      const resolvedError = resolveLowonganError(err?.response?.data);
      const firstMessage = resolvedError.message;

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: firstMessage,
        confirmButtonColor: "#3085d6",
      });

      setErrors((prev) => ({
        ...prev,
        nama: resolvedError.field === "nama" ? firstMessage : prev.nama,
        form: firstMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Jangan render form jika data belum dimuat dan dalam mode edit
  if (editingData && !isDataLoaded) {
    return (
      <div
        className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4">
          <div className="flex justify-center items-center py-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex justify-center items-center z-[999] ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-white rounded-lg shadow-xl p-5 w-96 md:w-112 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">
            {editingData ? "Edit Lowongan" : "Tambah Lowongan"}
          </h2>
          <button onClick={handleClose} className="text-gray-500 text-xl">
            ⨯
          </button>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md mb-3 text-xs">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nama Lowongan *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.nama && touched.nama ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              placeholder="Contoh: Frontend Intern"
            />
            {errors.nama && touched.nama && (
              <p className="text-red-500 text-xs">{errors.nama}</p>
            )}
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Mulai *
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleValue}
                onBlur={handleBlur}
                min={getTodayDateInput()}
                className={`w-full border ${errors.tanggal_mulai && touched.tanggal_mulai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_mulai && touched.tanggal_mulai && (
                <p className="text-red-500 text-xs">{errors.tanggal_mulai}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tanggal Selesai *
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleValue}
                onBlur={handleBlur}
                min={getNextDateInput(formData.tanggal_mulai) || getTodayDateInput()}
                className={`w-full border ${errors.tanggal_selesai && touched.tanggal_selesai ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              />
              {errors.tanggal_selesai && touched.tanggal_selesai && (
                <p className="text-red-500 text-xs">{errors.tanggal_selesai}</p>
              )}
            </div>
          </div>

          {/* Divisi */}
          <div className="mb-3">
            {isCabangRole ? (
              <input type="hidden" name="id_cabang" value={formData.id_cabang || ""} />
            ) : null}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Divisi *
              </label>
              <select
                name="id_divisi"
                value={formData.id_divisi}
                onChange={handleValue}
                onBlur={handleBlur}
                disabled={loadingDivisi}
                className={`w-full border ${errors.id_divisi && touched.id_divisi ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white ${
                  loadingDivisi
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="">
                  {loadingDivisi
                    ? "Memuat divisi..."
                    : "Pilih Divisi"}
                </option>
                {divisi.map((d) => {
                  const divisiId = resolveId(d);
                  if (!divisiId) return null;
                  return (
                  <option key={divisiId} value={divisiId}>
                    {resolveName(d)}
                  </option>
                  );
                })}
              </select>
              {errors.id_divisi && touched.id_divisi && (
                <p className="text-red-500 text-xs">{errors.id_divisi}</p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status Magang *
            </label>
            <select
              name="status_magang"
              value={formData.status_magang}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.status_magang && touched.status_magang ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs bg-white`}
            >
              <option value="">Pilih status magang</option>
              {STATUS_MAGANG_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status_magang && touched.status_magang && (
              <p className="text-red-500 text-xs">{errors.status_magang}</p>
            )}
          </div>

          {/* Kuota */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Jumlah Kuota *
            </label>
            <input
              type="number"
              name="max_kuota"
              value={formData.max_kuota}
              onChange={handleValue}
              onBlur={handleBlur}
              min="1"
              className={`w-full border ${errors.max_kuota && touched.max_kuota ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              placeholder="Masukkan jumlah kuota"
            />
            {errors.max_kuota && touched.max_kuota && (
              <p className="text-red-500 text-xs">{errors.max_kuota}</p>
            )}
          </div>

          {/* Requirement */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Requirement *
            </label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.requirement && touched.requirement ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan persyaratan"
            />
            {errors.requirement && touched.requirement && (
              <p className="text-red-500 text-xs">{errors.requirement}</p>
            )}
          </div>

          {/* Jobdesc */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Deskripsi Pekerjaan *
            </label>
            <textarea
              name="jobdesc"
              value={formData.jobdesc}
              onChange={handleValue}
              onBlur={handleBlur}
              className={`w-full border ${errors.jobdesc && touched.jobdesc ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 text-xs`}
              rows="3"
              placeholder="Masukkan deskripsi pekerjaan"
            />
            {errors.jobdesc && touched.jobdesc && (
              <p className="text-red-500 text-xs">{errors.jobdesc}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-red-500 text-white px-5 py-3 rounded-md text-xs"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-md text-xs"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
