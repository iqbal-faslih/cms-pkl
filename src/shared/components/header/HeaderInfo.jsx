import React, { useEffect, useMemo, useState } from "react";
import LogoPerusahaan from "/assets/img/logoperusahaan.png";
import verify from "/assets/img/verify.png";
import { MapPin, PencilLine } from "lucide-react";

const defaultTabs = [
  { key: "data-admin-cabang", label: "Data Admin Cabang" },
  { key: "data-cabang", label: "Data Cabang" },
];

export const HeaderInfo = ({
  nameCabang = "",
  nameDescription = "",
  enableTabs = false,
  tabs = null,
  cover = "/assets/img/sampul.png",
  coverLoading = false,
  activeTab = null,
  logo = LogoPerusahaan,
  setActiveTab = null,
  alamat,
  onEditLogo = null,
}) => {

  const tabsToUse = useMemo(
    () => (tabs && Array.isArray(tabs) && tabs.length > 0 ? tabs : defaultTabs),
    [tabs]
  );

  const [internalActiveTab, setInternalActiveTab] = useState(
    tabsToUse[0]?.key ?? null
  );

  useEffect(() => {
    if (activeTab !== null && activeTab !== undefined) {
      setInternalActiveTab(activeTab);
    } else {
      if (!tabsToUse.find((t) => t.key === internalActiveTab)) {
        setInternalActiveTab(tabsToUse[0]?.key ?? null);
      }
    }
  }, [activeTab, internalActiveTab, tabsToUse]);

  const handleTabClick = (key) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(key);
    } else {
      setInternalActiveTab(key);
    }
  };

  const currentActive =
    activeTab !== null && activeTab !== undefined
      ? activeTab
      : internalActiveTab;

  return (
    <div className="bg-white rounded-2xl">
      {coverLoading ? (
        <div className="w-full h-48 sm:h-64 md:h-80 rounded-t-2xl bg-slate-100 flex items-center justify-center text-sm text-slate-500 animate-pulse">
          Memuat background profil...
        </div>
      ) : cover ? (
        <img
          src={cover}
          alt="Sampul"
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-t-2xl"
        />
      ) : (
        <div className="w-full h-48 sm:h-64 md:h-80 rounded-t-2xl bg-slate-100 flex items-center justify-center text-sm text-slate-500">
          Tidak ada profil background yang dipilih
        </div>
      )}

      <div className="flex flex-row sm:flex-col items-start pt-4 gap-1 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={logo}
              alt="Logo Perusahaan"
              className="size-24 sm:size-28 rounded-full object-cover border border-slate-200 bg-white"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/img/defaultPP.png";
              }}
            />
            {typeof onEditLogo === "function" && (
              <button
                type="button"
                onClick={onEditLogo}
                className="p-2 rounded-full bg-[#0D5EF4] hover:bg-[#0D42EF] flex items-center justify-center absolute bottom-0 right-0 cursor-pointer border border-white"
                aria-label="Edit foto profil perusahaan"
              >
                <PencilLine size={16} className="text-white" />
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {nameCabang}
              <img src={verify} alt="verified" className="inline-block ml-2" />
            </h1>

            <p className="text-sm sm:text-base lg:text-lg font-light text-gray-600 leading-relaxed">
              {nameDescription}
            </p>

            <div className="flex items-center text-sm text space-x-2">
              <MapPin size={16} className="w-6 h-6 font-light" />
              <p>{alamat}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-1 gap-1 sm:gap-2">
          {enableTabs && (
            <div className="mt-6 flex gap-2">
              {tabsToUse.map((tab) => {
                const isActive = currentActive === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`px-6 py-2.5 rounded-t-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-indigo-50 text-blue-500 hover:bg-indigo-100"
                        : "bg-white hover:bg-indigo-50 hover:text-blue-500 text-gray-900"
                    }`}
                    type="button"
                    aria-pressed={isActive}
                    aria-label={tab.label}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
