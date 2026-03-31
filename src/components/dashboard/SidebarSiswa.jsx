import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { StatusContext } from "../../pages/student/StatusContext";

const SidebarSiswa = ({
  isSidebarCollapsed,
  toggleSidebar,
  sidebarMenus,
  logo = "/assets/img/Logo.png",
}) => {
  const location = useLocation();
  const { profileComplete, internshipStatus, applyingStatus } =
    useContext(StatusContext);

  const sidebarWidth = isSidebarCollapsed ? "w-[70px]" : "w-[238px]";

  return (
    <div
      className={`bg-white border-r border-r-slate-300 ${sidebarWidth} h-screen fixed px-2 flex flex-col gap-7 z-[60] transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 h-[80px] relative">
        <img
          src={logo}
          alt="Logo"
          className={`${isSidebarCollapsed ? "w-12" : "w-10 lg:w-12"}`}
        />
        {!isSidebarCollapsed && (
          <div className="mt-2">
            <p className="font-bold text-base lg:text-lg -mb-2">Manajemen</p>
            <p className="font-bold text-base lg:text-lg text-[#0069AB]">
              Magang
            </p>
          </div>
        )}
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-0 -right-5 bg-white border border-slate-300 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors duration-200 z-10"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i
            className={`bi ${
              isSidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"
            } text-xs`}
          ></i>
        </button>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col gap-3 overflow-hidden">
        <Link
          to={"/"}
          className={`px-4 py-2 rounded-lg bg-[#FF9F43] text-white flex gap-3 items-center transition-all duration-500 ease-in-out ${
            isSidebarCollapsed ? "justify-center" : ""
          }`}
          title={isSidebarCollapsed ? "Halaman Utama" : ""}
        >
          <i
            className={`bi bi-house-door-fill text-lg font-medium ${
              isSidebarCollapsed ? "text-base" : ""
            }`}
          ></i>
          {!isSidebarCollapsed && (
            <span className="font-medium text-sm flex items-center gap-2 whitespace-nowrap">
              Halaman Utama
            </span>
          )}
        </Link>
        {sidebarMenus.map((menu, idx) => {
          const isDashboardMenu = menu.label === "Dashboard";
          const shouldLockByProfile = !profileComplete;
          const shouldLockByInternship = profileComplete && !internshipStatus;
          const isDisabled =
            !isDashboardMenu && (shouldLockByProfile || shouldLockByInternship);
          const isActive =
            !isDisabled && location.pathname.includes(`/peserta/${menu.link}`);

          let disableReason = "";
          if (!isDashboardMenu && shouldLockByProfile) {
            disableReason = "Lengkapi profil Anda terlebih dahulu";
          } else if (!isDashboardMenu && shouldLockByInternship) {
            disableReason = applyingStatus
              ? "Permohonan Anda sedang dalam proses verifikasi"
              : "Anda belum melamar lowongan";
          }

          return (
            <Link
              to={isDisabled ? "#" : `/peserta/${menu.link}`}
              key={idx}
              onClick={(e) => isDisabled && e.preventDefault()}
              className={`px-4 py-2 rounded-lg w-full flex gap-3 items-center transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-[#0D5EF4] hover:bg-[#0D42EF] text-white"
                  : isDisabled
                  ? "text-slate-400 opacity-50 cursor-not-allowed"
                  : "text-[#667797] group hover:text-white hover:bg-[#0D42EF]"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
              title={
                isSidebarCollapsed
                  ? menu.label
                  : isDisabled
                  ? disableReason
                  : ""
              }
            >
              <i
                className={`bi ${menu.icon} text-lg font-medium ${
                  isSidebarCollapsed ? "text-base" : ""
                }`}
              ></i>
              {!isSidebarCollapsed && (
                <span className="text-sm flex items-center font-medium gap-2 whitespace-nowrap">
                  {menu.label}
                  {isDisabled && <i className="bi bi-lock text-xs" />}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarSiswa;
