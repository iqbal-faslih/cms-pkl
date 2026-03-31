import React from "react";

export const getDivisionDetailFields = (detailData) => [
  {
    name: "cover",
    type: "custom",
    fullWidth: true,
    render: () => (
      <>
        <h2 className="text-xl mb-3 font-semibold">Foto Cover</h2>
        <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={detailData?.cover || "/assets/img/default.png"}
            className="w-full h-full object-cover"
          />
        </div>
      </>
    ),
  },
  {
    name: "title",
    type: "custom",
    fullWidth: true,
    render: () => (
      <>
        <h2 className="text-xl mb-3 font-semibold">Nama Divisi</h2>
        <div className="w-full px-5 py-4 font-semibold border bg-white border-gray-200 rounded-lg">
          {detailData?.title || detailData?.nama || "-"}
        </div>
      </>
    ),
  },
  {
    name: "note",
    type: "custom",
    fullWidth: true,
    render: () => (
      <>
        <h2 className="text-xl mb-3 font-semibold">Catatan</h2>
        <div className="w-full px-5 py-4 border bg-white border-gray-200 rounded-lg text-gray-700">
          {detailData?.note || detailData?.catatan || "-"}
        </div>
      </>
    ),
  },
  {
    name: "rules",
    type: "custom",
    fullWidth: true,
    render: () => (
      <>
        <h2 className="text-xl mb-3 font-semibold">Ketentuan Divisi</h2>
        <div className="w-full px-5 py-4 border bg-white border-gray-200 rounded-lg text-gray-700 whitespace-pre-wrap">
          {detailData?.rules || detailData?.ketentuan_divisi || "-"}
        </div>
      </>
    ),
  },
  {
    name: "project",
    type: "custom",
    fullWidth: true,
    render: () => (
      <>
        <h2 className="text-xl mb-3 font-semibold">Preview Urutan Kategori Project</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(detailData?.project ||
            detailData?.categories ||
            detailData?.kategori?.map((item) => item?.nama || item) ||
            []
          ).map((category, index) => (
            <div
              key={`${category}-${index}`}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <span className="text-gray-500">{index + 1}.</span>
              <div className="w-full text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </>
    ),
  },
];
