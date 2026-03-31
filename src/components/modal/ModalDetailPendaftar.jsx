import React from "react";
import Button from "@/shared/components/button/Button";
import { Icon } from "@iconify/react";
import FormField from "@/shared/components/input/FormFields";
import ErrorOverlay from "@/shared/components/cards/ErrorOverlay";
import { useDetailPendaftar } from "./hooks/useDetailPendaftar";
import {
  formatDisplayDate,
  formatShortDate,
} from "./helpers/detailPendaftarHelper";

const ModalDetailPendaftar = ({ isOpen, onClose, data }) => {
  const {
    loading,
    error,
    refetch,
    showError,
    setShowError,
    detail,
    berkas,
    resolvedLowongan,
  } = useDetailPendaftar({ isOpen, data });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl relative overflow-hidden">
        <div className="p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Detail Dokumen
          </h2>

          <div className="flex flex-col md:flex-row gap-12">
            {loading ? (
              <ProfileSkeleton />
            ) : (
              <div className="flex flex-col items-center text-center w-full md:w-1/4">
                <div className="w-45 h-45 rounded-full overflow-hidden bg-gray-100 shadow mt-8">
                  {detail?.profil ? (
                    <img
                      src={detail.profil}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold">
                      {detail?.initials || "NA"}
                    </div>
                  )}
                </div>

                <p className="mt-4 text-lg text-black font-bold">
                  {detail?.email || "-"}
                </p>
                <StatusBadge status={detail?.status} />
              </div>
            )}

            <div className="flex flex-col gap-10 w-full md:w-3/4">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 11 }).map((_, index) => (
                    <FormFieldSkeleton key={`field-skeleton-${index}`} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Nama" value={detail?.nama} />
                  <FormField label="Alamat" value={detail?.alamat} />

                  <FormField label="Jenis Kelamin" value={detail?.jenis_kelamin} />
                  <FormField label="No. HP" value={detail?.telepon} />

                  <FormField label="Tempat Lahir" value={detail?.tempat_lahir} />
                  <FormField
                    label="Tanggal Lahir"
                    value={formatDisplayDate(detail?.tanggal_lahir)}
                  />

                  <FormField
                    label="Sekolah / Universitas"
                    value={detail?.sekolah}
                  />
                  <FormField label="Jurusan" value={detail?.jurusan} />

                  <FormField label="NISN/NIM" value={detail?.nisn} />
                  <FormField
                    label="Masa Magang"
                    value={`${formatShortDate(detail?.mulai)} - ${formatShortDate(detail?.selesai)}`}
                  />
                  <FormField label="Lowongan" value={resolvedLowongan} />
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Berkas Pendaftaran
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loading ? (
                    <>
                      <FileSkeleton />
                      <FileSkeleton />
                    </>
                  ) : berkas.length === 0 ? (
                    <div className="md:col-span-2 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
                      Berkas pendaftaran belum tersedia.
                    </div>
                  ) : (
                    berkas.map((file, i) => (
                      <FileCard key={i} file={file} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-10">
            <Button
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-gray-600 hover:bg-gray-200"
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>

      <ErrorOverlay
        open={showError}
        message={error?.message || "Gagal mengambil detail pendaftaran"}
        onRetry={() => {
          setShowError(false);
          refetch();
        }}
        onClose={() => setShowError(false)}
      />
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = String(status || "").toLowerCase();

  const colors = {
    pending: "w-35 bg-[#fff5ed] text-[#ff9e42]",
    approve: "w-35 bg-[#e8f6f2] text-[#15a179]",
    reject: "w-35 bg-[#fde6e6] text-[#fe4848]",
  };

  return (
    <div
      className={`mt-3 px-4 py-1.5 rounded-md text-xs font-semibold ${
        colors[normalized] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "-"}
    </div>
  );
};

const isImageFile = (url = "") => /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|#|$)/i.test(url);
const isPdfFile = (url = "") => /\.pdf(\?|#|$)/i.test(url);

const FileCard = ({ file }) => {
  const title = file?.title || file?.name || "Berkas";
  const fileUrl = file?.url || "";
  const fileKind = isPdfFile(fileUrl) ? "PDF" : isImageFile(fileUrl) ? "Gambar" : "Dokumen";

  const openFile = () => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="border border-gray-300 rounded-xl shadow-sm bg-white overflow-hidden h-60">
        {isImageFile(fileUrl) ? (
          <img
            src={fileUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : isPdfFile(fileUrl) ? (
          <iframe src={fileUrl} title={title} className="w-full h-full border-0" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-600">
            <Icon icon="mdi:file-document-outline" className="w-14 h-14 mb-2" />
            <span className="text-sm font-medium">Preview tidak tersedia</span>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500">{fileKind}</p>
        </div>
        <Button
          className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
          onClick={openFile}
          disabled={!fileUrl}
          aria-label={`Buka ${title}`}
        >
          <Icon icon="ic:round-open-in-new" className="w-4 h-4" />
          <span className="text-sm font-semibold">Preview Full</span>
        </Button>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="flex flex-col items-center text-center w-full md:w-1/4 animate-pulse">
    <div className="w-45 h-45 rounded-full bg-gray-200 mt-8" />
    <div className="h-6 w-44 bg-gray-200 rounded mt-4" />
    <div className="h-8 w-32 bg-gray-200 rounded mt-3" />
  </div>
);

const FileSkeleton = () => (
  <div className="flex flex-col w-full animate-pulse">
    <div className="border border-gray-300 rounded-xl bg-gray-100 h-60" />
    <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1">
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-9 w-30 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const FormFieldSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
    <div className="h-12 w-full bg-gray-100 border border-gray-200 rounded-xl" />
  </div>
);

export default ModalDetailPendaftar;
