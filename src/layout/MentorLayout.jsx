import { LayoutDashboard, Users, Calendar } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import NavbarDashboard from "../components/dashboard/NavbarDashboard";
import RoleFooter from "../components/dashboard/RoleFooter";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const MentorLayout = () => {
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
    {
      icon: <LayoutDashboard />,
      label: "Dashboard",
      link: "dashboard",
    },
    { icon: <Calendar />, label: "Presentasi", link: "presentasi" },
    { icon: <Users />, label: "Peserta", link: "peserta" },
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

export default MentorLayout;