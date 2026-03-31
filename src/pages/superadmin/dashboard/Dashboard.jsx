import React from "react";

// Cards
import SuperadminStatCard from "../../../components/cards/SuperadminStatCard";
import AdminOnlineList from "../../../components/cards/AdminProfileList";
import CompanyBranchCard from "../../../components/cards/CompanyBranchCard2";
import ChartView from "../../../shared/components/ChartVIew";
import NotificationSystem from "../../../components/cards/NotificationSystem";
import { FiBarChart2, FiBarChart, FiFile, FiTag, FiUser } from "react-icons/fi";
import CompanyList from "../../../components/cards/CompanyList";

// Chart Config
import companyTrendConfig, {
  companyTrendData,
} from "../../../components/cards/companyTrendConfig";
import { companyData_1 } from "./dummies";

const DashboardSuperadmin = () => {
  const companyData = companyData_1

  return (
    <div className="space-y-6">

      {/* ============================
          BLOCK 1 — HEADER + ADMIN ONLINE
      ============================ */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* LEFT: STAT CARDS */}
        <div className="flex-1 min-w-0 bg-white shadow-sm rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              All Participants
            </h2>
            <p className="text-gray-500 text-sm">
              Total jumlah seluruh participants
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <SuperadminStatCard
              title="Perusahaan"
              count={12}
              countLabel="Perusahaan"
              trend={8}
              trendLabel="from yesterday"
              bgColor="bg-pink-50"
              iconBgColor="bg-pink-500"
              icon={FiBarChart}
            />

            <SuperadminStatCard
              title="Cabang"
              count={10}
              countLabel="Cabang"
              trend={5}
              trendLabel="from yesterday"
              bgColor="bg-yellow-50"
              iconBgColor="bg-yellow-500"
              icon={FiFile}
            />

            <SuperadminStatCard
              title="Mitra"
              count={7}
              countLabel="Mitra"
              trend={2}
              trendLabel="from yesterday"
              bgColor="bg-green-50"
              iconBgColor="bg-green-500"
              icon={FiTag}
            />

            <SuperadminStatCard
              title="Admin"
              count={4}
              countLabel="Admin"
              trend={5}
              trendLabel="from yesterday"
              bgColor="bg-purple-50"
              iconBgColor="bg-purple-500"
              icon={FiUser}
            />
          </div>
        </div>

        {/* RIGHT: ADMIN ONLINE */}
        <div className="w-full lg:w-64 flex">
          <AdminOnlineList />
        </div>
      </div>

      {/* ============================
          MAIN CONTENT
      ============================ */}
      <div className="flex flex-col xl:flex-row gap-4">

        {/* LEFT CONTENT */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* BLOCK 2 — TOP 5 */}
          <div className="bg-white shadow-sm rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Top 5
              </h2>
              <p className="text-gray-500 text-sm">
                Analisis Perusahaan & Magang
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <CompanyBranchCard
                icon={FiBarChart2}
                title="Perusahaan Cabang Terbanyak"
                companies={companyData}
                offsetBg="#fce7f3"
                cardBg="#ffffff"
                iconBg="#ec4899"
                iconColor="#ffffff"
                lineColor="#f9a8d4"
                dotBorderColor="#ec4899"
                dotInnerColor="#ec4899"
              />

              <CompanyBranchCard
                icon={FiBarChart2}
                title="Perusahaan Cabang Terbanyak"
                companies={companyData}
                offsetBg="#fed7aa"
                cardBg="#ffffff"
                iconBg="#fb923c"
                iconColor="#ffffff"
                lineColor="#fdba74"
                dotBorderColor="#fb923c"
                dotInnerColor="#fb923c"
              />

              <CompanyBranchCard
                icon={FiBarChart2}
                title="Perusahaan Peserta Terbanyak"
                companies={companyData}
                offsetBg="#bfdbfe"
                cardBg="#ffffff"
                iconBg="#3b82f6"
                iconColor="#ffffff"
                lineColor="#93c5fd"
                dotBorderColor="#3b82f6"
                dotInnerColor="#3b82f6"
              />
            </div>
          </div>

          {/* BLOCK 3 — CHART + NOTIFICATION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

            {/* CHART */}
            <div className="xl:col-span-2 bg-white shadow-sm rounded-xl p-6 h-80">
              <ChartView
                config={companyTrendConfig}
                data={companyTrendData}
                height={250}
              />
            </div>

            {/* NOTIFICATION (dibuat kayak AdminOnlineList) */}
            <div className="w-full flex-shrink-0">
              <NotificationSystem />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — COMPANY LIST */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <CompanyList />
        </div>
      </div>
    </div>
  );
};

export default DashboardSuperadmin;
