const CompanyWelcomeCard = ({
  companyName = "PT. Hummatech",
  subtitle = "Kelola Lowongan Dengan Fleksibel",
  badgeLabel = "PT. Hummatech",
  className = "",
}) => {
  return (
    <div
      className={`h-[180px] rounded-2xl border border-[#dbe4ff] bg-[#f7f9ff] p-3 overflow-hidden ${className}`}
    >
      <div className="flex h-full flex-col items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src="/assets/img/logoperusahaan.png"
            alt="Logo Perusahaan"
            className="h-[72px] w-[72px] object-contain"
          />
          <div className="absolute inset-[2px] rounded-full border border-dashed border-blue-300/70 pointer-events-none" />
        </div>

        <div className="flex min-w-0 w-full flex-col justify-center">
          <p className="w-full truncate text-[18px] font-bold leading-tight text-[#2f66ff]">
            Selamat Datang {companyName}!
          </p>
          <p className="text-sm font-semibold leading-tight text-gray-900">
            {subtitle}
          </p>
          <span className="mt-1 inline-block w-fit rounded-full bg-[#fff1df] px-3.5 py-1 text-[13px] font-semibold text-[#f59e0b]">
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyWelcomeCard;

