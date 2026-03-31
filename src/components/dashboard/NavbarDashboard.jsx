import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileDropdown from "../ProfilDropdown";
import { Link, useLocation } from "react-router-dom";
import { Building } from "lucide-react";
import NotificationDashboard from "./NotificationDashboard";

const NavbarDashboard = ({
  fotoProfile,
  routePart,
  loading,
  userName,
  isPeserta = false,
}) => {
  const { role } = useContext(AuthContext);

  const location = useLocation();


  const getPageName = () => {
    const parts = location.pathname.split("/").filter(Boolean);

    if (parts.length < [routePart + 1 || 2]) return "Dashboard";
    const currentRoute = parts[routePart || 1];

    return currentRoute
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isActive = location.pathname.includes(`/peserta/riwayat-lowongan`);

  return (
    <nav className="bg-white w-full h-[80px] flex items-center justify-between px-5 md:px-10 py-4 sticky top-0 z-50 border-b border-b-slate-300">
      <div>
        <h1 className="text-2xl font-semibold">{getPageName()}</h1>
      </div>
      <div className="flex gap-4 justify-center items-center">
        <NotificationDashboard />
        {isPeserta && (
          <Link
            to={"/peserta/riwayat-lowongan"}
            className={`size-10 flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
              isActive
                ? "bg-[#306BFF] text-[#DFE8FF]"
                : "text-[#306BFF] bg-[#DFE8FF]"
            }`}
          >
            <Building size={50} />
          </Link>
        )}

        <ProfileDropdown
          fotoProfile={fotoProfile || "/assets/img/defaultPP.png"}
          loading={loading}
          userName={userName || "User"}
          role={role}
        />
      </div>
    </nav>
  );
};

export default NavbarDashboard;
