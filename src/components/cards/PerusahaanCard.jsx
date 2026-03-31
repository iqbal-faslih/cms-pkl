import useCabangDetail from "../../hooks/useCabangDetail";

const CompanyCardWithModal = () => {
  const { dataCabang, logoImage, coverImage, loading, error } = useCabangDetail();

  if (loading) {
    return <div className="w-full h-60 bg-gray-200 animate-pulse rounded-lg"></div>;
  }

  if (error || !dataCabang) {
    return <div className="text-center text-sm text-red-500">Gagal memuat data cabang.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={coverImage || "/assets/img/Cover.png"}
        alt="Cover"
        className="w-full h-60 object-cover"
      />

      <div className="w-full px-6 pt-3 pb-4 flex justify-between items-start">
        <div className="flex items-start gap-4">
          <img
            src={logoImage || "/assets/img/logoperusahaan.png"}
            alt="Logo"
            className="w-24 h-24 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-black-800 flex items-center gap-2 mb-2">
              {dataCabang.nama}
              <i className="bi bi-patch-check-fill" style={{ color: "#0069AB" }}></i>
            </h2>
            <p className="text-sm text-black-600">
              Cabang ini bergerak di bidang {dataCabang.bidang_usaha} untuk perkembangan industri.
            </p>
            <div className="text-xs text-black-500 flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1">
                <i className="bi bi-geo-alt"></i> {dataCabang.kota}, {dataCabang.provinsi}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCardWithModal;