import React from "react";

const StatCard = ({
  icon,
  iconBg = "#E9D5FF", // soft purple icon background
  cardBg = "#F5EEFF", // soft lavender card background
  title = "0",
  subtitle = "Subtitle",
  titleColor = "#111827",
  subtitleColor = "#6366F1",
}) => {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{ backgroundColor: cardBg }}
    >
      <div className="flex items-start justify-between">
        <span
          className="text-[38px] font-semibold leading-none"
          style={{ color: titleColor }}
        >
          {title}
        </span>

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: iconBg }}
        >
          <span className="text-white">{icon}</span>
        </div>
      </div>

      <span
        className="mt-5 block text-lg font-semibold"
        style={{ color: subtitleColor }}
      >
        {subtitle}
      </span>
    </div>
  );
};

export default StatCard;
