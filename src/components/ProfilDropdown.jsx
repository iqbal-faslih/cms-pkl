import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import LogoutModal from "../shared/components/modal/LogoutModal";
import { ChevronDown, User, LogOut } from "lucide-react";
import ProfileDropdownSkeleton from "./skeletons/siswa/navbar/ProfileDropdownSkeleton";
import Portal from "../shared/components/Portal";

const ProfileDropdown = ({
  fotoProfile,
  loading,
  userName,
  role,
  profile = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    openLogoutModal,
    isLogoutModalOpen,
    handleConfirmLogout,
    handleCancelLogout,
    isLoading,
  } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) return <ProfileDropdownSkeleton />;

  return (
    <div className="relative profile-dropdown">
      <div
        className="flex gap-4 bg-white py-0.5 cursor-pointer items-center"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <img
          src={fotoProfile}
          alt="Profile"
          className="size-13 rounded-full object-cover bg-slate-400"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/img/defaultPP.png";
          }}
        />

        <div className="flex flex-col">
          <p className="font-medium text-sm capitalize">{userName}</p>
          <p className="text-xs font-medium capitalize opacity-60">{role}</p>
        </div>

        <ChevronDown
          size={14}
          className={`transition-transform duration-100 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute overflow-hidden top-full w-40 right-0 bg-white border border-gray-200 rounded-xl shadow-md z-50">
            <Link
              to={`profile-settings`}
              className={`px-4 py-3 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 ${
                profile ? "" : "hidden"
              }`}
              onClick={() => setIsDropdownOpen(false)}
            >
              <User size={20} />
              Profile
            </Link>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                openLogoutModal(); // CALL MODAL
              }}
              className="w-full text-left px-4 py-3 text-[#EE0202] hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3"
            >
              <LogOut size={20} />
              Keluar
            </button>
        </div>
      )}

      <Portal>
        <LogoutModal
          show={isLogoutModalOpen}
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
          title="Yakin Ingin Logout?"
          confirmText={"Ya"}
          cancelText="Batal"
          loading={isLoading}
        />
      </Portal>
    </div>
  );
};

export default ProfileDropdown;
