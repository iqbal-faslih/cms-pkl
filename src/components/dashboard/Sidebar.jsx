import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LucideChevronDown } from "lucide-react";

const Sidebar = ({
  isSidebarCollapsed,
  toggleSidebar,
  logo = "/assets/img/Logo.png",
  sidebarMenus = [],
  bottomMenu = null,
}) => {
  const location = useLocation();
  const sidebarWidth = isSidebarCollapsed ? "w-[70px]" : "w-[238px]";
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleDropdown = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  return (
    <div
      className={`bg-white border-r border-r-slate-300 ${sidebarWidth} min-h-screen fixed px-2 flex flex-col gap-7 z-[60] transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 h-20 relative">
        <img
          src={logo}
          alt="Logo"
          className={`${isSidebarCollapsed ? "w-12" : "w-10 lg:w-12"}`}
        />
        {!isSidebarCollapsed && (
          <div className="mt-2">
            <p className="font-bold text-base lg:text-lg -mb-2">Manajemen</p>
            <p className="font-bold text-base lg:text-lg text-[#0069AB]">
              Magang
            </p>
          </div>
        )}
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute bottom-0 -right-5 bg-white border border-slate-300 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors duration-200 z-10"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i
            className={`bi ${
              isSidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"
            } text-xs`}
          ></i>
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto pb-5 scrollbar-hide">
        {sidebarMenus.map((menu, idx) => {
          const isActive = location.pathname.includes(menu.link);
          const isExpanded = expandedMenus[menu.id];

          return (
            <div key={idx}>
              {menu.hasDropdown ? (
                <button
                  onClick={
                    isSidebarCollapsed
                      ? toggleSidebar
                      : () => toggleDropdown(menu.id)
                  }
                  className={`px-4 py-2 ${
                    menu.className
                  } rounded-lg w-full flex gap-3 items-center transition-all duration-200 ease-in-out ${
                    isActive
                      ? "bg-[#0D5EF4] hover:bg-[#0D42EF] text-white"
                      : "text-[#667797] group hover:text-white hover:bg-[#0D42EF]"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                  title={isSidebarCollapsed ? menu.label : ""}
                >
                  <div
                    className={` group-hover:text-white ${
                      isSidebarCollapsed ? "" : "min-w-[18px]"
                    }`}
                  >
                    {menu.icon}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-sm whitespace-nowrap">
                      {menu.label}
                    </span>
                  )}
                  <LucideChevronDown
                    size={18}
                    className={isSidebarCollapsed ? `hidden` : `ml-auto`}
                  />
                </button>
              ) : (
                <Link
                  to={menu.link}
                  key={idx}
                  className={`px-4 py-2 ${
                    menu.className
                  } rounded-lg flex gap-3 items-center transition-all duration-200 ease-in-out ${
                    isActive
                      ? "bg-[#0D5EF4] hover:bg-[#0D42EF] text-white"
                      : "text-[#667797] group hover:text-white hover:bg-[#0D42EF]"
                  } ${isSidebarCollapsed ? "justify-center" : ""}`}
                  title={isSidebarCollapsed ? menu.label : ""}
                  onClick={() => {
                    if (!isSidebarCollapsed) toggleSidebar();
                  }}
                >
                  <div
                    className={` group-hover:text-white ${
                      isSidebarCollapsed ? "" : "min-w-[18px]"
                    }`}
                  >
                    {menu.icon}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-sm whitespace-nowrap">
                      {menu.label}
                    </span>
                  )}
                </Link>
              )}

              {menu.hasDropdown && !isSidebarCollapsed && (
                <div
                  className={`pl-5 transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col space-y-1 py-2">
                    {menu.submenu.map((subItem, index) => {
                      const isActive2 = location.pathname.includes(
                        subItem.link
                      );
                      return (
                        <Link
                          to={subItem.link}
                          key={index}
                          className={`px-4 py-2 ${
                            subItem.className
                          } rounded-lg flex gap-3 items-center transition-all duration-200 ease-in-out ${
                            isActive2
                              ? "bg-[#0D5EF4] hover:bg-[#0D42EF] text-white"
                              : "text-[#667797] group hover:text-white hover:bg-[#0D42EF]"
                          } ${isSidebarCollapsed ? "justify-center" : ""}`}
                          title={isSidebarCollapsed ? subItem.label : ""}
                          onClick={() => toggleSidebar()}
                        >
                          <div
                            className={` group-hover:text-white ${
                              isSidebarCollapsed ? "" : "min-w-[18px]"
                            }`}
                          >
                            {subItem.icon}
                          </div>
                          {!isSidebarCollapsed && (
                            <span className="text-sm whitespace-nowrap">
                              {subItem.label}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {bottomMenu && (
        <button
          onClick={bottomMenu.onClick}
          className={`mt-auto w-full flex items-center gap-3 px-4 py-2 rounded-lg mb-4 transition-all duration-200 ${bottomMenu.className}
            ${isSidebarCollapsed ? "justify-center" : ""}`}
        >
          {bottomMenu.icon}
          {!isSidebarCollapsed && (
            <span className="text-sm">{bottomMenu.label}</span>
          )}
        </button>
      )}
    </div>
  );
};

export default Sidebar;
