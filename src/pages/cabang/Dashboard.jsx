import React from 'react';
import WelcomeCard from '../../components/cards/student/WelcomeCard';
import StatCard from '../../components/cards/StatCard';
import PesertaPerDivisiChart from '../../components/charts/PesertaPerDivisiChart';
import { BsFillBuildingFill } from 'react-icons/bs';
import { FiUser, FiBarChart2 } from 'react-icons/fi';
import { LucideGraduationCap, LucideUser2 } from 'lucide-react';
import MentorDivisionChart from '../../components/charts/KelolaCabangChart';
import JamKantorModernCard from '../../components/cards/JamKantor';

const KelolaCabang = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        {/* Kolom kiri: WelcomeCard + Chart */}
        <div className="space-y-6">
          <WelcomeCard />
          <PesertaPerDivisiChart />
        </div>
        
        {/* Kolom kanan: StatCards + MentorDivisionChart & JamKantorModernCard */}
        <div className="flex-1 space-y-6">
          {/* StatCards Container */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-4 gap-2">
              <StatCard
                icon={<FiUser />}
                title="Admin"
                subtitle="15 Admin"
                cardBg="#F0F9FF"
                iconBg="#0EA5E9"
              />
              <StatCard
                icon={<FiBarChart2 />}
                title="Divisi"
                subtitle="12 Divisi"
                cardBg="#FEF3C7"
                iconBg="#F59E0B"
              />
              <StatCard
                icon={<LucideGraduationCap />}
                title="Mentor"
                subtitle='21 Mentor'
                cardBg="#ECFDF5"
                iconBg="#10B981"
              />
              <StatCard
                icon={<LucideUser2/>}
                title="Magang"
                subtitle="161 Peserta"
                cardBg="#F3E8FF"
                iconBg="#8B5CF6"
              />
            </div>
          </div>
          
          {/* MentorDivisionChart & JamKantorModernCard bersebelahan */}
          <div className="flex gap-6">
            <div className="flex-1">
              <MentorDivisionChart />
            </div>
            <div className="w-93 flex-1">
              <JamKantorModernCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaCabang;