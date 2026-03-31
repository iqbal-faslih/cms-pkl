import React from "react";
import StatCard from "../../components/cards/StatCard";
import PesertaPerDivisiChart from "../../components/charts/PesertaPerDivisiChart";
import MentorDivisionChart from "../../components/charts/KelolaCabangChart";
import JamKantorModernCard from "../../components/cards/JamKantor";
import { LucideGraduationCap, UserRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { FaUserPlus } from "react-icons/fa";
import useKelolaCabangViewModel from "./hooks/useKelolaCabangViewModel";
import CompanyWelcomeCard from "../../components/perusahaan/CompanyWelcomeCard";

const KelolaCabang = () => {
  const { slug } = useParams();

  const {
    loading,
    error,
    statCards,
    welcomeName,
    companyLabel,
    pesertaPerDivisi,
    mentorPerDivisi,
    jamKerjaToday,
  } = useKelolaCabangViewModel(slug);

  const cardIcons = {
    admin: <FaUserPlus className="h-4 w-4" />,
    divisi: <Icon icon="heroicons:chart-bar-square-20-solid" width="20" />,
    mentor: <LucideGraduationCap className="h-5 w-5" />,
    magang: <UserRound className="h-5 w-5" />,
  };

  if (loading) return <p className="px-2 py-8 text-sm text-slate-500">Memuat detail cabang...</p>;
  if (error) return <p className="px-2 py-8 text-sm text-red-600">Gagal mengambil data detail cabang</p>;

  return (
    <div className="bg-[#EEF4FF] rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 mb-0">
        <CompanyWelcomeCard
          companyName={welcomeName}
          subtitle="Kelola aktivitas magang dan data admin dengan mudah disini."
          badgeLabel={companyLabel}
        />

        <div className="xl:col-span-3 bg-[#f3f6ff] border border-[#dbe4ff] rounded-2xl px-3 py-1 min-h-[180px] flex items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {statCards.map((card) => (
              <StatCard
                key={card.key}
                icon={cardIcons[card.key]}
                title={card.title}
                subtitle={card.subtitle}
                cardBg={card.cardBg}
                iconBg={card.iconBg}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr,1.85fr]">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <PesertaPerDivisiChart data={pesertaPerDivisi} />
        </div>

        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1fr,370px]">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <MentorDivisionChart data={mentorPerDivisi} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <JamKantorModernCard data={jamKerjaToday} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaCabang;
