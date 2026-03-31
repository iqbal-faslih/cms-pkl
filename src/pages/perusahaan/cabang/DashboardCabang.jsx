import PesertaPerDivisiChart from "../../../components/charts/PesertaPerDivisiChart";
import StatCard from "../../../components/cards/StatCard";
import Jadwal from "../../../components/cards/Jadwal";
import MentorChart from "../../../components/charts/MentorChart";
import { FiAward, FiCheckCircle, FiFileText, FiUsers } from "react-icons/fi";
import WelcomeCard from "../../../components/cards/student/WelcomeCard";

const DashboardCabang = () => {
  return (
    <div className="w-full p-6 space-y-6">

      {/* ROW 1: Welcome + Chart | StatCards */}
      <div className="flex gap-6">

        {/* LEFT: Welcome + Chart */}
        <div className="w-125 flex-shrink-0 space-y-6">
          <WelcomeCard />
          <PesertaPerDivisiChart />
        </div>

        {/* RIGHT: Stat Cards */}
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-2xl p-5.5 flex flex-wrap gap-4 h-37 content-start">
            <StatCard
              title="Admin"
              subtitle="120 Admin"
              icon={<FiAward />}
              iconBg="#fda4af"
              cardBg="#ffe4e6"
              titleColor="#000"
              subtitleColor="#306BFF"
            />

            <StatCard
              title="Divisi"
              subtitle="12 Divisi"
              icon={<FiCheckCircle />}
              iconBg="#FF947A"
              cardBg="#FFF4DE"
              titleColor="#000"
              subtitleColor="#306BFF"
            />

            <StatCard
              title="Mentor"
              subtitle="25 Mentor"
              icon={<FiFileText />}
              iconBg="#9D96FF"
              cardBg="#F3E8FF"
              titleColor="#000"
              subtitleColor="#306BFF"
            />

            <StatCard
              title="Magang"
              subtitle="150 Peserta"
              icon={<FiUsers />}
              iconBg="#67D9FF"
              cardBg="#C2F0FF"
              titleColor="#000"
              subtitleColor="#306BFF"
            />
          </div>
        </div>
      </div>

      {/* ROW 2: Jadwal + Mentor */}
      <div className="flex gap-6">
        <div className="w-1/2">
          <Jadwal />
        </div>
        <div className="w-1/2">
          <MentorChart />
        </div>
      </div>

    </div>
  );
};

export default DashboardCabang;