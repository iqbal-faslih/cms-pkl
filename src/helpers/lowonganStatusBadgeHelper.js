import {
  getLowonganLifecycleLabel,
  getLowonganLifecycleState,
} from "./lowonganStatusHelper";

const STATUS_BADGE_THEME = {
  open: {
    className: "bg-[#fff3e5] text-[#f59e0b]",
  },
  closed: {
    className: "bg-[#dcf8ee] text-[#1ca777]",
  },
  coming_soon: {
    className: "bg-[#fff7e6] text-[#d97706]",
  },
};

export const getLowonganStatusBadge = (
  job = {},
  {
    openLabel = "Berlangsung",
    closedLabel = "Selesai",
    comingSoonLabel = "Coming Soon",
  } = {}
) => {
  const state = getLowonganLifecycleState(job);
  const fallbackTheme = STATUS_BADGE_THEME.open;
  const theme = STATUS_BADGE_THEME[state] || fallbackTheme;

  return {
    state,
    label: getLowonganLifecycleLabel(job, {
      openLabel,
      closedLabel,
      comingSoonLabel,
    }),
    className: theme.className,
  };
};
