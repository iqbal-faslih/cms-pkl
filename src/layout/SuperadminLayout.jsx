import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useContext } from "react";
import RoleFooter from "../components/dashboard/RoleFooter";
import {
  LayoutDashboard,
  Laptop,
  Building2,
  ChevronLeft,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import { AuthContext } from "../contexts/AuthContext";

const SuperadminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
    
    const showBackButton = useMemo(() => {
    const path = location.pathname;
    return (
      /^\/superadmin\/manajemen-perusahaan\/[^/]+$/.test(path) ||
      /^\/superadmin\/manajemen-perusahaan\/[^/]+\/[^/]+$/.test(path)
    );
  }, [location.pathname]);

  const sidebarMenus = useMemo(
    () => [
      { icon: <LayoutDashboard />, label: "Dashboard", link: "dashboard" },
      {
        icon: <Building2 />,
        label: "Manajemen Perusahaan",
        link: "manajemen-perusahaan",
      },
      {
        icon: <Laptop />,
        label: "Manajemen Artikel",
        link: "manajemen-artikel",
      },
    ],
    []
  );

  const bottomMenu = useMemo(() => {
    if (!showBackButton) return null;

    return {
      icon: <ChevronLeft />,
      label: "Back",
      onClick: () => navigate("/superadmin/manajemen-perusahaan"),
      className: "bg-[#FF9F43] hover:bg-[#FF7F1F] text-white",
    };
  }, [showBackButton, navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-indigo-50">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        sidebarMenus={sidebarMenus}
        bottomMenu={bottomMenu}
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

export default SuperadminLayout;