import useJamKantorCardModel from "./hooks/useJamKantorCardModel";

const DAY_CHIP_ORDER = ["senin", "selasa", "rabu", "kamis", "jumat"];

export default function JamKantorModernCard({ data = [] }) {
  const { todayText, rows, selectedDay, setSelectedDay } =
    useJamKantorCardModel(data);

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-4xl font-semibold leading-none text-slate-900">
          Jam Kantor
        </h2>
        <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xl font-semibold text-[#4C78FF]">
          {todayText}
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xl font-semibold text-[#6A95FF]">Hari</p>
        <div className="flex flex-wrap gap-2">
          {DAY_CHIP_ORDER.map((dayKey) => {
            const row = rows.find((item) => item.dayKey === dayKey);
            if (!row) return null;

            return (
              <button
                key={dayKey}
                type="button"
                onClick={() => setSelectedDay(dayKey)}
                className={`rounded-[14px] border px-4 py-1.5 text-base font-semibold transition ${
                  selectedDay === dayKey
                    ? "border-[#3E73EE] bg-[#4A77EE] text-white"
                    : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {row.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-2">
        <p className="mb-2 text-xl font-semibold text-[#6A95FF]">Jam Masuk</p>
        <div className="grid grid-cols-4 gap-2 text-center text-base font-semibold text-slate-500">
          <span>Masuk</span>
          <span>Istirahat</span>
          <span>Kembali</span>
          <span>Pulang</span>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.dayKey}
            className={`grid grid-cols-4 items-center gap-2 rounded-xl px-4 py-2 text-center text-base font-semibold ${
              row.isSelected
                ? "bg-[#4A77EE] text-white"
                : "bg-[#F3F4F6] text-slate-500"
            }`}
          >
            <span>{row.masuk}</span>
            <span>{row.istirahat}</span>
            <span>{row.kembali}</span>
            <span>{row.pulang}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
