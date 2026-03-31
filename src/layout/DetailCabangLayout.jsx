import { Outlet, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import RoleFooter from "../components/dashboard/RoleFooter";
import {
  LayoutDashboard,
  UserCog2Icon,
  GraduationCap,
  Users,
  Laptop,
  ClipboardCheck,
  Layers,
  ListChecksIcon,
  Mail,
  Component,
  CalendarCheck2,
  AlarmClock,
  SlidersVertical,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import { HeaderInfo } from "../shared/components/header/HeaderInfo";

const DetailCabangLayout = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarMenus = [
    {
      icon: <ChevronLeft />,
      label: "Back",
      link: "/perusahaan/kelola-cabang",
      className: "bg-[#FF9F43] hover:bg-[#FF9F43] text-white",
    },
    { icon: <LayoutDashboard />, label: "Dashboard", link: "dashboard" },
    { icon: <UserCog2Icon />, label: "Admin", link: "admin" },
    { icon: <GraduationCap />, label: "Mentor", link: "mentor" },
    { icon: <Users />, label: "Peserta Magang", link: "peserta" },
    { icon: <Laptop />, label: "Divisi", link: "divisi" },
    { icon: <ClipboardCheck />, label: "Approval", link: "approval" },
    { icon: <Layers />, label: "Jurnal", link: "jurnal" },
    { icon: <ListChecksIcon />, label: "Absensi", link: "absensi" },
    { icon: <Mail />, label: "Surat", link: "surat" },
    { icon: <Component />, label: "RFID", link: "rfid" },
    { icon: <CalendarCheck2 />, label: "Piket", link: "piket" },
    { icon: <AlarmClock />, label: "Jam Kantor", link: "jam-kantor" },
  ];

  const contentMargin = isSidebarCollapsed
    ? "ml-[70px]"
    : "ml-[70px] md:ml-[238px]";
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        sidebarMenus={sidebarMenus}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 ${contentMargin} min-h-screen bg-indigo-50 transition-all duration-300 flex flex-col`}
      >
        {/* Navbar */}
        <NavbarDashboard
          routePart={3}
          //   loading={loading}
          //   fotoProfile={profileImage}
          //   userName={dataPeserta?.nama}
        />

        {/* Main Content */}
        <div className="flex-1 py-5 px-5">
          {!location.pathname.includes('/approval') && !location.pathname.includes('/dashboard') && (
            <HeaderInfo
              nameCabang={"Cabang Purnama"}
              nameDescription={"Bebek purnama"}
            />
          )}
          <Outlet context={{ slug }} />
        </div>
        <div className="mt-auto px-5">
          <RoleFooter />
        </div>

        {/* Footer */}
      </div>
    </div>
  );
};

export default DetailCabangLayout;
