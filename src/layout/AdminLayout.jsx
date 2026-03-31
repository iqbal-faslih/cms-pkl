import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import RoleFooter from "../components/dashboard/RoleFooter";
import {
  LayoutDashboard,
  Laptop,
  Building2,
  BriefcaseBusinessIcon,
  UsersRoundIcon,
  Landmark,
  ListChecksIcon,
  AlarmClock,
  Layers,
  ClipboardCheck,
  CalendarCheck2,
  Mail,
  Component,
  UserCog2Icon,
  GraduationCap,
  SlidersVertical,
  Users,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import { BsSuitcase } from "react-icons/bs";
import { AuthContext } from "../contexts/AuthContext";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { user, isLoadingUser } = useContext(AuthContext);

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
    { icon: <Laptop />, label: "Divisi", link: "divisi" },
  ];

  const contentMargin = isSidebarCollapsed
    ? "ml-[70px]"
    : "ml-[70px] md:ml-[238px]";

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        sidebarMenus={sidebarMenus}
      />

      <div
        className={`flex-1 ${contentMargin} min-h-screen bg-indigo-50 transition-all duration-300 flex flex-col`}
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

        <div className="flex-1 py-5 px-5 container mx-auto">
          <Outlet />
        </div>
        <div className="mt-auto px-5 container mx-auto">
          <RoleFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
