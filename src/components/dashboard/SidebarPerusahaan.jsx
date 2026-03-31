import { Link } from "react-router-dom";
import { LucideChevronDown } from "lucide-react";
import { usePerusahaanSidebar } from "./hooks/usePerusahaanSidebar";

const getMenuItemClassName = ({
  isDisabled,
  isActive,
  isSidebarCollapsed,
  className,
  withPointerGuard = false,
}) => {
  const disabledClass = withPointerGuard
    ? "text-slate-400 opacity-50 cursor-not-allowed pointer-events-none"
    : "text-slate-400 opacity-50 cursor-not-allowed";

  return `px-4 py-2 ${className || ""}
    rounded-lg flex gap-3 items-center transition-all duration-200 ease-in-out
    ${
      isDisabled
        ? disabledClass
        : isActive
        ? "bg-[#0D5EF4] hover:bg-[#0D42EF] text-white"
        : "text-[#667797] group hover:text-white hover:bg-[#0D42EF]"
    }
    ${isSidebarCollapsed ? "justify-center" : ""}
  `;
};

const MenuLabel = ({ isSidebarCollapsed, label, showLock }) => {
  if (isSidebarCollapsed) return null;

  return (
    <span className="text-sm whitespace-nowrap flex items-center gap-1">
      {label}
      {showLock && <i className="bi bi-lock text-xs" />}
    </span>
  );
};

const SidebarMenuButton = ({
  menu,
  isDisabled,
  isActive,
  isSidebarCollapsed,
  disableReason,
  onClick,
}) => (
  <button
    disabled={isDisabled}
    onClick={onClick}
    className={getMenuItemClassName({
      isDisabled,
      isActive,
      isSidebarCollapsed,
      className: menu.className,
    })}
    title={isDisabled ? disableReason : menu.label}
  >
    <div className={`group-hover:text-white ${isSidebarCollapsed ? "" : "min-w-[18px]"}`}>
      {menu.icon}
    </div>
    <MenuLabel
      isSidebarCollapsed={isSidebarCollapsed}
      label={menu.label}
      showLock={isDisabled}
    />
    {!isSidebarCollapsed && <LucideChevronDown size={18} />}
  </button>
);

const SidebarMenuLink = ({
  menu,
  isDisabled,
  isActive,
  isSidebarCollapsed,
  disableReason,
  to,
}) => (
  <Link
    to={isDisabled ? "#" : to}
    onClick={(event) => {
      if (isDisabled) event.preventDefault();
    }}
    className={getMenuItemClassName({
      isDisabled,
      isActive,
      isSidebarCollapsed,
      className: menu.className,
      withPointerGuard: true,
    })}
    title={isDisabled ? disableReason : menu.label}
  >
    <div className={`group-hover:text-white ${isSidebarCollapsed ? "" : "min-w-[18px]"}`}>
      {menu.icon}
    </div>
    <MenuLabel
      isSidebarCollapsed={isSidebarCollapsed}
      label={menu.label}
      showLock={isDisabled}
    />
  </Link>
);

const SidebarSubmenuList = ({
  menu,
  isSidebarCollapsed,
  isExpanded,
  isSubmenuDisabled,
  disableReason,
  resolveMenuPath,
  currentPath,
}) => {
  if (!menu.hasDropdown || isSidebarCollapsed) return null;

  return (
    <div
      className={`pl-5 transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col space-y-1 py-2">
        {menu.submenu.map((subItem, index) => {
          const submenuPath = resolveMenuPath(subItem.link);
          const isActive = currentPath.includes(submenuPath);

          return (
            <Link
              to={isSubmenuDisabled ? "#" : submenuPath}
              onClick={(event) => {
                if (isSubmenuDisabled) event.preventDefault();
              }}
              key={index}
              className={getMenuItemClassName({
                isDisabled: isSubmenuDisabled,
                isActive,
                isSidebarCollapsed: false,
                className: subItem.className,
                withPointerGuard: true,
              })}
              title={isSubmenuDisabled ? disableReason : subItem.label}
            >
              <div className="group-hover:text-white min-w-[18px]">{subItem.icon}</div>
              <span className="text-sm whitespace-nowrap flex items-center gap-1">
                {subItem.label}
                {isSubmenuDisabled && <i className="bi bi-lock text-xs" />}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const SidebarPerusahaan = ({
  isSidebarCollapsed,
  toggleSidebar,
  logo = "/assets/img/Logo.png",
  sidebarMenus = [],
  bottomMenu = null,
  hasProfileComplete = true,
}) => {
  const sidebarWidth = isSidebarCollapsed ? "w-[70px]" : "w-[238px]";
  const {
    currentPath,
    disableReason,
    resolveMenuPath,
    isMenuDisabled,
    isSubmenuDisabled,
    isExpanded,
    toggleDropdown,
  } = usePerusahaanSidebar({ hasProfileComplete });

  return (
    <div
      className={`bg-white border-r border-r-slate-300 ${sidebarWidth} min-h-screen fixed px-2 flex flex-col gap-7 z-[60] transition-all duration-300`}
    >
      <div className="flex items-center gap-2 h-20 relative">
        <img
          src={logo}
          alt="Logo"
          className={`${isSidebarCollapsed ? "w-12" : "w-10 lg:w-12"}`}
        />

        {!isSidebarCollapsed && (
          <div className="mt-2">
            <p className="font-bold text-base lg:text-lg -mb-2">Manajemen</p>
            <p className="font-bold text-base lg:text-lg text-[#0069AB]">Magang</p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="absolute bottom-0 -right-5 bg-white border border-slate-300 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors duration-200 z-10"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i
            className={`bi ${
              isSidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"
            } text-xs`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto pb-5 scrollbar-hide">
        {sidebarMenus.map((menu, index) => {
          const menuPath = resolveMenuPath(menu.link);
          const isActive = menu.hasDropdown
            ? menu.submenu?.some((subItem) =>
                currentPath.includes(resolveMenuPath(subItem.link))
              )
            : currentPath.includes(menuPath);
          const disabled = isMenuDisabled(menu);

          return (
            <div key={index}>
              {menu.hasDropdown ? (
                <SidebarMenuButton
                  menu={menu}
                  isDisabled={disabled}
                  isActive={isActive}
                  isSidebarCollapsed={isSidebarCollapsed}
                  disableReason={disableReason}
                  onClick={
                    disabled
                      ? undefined
                      : isSidebarCollapsed
                      ? toggleSidebar
                      : () => toggleDropdown(menu.id)
                  }
                />
              ) : (
                <SidebarMenuLink
                  menu={menu}
                  isDisabled={disabled}
                  isActive={isActive}
                  isSidebarCollapsed={isSidebarCollapsed}
                  disableReason={disableReason}
                  to={menuPath}
                />
              )}

              <SidebarSubmenuList
                menu={menu}
                isSidebarCollapsed={isSidebarCollapsed}
                isExpanded={isExpanded(menu.id)}
                isSubmenuDisabled={isSubmenuDisabled}
                disableReason={disableReason}
                resolveMenuPath={resolveMenuPath}
                currentPath={currentPath}
              />
            </div>
          );
        })}
      </div>

      {bottomMenu && (
        <button
          onClick={bottomMenu.onClick}
          className={`mt-auto w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-4 transition-all duration-200 ${bottomMenu.className}
            ${isSidebarCollapsed ? "justify-center" : ""}
          `}
        >
          {bottomMenu.icon}
          {!isSidebarCollapsed && <span className="text-sm">{bottomMenu.label}</span>}
        </button>
      )}
    </div>
  );
};

export default SidebarPerusahaan;
