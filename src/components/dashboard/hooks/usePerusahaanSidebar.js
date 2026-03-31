import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const BASE_PATH = "/perusahaan";
const LOCK_REASON = "Isi dan lengkapi data diri anda terlebih dahulu.";

const resolveMenuPath = (link = "") => `${BASE_PATH}/${link}`;

export const usePerusahaanSidebar = ({ hasProfileComplete }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleDropdown = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const sidebarMeta = useMemo(
    () => ({
      currentPath: location.pathname,
      disableReason: LOCK_REASON,
      resolveMenuPath,
      isMenuDisabled: (menu) => !hasProfileComplete && menu.label !== "Dashboard",
      isSubmenuDisabled: !hasProfileComplete,
      isExpanded: (menuId) => Boolean(expandedMenus[menuId]),
    }),
    [expandedMenus, hasProfileComplete, location.pathname]
  );

  return {
    expandedMenus,
    toggleDropdown,
    ...sidebarMeta,
  };
};

