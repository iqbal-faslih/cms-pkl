export const DOCUMENT_API_FIELD_MAP = {
  legalitas: "legalitas_perusahaan",
  npwp: "npwp_perusahaan",
  profil_bg: "profil_background",
};

export const PROFILE_UPDATE_URL = "/perusahaan/profile/update";

export const DOCUMENT_FIELD_NAMES = new Set([
  "legalitas",
  "npwp",
  "profil_bg",
  "legalitas_perusahaan",
  "npwp_perusahaan",
  "profil_background",
]);

export const resolveDocumentApiField = (docName) =>
  DOCUMENT_API_FIELD_MAP[docName] || docName;

export const resolveFileUrl = (value) => {
  if (!value) return "";
  if (value instanceof File) return URL.createObjectURL(value);

  if (typeof value === "object") {
    if (typeof value?.url === "string") return value.url;
    if (typeof value?.path === "string") return value.path;
    return "";
  }

  if (typeof value !== "string") return "";
  if (value.startsWith("blob:") || value.startsWith("data:")) return value;
  if (value.startsWith("http")) return value;
  return `${import.meta.env.VITE_FILE_URL}/${value.replace(/^\/+/, "")}`;
};

export const isImageFileLike = (fileUrl, imageSrc, resolvedFileUrl = "") => {
  const rawType =
    (fileUrl && typeof fileUrl === "object" ? fileUrl?.type : "") ||
    (imageSrc && typeof imageSrc === "object" ? imageSrc?.type : "") ||
    "";

  const isImageByType =
    typeof rawType === "string" && rawType.startsWith("image/");
  const isImageByUrl =
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(resolvedFileUrl || "");
  const isBlobImage =
    (resolvedFileUrl || "").startsWith("blob:") &&
    !/\.pdf$/i.test(resolvedFileUrl || "");

  return isImageByType || isImageByUrl || isBlobImage;
};
