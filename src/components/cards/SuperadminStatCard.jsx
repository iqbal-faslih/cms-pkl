import React from 'react';
import { TrendingUp, TrendingDown, Building } from 'lucide-react';

const SuperadminStatCard = ({
  icon: Icon = Building,
  title = "Perusahaan",
  count = 12,
  countLabel = "Perusahaan",
  trend = 8,
  trendLabel = "from yesterday",
  bgColor = "bg-pink-50",
  iconBgColor = "bg-pink-500",
  iconColor = "text-white",
  trendUp = true
}) => {
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;
  const trendColor = trendUp ? "text-blue-500" : "text-red-500";
  const trendPrefix = trendUp ? "+" : "-";

  return (
    <div
      className={`
        ${bgColor}
        rounded-2xl
        w-full
        p-3 sm:p-4 md:p-5
        mt-3 sm:mt-4
        min-h-[90px] sm:min-h-[120px]
        shadow-sm hover:shadow-md
        transition-shadow duration-200
      `}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className={`
            ${iconBgColor}
            rounded-full
            p-2.5 sm:p-3 md:p-4
            flex items-center justify-center
            flex-shrink-0
          `}
        >
          <Icon
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${iconColor}`}
            strokeWidth={2.5}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-sm sm:text-base truncate">
            {title}
          </h3>

          <p className="text-gray-700 text-xs sm:text-sm truncate">
            {count} {countLabel}
          </p>

          <div
            className={`
              mt-1
              flex items-center gap-1
              text-[10px] sm:text-[11px]
              ${trendColor}
              font-medium
              flex-wrap
            `}
          >
                        <span className="whitespace-nowrap">
              {trendPrefix}{Math.abs(trend)}
            </span>
            <span className="text-blue-600 truncate">{trendLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminStatCard;
