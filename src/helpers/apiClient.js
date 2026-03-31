import axios from "axios";

const resolveCurrentRole = () => {
  const fromSession = sessionStorage.getItem("role");
  const fromLocal = localStorage.getItem("role");
  const role = String(fromSession || fromLocal || "").toLowerCase();
  return role;
};

const resolveManageScope = () => {
  return resolveCurrentRole() === "cabang" ? "cabang" : "perusahaan";
};

const scopedManagePath = (resourcePath) => {
  const normalized = String(resourcePath || "").replace(/^\/+/, "");
  return `/${resolveManageScope()}/${normalized}`;
};

// =========================
// HTTP Client
// =========================
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    // Let browser set proper multipart boundary for FormData requests
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }

    if (String(config.method || "").toLowerCase() === "get") {
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers.Pragma = "no-cache";
      config.headers.Expires = "0";
      config.params = config.params || {};
      if (!Object.prototype.hasOwnProperty.call(config.params, "_t")) {
        config.params._t = Date.now();
      }
    }

    const baseUrl =
      config?.baseURL || api.defaults.baseURL || import.meta.env.VITE_API_URL || "";

    if (typeof baseUrl === "string" && baseUrl.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// Auth
// =========================
export const loginUser = (data) => api.post("/login", data);
export const registerUser = (data) => api.post("/register", data);
export const logoutUser = (data = {}, config = {}) =>
  api.post("/logout", data, config);
export const getGoogleLoginUrl = () => api.get("/auth/google/redirect");

// Password & OTP
export const sendOtp = (data) => api.post("/send-otp", data);
export const verifyCode = (data) => api.post("/verify-otp", data);
export const newPassword = (data) => api.post("/new-password", data);
export const applyJob = (formData, config) =>
  api.post("/apply-magang", formData, config);
export const setPassword = (data, customToken) => {
  return api.post("/set-password", data, {
    headers: {
      Authorization: `Bearer ${customToken}`,
    },
  });
};
export const updatePassword = (data) => api.post("/update-password", data);
export const assignUserRole = (id_user, role) =>
  api.post(`/assign/${role}`, JSON.stringify({ id_user, role }));

// =========================
// Perusahaan Profile
// =========================
export const createCompanyData = (formData) => {
  return api.post("/perusahaan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCompanyData = (id, formData) =>
  api.post(`/perusahaan/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCompanyDetail = () => {
  return api.get("/perusahaan/detail");
};
export const getCompanyDirectory = async () => {
  return api.get("/perusahaan/profile");
};

// =========================
// Perusahaan - Cabang
// =========================
export const getCabangList = () => api.get("/perusahaan/manage-cabang");

// =========================
// Perusahaan - Divisi & Kategori
// =========================
export const getDivisiByBranch = (cabangId) =>
  api.get(scopedManagePath(`divisi/${cabangId}`));
export const getDivisiDetail = (id) => api.get(scopedManagePath(`divisi/${id}`));
export const getDivisiList = () => api.get(scopedManagePath("divisi"));
export const createDivisi = (formData) =>
  api.post(scopedManagePath("divisi"), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateDivisi = (id, formData) =>
  api.post(`${scopedManagePath(`divisi/${id}`)}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteDivisi = (id) => api.delete(scopedManagePath(`divisi/${id}`));

export const getKategoriProyekList = () => api.get(scopedManagePath("manage-kategori"));
export const createKategoriProyek = (payload) =>
  api.post(scopedManagePath("manage-kategori"), payload);
export const deleteKategoriProyek = (id) =>
  api.delete(scopedManagePath(`manage-kategori/${id}`));

// =========================
// Perusahaan - Mentor
// =========================
export const getMentorList = () => api.get(scopedManagePath("manage-mentor"));
export const getPerusahaanMentorList = () => api.get(scopedManagePath("manage-mentor"));
export const getMentorDirectList = () => api.get(scopedManagePath("manage-mentor"));
export const getPerusahaanMentorById = (id) =>
  api.get(scopedManagePath(`manage-mentor/${id}`));
export const getMentorById = (id) => api.get(scopedManagePath(`manage-mentor/${id}`));
export const deletePerusahaanMentor = (id) =>
  api.delete(scopedManagePath(`manage-mentor/${id}`));
export const createPerusahaanMentor = async (formData) => {
  try {
    return await api.post(scopedManagePath("manage-mentor"), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    if ([404, 405].includes(error?.response?.status)) {
      return api.post(scopedManagePath("manage-mentor"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    throw error;
  }
};
export const updatePerusahaanMentor = async (id, formData) => {
  try {
    return await api.post(`${scopedManagePath(`manage-mentor/${id}`)}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    if ([404, 405].includes(error?.response?.status)) {
      return api.post(`${scopedManagePath(`manage-mentor/${id}`)}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    throw error;
  }
};

// =========================
// Perusahaan - Lowongan
// =========================
export const getLowonganList = (params) =>
  api.get(scopedManagePath("manage-lowongan"), { params });
export const getLowonganById = (id) =>
  api.get(scopedManagePath(`manage-lowongan/${id}`));
export const createLowongan = (formData) =>
  api.post(scopedManagePath("manage-lowongan"), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateLowongan = (id, formData) =>
  api.post(`${scopedManagePath(`manage-lowongan/${id}`)}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteLowongan = (id) =>
  api.delete(scopedManagePath(`manage-lowongan/${id}`));
export const closeLowongan = async (id) => {
  const endpointAttempts = [
    () => api.put(scopedManagePath(`manage-lowongan/${id}`), { status: 0 }),
    () => api.put(scopedManagePath(`manage-lowongan/${id}/tutup`), {}),
    () => api.put(`/${resolveManageScope()}-lowongan/${id}/tutup`, {}),
  ];

  let lastError = null;

  for (let index = 0; index < endpointAttempts.length; index += 1) {
    try {
      return await endpointAttempts[index]();
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const canFallback = [404, 405].includes(status);
      if (!canFallback || index === endpointAttempts.length - 1) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gagal menutup lowongan");
};

// =========================
// Cabang (Explicit Endpoints)
// =========================
// Kategori
export const getCabangKategoriList = () => api.get("/cabang/manage-kategori");
export const getCabangKategoriById = (id) => api.get(`/cabang/manage-kategori/${id}`);
export const createCabangKategori = (payload) =>
  api.post("/cabang/manage-kategori", payload);
export const updateCabangKategori = (id, payload) =>
  api.put(`/cabang/manage-kategori/${id}`, payload);
export const deleteCabangKategori = (id) =>
  api.delete(`/cabang/manage-kategori/${id}`);

// Divisi
export const getCabangDivisiList = () => api.get("/cabang/divisi");
export const getCabangDivisiById = (id) => api.get(`/cabang/divisi/${id}`);
export const createCabangDivisi = (formData) =>
  api.post("/cabang/divisi", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCabangDivisi = (id, formData) =>
  api.post(`/cabang/divisi/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCabangDivisi = (id) => api.delete(`/cabang/divisi/${id}`);

// Mentor
export const getCabangMentorList = () => api.get("/cabang/manage-mentor");
export const getCabangMentorById = (id) => api.get(`/cabang/manage-mentor/${id}`);
export const createCabangMentor = (formData) =>
  api.post("/cabang/manage-mentor", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCabangMentor = (id, formData) =>
  api.post(`/cabang/manage-mentor/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCabangMentor = (id) => api.delete(`/cabang/manage-mentor/${id}`);
export const tambahSiswaCabangMentor = (payload) =>
  api.post("/cabang/manage-mentor/tambah-siswa", payload);
export const pindahDivisiSiswaCabangMentor = (id, payload) =>
  api.put(`/cabang/manage-mentor/pindah-divisi-siswa/${id}`, payload);

// Lowongan
export const getCabangLowonganList = (params) =>
  api.get("/cabang/manage-lowongan", { params });
export const getCabangLowonganById = (id) =>
  api.get(`/cabang/manage-lowongan/${id}`);
export const createCabangLowongan = (formData) =>
  api.post("/cabang/manage-lowongan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCabangLowongan = (id, formData) =>
  api.post(`/cabang/manage-lowongan/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Approval
export const getCabangApprovalDaftar = () => api.get("/cabang/approval/daftar");
export const getCabangApprovalIzin = () => api.get("/cabang/approval/izin");
export const getCabangApprovalDetail = (id) =>
  api.get(`/cabang/approval/daftar-detail/${id}`);
export const approveCabangIzin = (payload) =>
  api.put("/cabang/approval/approve-izin", payload);
export const approveCabangManyMagang = (payload) =>
  api.put("/cabang/approval/approve-many-magang", payload);
export const approveCabangMagang = (id, payload) =>
  api.put(`/cabang/approval/approve-magang/${id}`, payload);

// =========================
// Siswa - Magang, Absensi, Jurnal, Presentasi
// =========================
export const ajukanIzin = (formData) => {
  return api.post("/izin", formData);
};
export const createJurnal = (formData) => {
  return api.post("/jurnal", formData);
};
export const updateJurnal = (id, formData) => {
  return api.post(`/jurnal/${id}?_method=PUT`, formData);
};
export const postAbsensi = async () => {
  return api.post("/kehadiran");
};

export const applyPresentation = (id) =>
  api.post("/riwayat-presentasi", { id_jadwal_presentasi: id });
export const registrasiPeserta = (formData, config) =>
  api.post("/lengkapi-data-peserta", formData, config);
export const getDashboardSiswa = () => api.get("/peserta/rekap");
export const getJurnalSiswa = () => api.get("/jurnal");
export const getPresentasiSiswa = () => api.get("/presentasi");
export const getRiwayatPresentasi = () => api.get("/riwayat-presentasi");
export const getJadwalPiket = () => api.get("/piket-peserta");
export const getAbsensiPdf = async () => {
  return api.get("/kehadiran/export-pdf", {
    responseType: "blob",
  });
};
export const getAbsensiByDate = (params) => api.get("/kehadiran", { params });
export const getRouteProject = () => api.get("/route-project");
export const getDetailProject = (projectId) =>
  api.get(`/detail-project/${projectId}`);
export const getRiwayatLowongan = () => api.get("/complete/lowongan");
export const getStatusMagang = () => api.get("/complete/magang");

// Siswa - edit data diri/foto
export const editFotoSiswa = async (id, formData) => {
  const pickedPhoto =
    formData?.get?.("profile") || formData?.get?.("foto") || formData?.get?.("avatar") || null;

  const buildPhotoPayload = ({ includeMethodOverride = true } = {}) => {
    const payload = new FormData();
    if (pickedPhoto) {
      payload.append("profile", pickedPhoto);
      payload.append("foto", pickedPhoto);
      payload.append("avatar", pickedPhoto);
    }
    if (includeMethodOverride) {
      payload.append("_method", "PUT");
    }
    return payload;
  };

  const endpointAttempts = [
    () => api.post("/update-data-peserta", buildPhotoPayload({ includeMethodOverride: true })),
    () => api.post("/update-data-peserta?_method=PUT", buildPhotoPayload({ includeMethodOverride: false })),
    () => api.put("/update-data-peserta", buildPhotoPayload({ includeMethodOverride: false })),
    // Legacy fallback for environments that still use endpoint lama.
    () => api.post(`/peserta/foto/${id}`, buildPhotoPayload({ includeMethodOverride: true }), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  ];

  let lastError = null;

  for (let index = 0; index < endpointAttempts.length; index += 1) {
    const callEndpoint = endpointAttempts[index];
    try {
      return await callEndpoint();
    } catch (error) {
      lastError = error;
      const canFallback = shouldTryNextPesertaUpdateEndpoint(error);
      if (!canFallback || index === endpointAttempts.length - 1) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gagal memperbarui foto siswa");
};

const shouldTryNextPesertaUpdateEndpoint = (error) => {
  const status = error?.response?.status;
  if ([404, 405, 415].includes(status)) return true;
  if (status !== 422) return false;

  const serverErrors = error?.response?.data?.errors || {};
  const fieldNames = Object.keys(serverErrors).map((key) => String(key).toLowerCase());

  return fieldNames.some((field) =>
    ["profile", "foto", "avatar", "image", "cv", "dokumen", "surat_pernyataan"].includes(field)
  );
};

const normalizeDateForApi = (value) => {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const slashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, "0");
    const month = slashMatch[2].padStart(2, "0");
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return raw;
};

export const editDataDiriSiswa = async (_id, data) => {

  const normalizedGender = String(data?.jenis_kelamin ?? "")
    .trim()
    .toLowerCase();

  const jenisKelaminCode =
    normalizedGender === "laki-laki" || normalizedGender === "l" || normalizedGender === "male"
      ? "L"
      : normalizedGender === "perempuan" || normalizedGender === "p" || normalizedGender === "female"
        ? "P"
        : data?.jenis_kelamin ?? "";

  const payloadWithoutMethodOverride = {
    ...data,
    jenis_kelamin: jenisKelaminCode,
    gender: jenisKelaminCode,
    tanggal_lahir: normalizeDateForApi(data?.tanggal_lahir),
    // Some backends only accept `nisn` while others use `nomor_identitas`.
    nisn: data?.nomor_identitas ?? data?.nisn ?? "",
    nim: data?.nomor_identitas ?? data?.nim ?? "",
    nomor_identitas: data?.nomor_identitas ?? data?.nisn ?? data?.nim ?? "",
  };

  const payloadWithMethodOverride = {
    ...payloadWithoutMethodOverride,
    _method: "PUT",
  };

  const toFormData = (sourcePayload) => {
    const formData = new FormData();
    Object.entries(sourcePayload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      formData.append(key, value);
    });
    return formData;
  };

  const endpointAttempts = [
    () => api.put("/update-data-peserta", payloadWithoutMethodOverride),
    () => api.put("/update-data-peserta", toFormData(payloadWithoutMethodOverride)),
    () => api.post("/update-data-peserta", toFormData(payloadWithMethodOverride)),
    () => api.post("/update-data-peserta?_method=PUT", toFormData(payloadWithoutMethodOverride)),
    // Legacy fallback for environments where update route is not deployed yet.
    () => api.post("/lengkapi-data-peserta", toFormData(payloadWithMethodOverride)),
  ];

  let lastError = null;

  for (let index = 0; index < endpointAttempts.length; index += 1) {
    const callEndpoint = endpointAttempts[index];
    try {
      return await callEndpoint();
    } catch (error) {
      lastError = error;
      const canFallback = shouldTryNextPesertaUpdateEndpoint(error);
      if (!canFallback || index === endpointAttempts.length - 1) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gagal memperbarui data diri siswa");
};

export const updatePost = (id, payload) =>
  api.post(`/posts/${id}?_method=PUT`, payload);

// =========================
// Posts
// =========================
export const createPost = (payload) => api.post("/posts", payload);
export const getPosts = () => api.get("/posts");
export const getPostDetail = (id) => api.get(`/posts/${id}`);
export const getPostById = (id) => api.get(`/posts/${id}`);
export const getPostsByCategory = (category) =>
  api.get(`/posts?category=${category}`);
export const getPostsByTag = (tag) => api.get(`/posts?tags=${tag}`);
export const deletePost = (id) => api.delete(`/posts/${id}`);

// Media upload
export const uploadImage = (formData) => {
  return api.post("/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// Other Resources
// =========================
export const getAllJobs = () => api.get("/lowongan-all");
export const getJobDetails = (jobId) => api.get(`/lowongan/${jobId}/detail`);
export const getPesertaDetail = (config) => api.get("/peserta/detail", config);
export const getNotifications = () => api.get("/notifikasi");
export const markNotificationAsRead = (id) => api.patch(`/notifikasi/${id}/read`);
export const markAllNotificationsAsRead = () => api.patch("/notifikasi/all");

// =========================
// External Region Endpoints
// =========================
export const fetchProvinces = () =>
  axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");

export const fetchRegencies = (provinceId) =>
  axios.get(
    `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
  );

export const fetchDistricts = (regencyId) =>
  axios.get(
    `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
  );
