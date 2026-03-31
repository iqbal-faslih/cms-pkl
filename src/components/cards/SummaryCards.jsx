export default function SummaryCards() {
  const summaryData = [
    {
      title: "Jumlah Admin",
      count: 255,
      icon: <img src="/assets/icons/perusahaan/icon1.svg" alt="Medali" />,
      bgColor: "bg-[#FF9BED]",
      textIcon: "text-white",
      bgColors: "bg-[#FFE2E5]",
    },
    {
      title: "Jumlah Mentor",
      count: 255,
      icon: <img src="/assets/icons/perusahaan/icon2.svg" alt="Mentor" />,
      bgColor: "bg-[#FF947A]",
      bgColors: "bg-[#FFF4DE]",
    },
    {
      title: "Jumlah Divisi",
      count: 255,
      icon: <img src="/assets/icons/perusahaan/icon3.svg" alt="Divisi" />,
      bgColor: "bg-[#9D96FF]",
      bgColors: "bg-[#F3E8FF]",
    },
    {
      title: "Jumlah Peserta Magang",
      count: 255,
      icon: <img src="/assets/icons/perusahaan/icon4.svg" alt="Users" />,
      bgColor: "bg-[#67D9FF]",
      bgColors: "bg-[#C2F0FF]",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-6">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColors} rounded-xl px-4 py-4 pb-20 flex flex-col transform transition-all duration-300 space-y-1.5`}
          >
            <div className="flex md:flex-col lg:flex-row items-start sm:items-center">
              <div className={`${item.bgColor} p-3 rounded-lg mr-3 inline-block`}>
                {item.icon}
              </div>
              <h2 className="text-2xl font-semibold">{item.count}</h2>
            </div>
            <div>
              <p className="text-gray-400 text-lg">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
