import { useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { HeaderSuperAdmin } from "@/shared/components/header/HeaderSuperAdmin";
import Notifikasi from "@/shared/components/modal/NotifikasiModal";

import { AlertTriangle } from "lucide-react";

export default function DetailDashboardLayout() {
  const [isInactive, setIsInactive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { companyId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const activeMenu = location.pathname.includes("daftar-cabang")
    ? "daftar-cabang"
    : "detail-perusahaan";

  const handleToggleStatus = () => setShowPopup(true);

  const handleConfirm = () => {
    setIsInactive((prev) => !prev);
    setShowPopup(false);
  };

  const handleCancel = () => setShowPopup(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeaderSuperAdmin
        userName="Admin"
        activeMenu={activeMenu}
        itemIsActive={!isInactive}
        onButtonClick={handleToggleStatus}
        onNavigationClick={(path) => navigate(path)}
      />

      {/* AREA KONTEN */}
      <div
        className={`w-full mt-4 max-w-full overflow-x-hidden min-h-screen transition-all duration-300 ${
          isInactive ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <Outlet context={{ isInactive, companyId }} />
      </div>

      <Notifikasi
        isOpen={showPopup}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Are you sure?"
        icon={AlertTriangle}

        message={
          isInactive
            ? "Are you sure you want to activate this company? This will restore all access and functionality."
            : "Are you sure you want to deactivate this company? This action may affect its accessibility and related operations."
        }

        confirmText={isInactive ? "Activate" : "Deactivate"}
        confirmColor={
          isInactive
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }

        iconColor={isInactive ? "text-green-600" : "text-yellow-500"}
      />
    </div>
  );
}
