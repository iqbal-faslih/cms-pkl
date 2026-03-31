// src/components/JobCard.jsx
import { MapPin, Users, Calendar, Lock } from "lucide-react";
import PrimaryButton from "../button/PrimaryButton";
import { resolveJobsCardViewModel } from "./helpers/jobsCardViewModel";
import { isLowonganComingSoon } from "../../helpers/lowonganStatusHelper";

export default function JobsCard({ job }) {
  const lowonganComingSoon = isLowonganComingSoon(job);
  const {
    jobName,
    internshipBadge,
    showHeaderBadge,
    showLifecycleBadge,
    lifecycleBadgeLabel,
    lifecycleBadgeClassName,
    headerBadgeLabel,
    headerBadgeClassName,
    maxKuotaLabel,
  } = resolveJobsCardViewModel(job);

  return (
    <div
      key={job.id}
      className="bg-white border-1 shadow-sm border-gray-400 rounded-xl p-3 relative transition-opacity duration-200 w-[350px]"
    >
      <div className="w-full h-40">
        <img
          src={job.image}
          alt={`Logo ${job.perusahaan}`}
          className="w-full h-full object-cover rounded-lg bg-gray-200"
          loading="lazy"
        />
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">

        <h3 className="font-bold md:text-lg max-w-[200px] line-clamp-1">
          {jobName}
        </h3>
        {showHeaderBadge && (
          <div
            className={`flex items-center text-xs px-4 py-1 rounded-full w-fit font-light ${headerBadgeClassName}`}
          >
            <span>{headerBadgeLabel}</span>
          </div>
        )}
        </div>
        {showLifecycleBadge && lifecycleBadgeLabel && lifecycleBadgeLabel !== headerBadgeLabel && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${lifecycleBadgeClassName}`}
          >
            {lifecycleBadgeLabel}
          </span>
        )}
        {internshipBadge && (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${internshipBadge.className}`}
          >
            Sistem: {internshipBadge.label}
          </span>
        )}
        <p className="text-xs text-gray-700 flex items-center gap-1 font-medium">
          {job.perusahaan}
        </p>
        <p className="text-xs text-gray-700 flex items-center gap-1">
          <MapPin size={14} /> {job.lokasi}
        </p>
        <p className="text-xs text-gray-700 flex items-center gap-1">
          <Calendar size={14} /> {job.mulai} - {job.selesai}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Users size={14} /> {maxKuotaLabel}
          </p>
          <p className="font-semibold max-w-[150px] line-clamp-1 text-[#FF9F43] bg-[#FFE9DA] px-2 py-1 rounded-full">
             Divisi {job.divisi}
          </p>
        </div>

        

        {lowonganComingSoon ? (
          <div className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
            <Lock size={16} />
            Coming Soon
          </div>
        ) : (
          <PrimaryButton
            to={`/lowongan/${job.id}`}
            rounded="rounded-xl"
          >
            Lihat Detail
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
