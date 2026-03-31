import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import RoleFooter from "../components/dashboard/RoleFooter";
import {
  LayoutDashboard,
  Laptop,
  Users,
  ListChecksIcon,
  AlarmClock,
  Layers,
  ClipboardCheck,
  CalendarCheck2,
  Mail,
  Component,
  UserCog2Icon,
  GraduationCap,
  BriefcaseBusinessIcon,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import { AuthContext } from "../contexts/AuthContext";

const CabangLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, isLoadingUser } = useContext(AuthContext);


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
    { icon: <LayoutDashboard />, label: "Dashboard", link: "dashboard" },
    { icon: <Users />, label: "Peserta Magang", link: "peserta" },
    { icon: <ListChecksIcon />, label: "Absensi", link: "absensi" },
    { icon: <AlarmClock />, label: "Jam Kantor", link: "jam-kantor" },
    { icon: <Layers />, label: "Jurnal", link: "jurnal" },
    { icon: <ClipboardCheck />, label: "Approval", link: "approval" },
    { icon: <CalendarCheck2 />, label: "Piket", link: "piket" },
    { icon: <Mail />, label: "Surat", link: "surat" },
    { icon: <Component />, label: "RFID", link: "rfid" },
    { icon: <GraduationCap />, label: "Mentor", link: "mentor" },
    { icon: <UserCog2Icon />, label: "Admin", link: "admin" },
    { icon: <Laptop />, label: "Divisi", link: "divisi" },
    { icon: <BriefcaseBusinessIcon />, label: "Kelola Lowongan", link: "kelola-lowongan" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-indigo-50">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        sidebarMenus={sidebarMenus}
      />
        <div
          className={`
            flex flex-col min-h-screen relative
            transition-[padding] duration-300 ease-in-out
            ${isSidebarCollapsed ? "pl-[70px]" : "pl-[238px]"}
          `}
        >
        <NavbarDashboard
          loading={isLoadingUser}
          userName={user?.nama}
          fotoProfile={
            user?.avatar
              ? `${import.meta.env.VITE_FILE_URL}/${user?.avatar}`
              : "/assets/img/defaultPP.png"
          }
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

export default CabangLayout;
