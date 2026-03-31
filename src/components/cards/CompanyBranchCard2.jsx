import React from 'react';

export default function CompanyBranchCard({
  // TEXT & ICON
  title = "Perusahaan Cabang Terbanyak",
  icon,
  companies = [],

  // === COLOR PROPS ===
  offsetBg = "#fb923c",        // back layer
  cardBg = "#ffffff",          // front card
  iconBg = "#f97316",          // icon bg
  iconColor = "#ffffff",       // icon color

  lineColor = "#fdba74",       // vertical line
  dotBorderColor = "#fb923c",  // outer dot border
  dotInnerColor = "#fb923c",   // inner dot

  titleColor = "#111827",      // title text
  nameColor = "#111827",       // company name
  valueColor = "#9ca3af",      // peserta value
}) {
  // Take only top 5 companies
  const topCompanies = companies.slice(0, 5);

  return (
    <div className="relative w-full max-w-xs">

      {/* BACK LAYER (OFFSET CARD) */}
      <div
        className="absolute inset-0 rounded-3xl translate-x-2 translate-y-2"
        style={{ backgroundColor: offsetBg }}
      />

      {/* FRONT CARD */}
      <div
        className="relative rounded-3xl p-5 shadow-md w-full max-w-xs"
        style={{ backgroundColor: cardBg }}
      >
        {/* Header */}
        <div className="flex items-start gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            {icon && React.createElement(icon)}
          </div>

          <h2
            className="text-sm font-semibold leading-tight pt-0.5"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
        </div>

        {/* Companies List */}
        <div className="relative">

          {/* === VERTICAL LINE === */}
          <div
            className="absolute right-1.5 top-1 bottom-5 w-0.5"
            style={{ backgroundColor: lineColor }}
          />

          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="relative flex items-start justify-between pr-6"
              >
                {/* Texts */}
                <div>
                  <p
                    className="text-[11px] font-semibold mb-0.5"
                    style={{ color: nameColor }}
                  >
                    {company.name}
                  </p>
                  <p className="text-[9px]" style={{ color: valueColor }}>
                    {company.value} peserta
                  </p>
                </div>

                {/* === DOT === */}
                <div className="absolute right-[0.075rem] top-[3px] flex items-center justify-center">
                  <div
                    className="w-3 h-3 rounded-full border-2 bg-white flex items-center justify-center"
                    style={{ borderColor: dotBorderColor }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full translate-y-[0.35px]"
                      style={{ backgroundColor: dotInnerColor }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}