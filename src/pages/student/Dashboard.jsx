import { useContext } from "react";
import AlertVerification from "../../components/AlertVerification";
import ChartStats from "../../components/charts/ChartStats";
import Card from "../../components/cards/Card";
import StaticJurnal from "../../components/charts/StaticJurnal";
import RiwayatProject from "../../components/cards/RiwayatProject";
import ProjectBerjalan from "../../components/cards/ProjectBerjalan";
import { StatusContext } from "./StatusContext";
import PrimaryButton from "../../components/button/PrimaryButton";
import useDashboard from "../../hooks/siswa/dashboard/useDashboard";
import DashboardSkeleton from "../../components/skeletons/siswa/dashboard/DashboardSkeleton";

const Dashboard = () => {
  const {
    profileComplete,
    internshipStatus,
    userLoading,
    applyingStatus,
    refreshUserData,
  } = useContext(StatusContext);
  const { data, loading: dashboardLoading, error, refetch } = useDashboard();
  console.log("applying status:", applyingStatus);

  if (userLoading) {
    return (
      <div className="h-full">
        <div className="w-full h-14 bg-slate-300 border border-slate-200 rounded-2xl flex justify-between py-1 px-3 items-center mb-4 animate-pulse">
          <div className="bg-slate-400 w-2/3 h-5 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center h-full relative">
        <AlertVerification
          message={"Akses tidak diizinkan. Lengkapi data diri anda!"}
        />
        <img
          src="/assets/img/registrasi.png"
          alt="Forms.svg"
          className="size-96"
        />

        <PrimaryButton
          to={"/peserta/registrasi"}
          icon="bi-arrow-right"
          rounded="rounded-full"
        >
          <span>Isi Data Diri</span>
        </PrimaryButton>
      </div>
    );
  }

  if (!internshipStatus && !applyingStatus) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center h-full relative pt-20">
        <AlertVerification
          message={
            "Akses tidak diizinkan. Anda belum melamar. Cari dan lamar lowongan sekarang."
          }
          reloadButton={true}
          onReload={refreshUserData}
        />
        <img
          src="/assets/svg/Company-amico.svg"
          alt="Company-amico.svg"
          className="size-96 mb-10"
        />

        <PrimaryButton
          to={"/lowongan"}
          icon="bi-arrow-right"
          rounded="rounded-full"
        >
          <span>Cari Lowongan</span>
        </PrimaryButton>
      </div>
    );
  }

  if (applyingStatus && !internshipStatus) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center h-full relative">
        <AlertVerification
          message={
            "Akses tidak diizinkan. Permohonan Anda sedang dalam proses verifikasi."
          }
          reloadButton={true}
          onReload={refreshUserData}
        />
        <img
          src="/assets/img/isPending.png"
          alt="Company-amico.svg"
          className="w-[700px]"
        />
      </div>
    );
  }

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="h-full bg-white flex items-center justify-center rounded-lg">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="text-red-500 mb-4">
            <i
              className="bi bi-exclamation-triangle"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
          <div className="text-red-500 text-center">
            <p className="font-semibold mb-2">Terjadi Kesalahan</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-[#0069AB] text-white rounded-lg hover:bg-[#0069AB]/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const sistemMagangLabel = data?.magang?.sistemMagang || "-";
  const sistemMagangType = String(sistemMagangLabel).toLowerCase();
  const sistemMagangBadgeClass =
    sistemMagangType === "online"
      ? "text-[#0F9D58] bg-[#E9F9EF]"
      : sistemMagangType === "offline"
        ? "text-[#C2410C] bg-[#FFF2E8]"
        : "text-[#64748B] bg-[#F1F5F9]";

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden transition-all duration-300 h-full w-full">
      <div className="grid grid-cols-20 gap-3">
        <Card className="col-span-15">
          <div className="grid grid-cols-4 gap-2 w-full">
            {data.statsData.map((item, index) => (
              <ChartStats
                icon={item.icon}
                value={item.value}
                color={item.color}
                title={item.title}
                key={index + 1}
                seriesData={item.data}
                bgColor={item.bgColor}
              />
            ))}
          </div>
        </Card>
        <Card className="col-span-5">
          <div className="flex flex-col gap-2 h-full">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex w-fit rounded-full bg-[#E8F1FF] text-[#306BFF] text-[11px] font-semibold px-2.5 py-1 leading-none">
                MAGANG BERLANGSUNG
              </span>
              <span
                className={`inline-flex w-fit rounded-full text-[10px] font-semibold px-2.5 py-1 leading-none ${sistemMagangBadgeClass}`}
              >
                {sistemMagangLabel === "-" ? "Sistem -" : `Sistem ${sistemMagangLabel}`}
              </span>
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-20 rounded-full border-2 border-dashed border-[#4FA3FF] p-1 shrink-0">
                <img
                  src={data.magang.logo || "/assets/img/Cover.png"}
                  alt={`Logo ${data.magang.perusahaan || "Perusahaan"}`}
                  className="size-full object-cover rounded-full bg-slate-200 aspect-square"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-black font-semibold uppercase text-sm line-clamp-2 leading-5">
                  {data.magang.perusahaan || "-"}
                </h3>
                <span className="font-semibold text-[11px] line-clamp-1 inline-flex max-w-full text-[#FF9F43] bg-[#FFE9DA] px-2 py-1 rounded-full">
                  {data.magang.divisi || "-"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-12 gap-3 h-full">
        <Card className="col-span-4">
          <StaticJurnal data={data.jurnal} />
        </Card>
        <div className="flex flex-col gap-3 col-span-8 h-full">
          <Card className="h-full">
            <RiwayatProject projects={data.route} />
          </Card>
          <Card>
            <ProjectBerjalan data={data.route} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
