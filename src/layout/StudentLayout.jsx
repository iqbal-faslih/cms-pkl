import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarSiswa from "../components/dashboard/SidebarSiswa";
import { usePesertaData } from "../hooks/siswa";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import RoleFooter from "../components/dashboard/RoleFooter";

const StudentLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { profileImage, data: dataPeserta, loading } = usePesertaData();


    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsSidebarCollapsed(true);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    const sidebarMenus = [
    { icon: "bi-grid", label: "Dashboard", link: "dashboard" },
    { icon: "bi-calendar4-week", label: "Absensi", link: "absensi" },
    { icon: "bi-clipboard2-minus", label: "Jurnal", link: "jurnal" },
    { icon: "bi-mortarboard", label: "Jadwal Presentasi", link: "jadwal-presentasi" },
    { icon: "bi-pin-map", label: "Riwayat Presentasi", link: "riwayat-presentasi" },
    { icon: "bi-cast", label: "Route Project", link: "route-project" },
    { icon: "bi-list-check", label: "Piket", link: "piket" },
  ];


  return (
    <div className="min-h-screen overflow-x-hidden bg-indigo-50">
      <SidebarSiswa
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        sidebarMenus={sidebarMenus}
      />

        <div
          className={`
            flex flex-col min-h-screen
            transition-[padding] duration-300 ease-in-out
            ${isSidebarCollapsed ? "pl-[70px]" : "pl-[238px]"}
          `}
        >
        <NavbarDashboard
          loading={loading}
          fotoProfile={profileImage}
          userName={dataPeserta?.nama}
          isPeserta
        />

        <div className="flex-1 py-5 px-5">
          <Outlet />
        </div>

        <div className="px-5">
          <RoleFooter />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
