import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
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
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import SidebarPerusahaan from "../components/dashboard/SidebarPerusahaan";
import { AuthContext } from "../contexts/AuthContext";
import { StatusPerusahaanContext } from "../contexts/StatusPerusahaanContext";
import { usePerusahaan } from "../hooks/usePerusahaan";

const PerusahaanLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { hasProfilPerusahaan } = useContext(StatusPerusahaanContext);

  const { user, isLoadingUser } = useContext(AuthContext);
  const { data: perusahaanData } = usePerusahaan();

  const resolveAvatarUrl = (avatarValue) => {
    if (!avatarValue) return "/assets/img/defaultPP.png";
    let baseUrl = String(avatarValue);
    if (baseUrl.startsWith("blob:") || baseUrl.startsWith("data:")) {
      return baseUrl;
    }
    if (baseUrl.startsWith("http")) {
      try {
        const parsed = new URL(baseUrl);
        const isLocalBackendHost =
          parsed.hostname === "127.0.0.1" || parsed.hostname === "localhost";
        if (isLocalBackendHost) {
          const fileBase =
            import.meta.env.VITE_FILE_URL ||
            import.meta.env.VITE_API_URL_FILE ||
            import.meta.env.VITE_API_URL ||
            "";
          if (fileBase) {
            const baseNormalized = String(fileBase).replace(/\/+$/, "");
            baseUrl = `${baseNormalized}/${parsed.pathname.replace(/^\/+/, "")}`;
          }
        }
      } catch {
        // use original url
      }
    } else {
      baseUrl = `${import.meta.env.VITE_FILE_URL}/${baseUrl.replace(/^\/+/, "")}`;
    }

    const avatarVersion =
      user?._avatarVersion ||
      sessionStorage.getItem("avatar_version") ||
      localStorage.getItem("avatar_version") ||
      "";

    if (!avatarVersion) return baseUrl;
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}v=${avatarVersion}`;
  };

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

    {
      id: "peserta-magang",
      label: "Peserta Magang",
      icon: <Users />,
      hasDropdown: true,
      submenu: [
        { icon: <Users />, label: "Peserta Magang", link: "peserta" },
        { icon: <ListChecksIcon />, label: "Absensi", link: "absensi" },
        { icon: <AlarmClock />, label: "Jam Kantor", link: "jam-kantor" },
        { icon: <Layers />, label: "Jurnal", link: "jurnal" },
        { icon: <ClipboardCheck />, label: "Approval", link: "approval" },
        { icon: <CalendarCheck2 />, label: "Piket", link: "piket" },
        { icon: <Mail />, label: "Surat", link: "surat" },
        { icon: <Component />, label: "RFID", link: "rfid" },
      ],
    },
    { icon: <GraduationCap />, label: "Mentor", link: "mentor" },
    {
      icon: <Landmark />,
      label: "Kelola Cabang",
      link: "kelola-cabang",
    },
    { icon: <UserCog2Icon />, label: "Admin", link: "admin" },
    { icon: <Laptop />, label: "Divisi", link: "divisi" },
    {
      icon: <BriefcaseBusinessIcon />,
      label: "Kelola Lowongan",
      link: "kelola-lowongan",
    },
    { icon: <UsersRoundIcon />, label: "Mitra", link: "mitra" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-indigo-50">
      <SidebarPerusahaan
        hasProfileComplete={hasProfilPerusahaan}
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
          loading={isLoadingUser}
          userName={user?.nama}
          fotoProfile={resolveAvatarUrl(
            user?.avatar ||
            user?.logo ||
            perusahaanData?.avatar ||
            perusahaanData?.logo ||
            perusahaanData?.profil
          )}
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

export default PerusahaanLayout;
