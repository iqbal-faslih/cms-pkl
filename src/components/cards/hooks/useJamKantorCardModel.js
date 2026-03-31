import { useMemo, useState } from "react";
import { getTodayInfo } from "../../../utils/dateUtils";

const DAY_ORDER = ["senin", "selasa", "rabu", "kamis", "jumat"];

const DAY_LABELS = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
};

const normalizeDayKey = (value) => {
  const lower = String(value || "").toLowerCase().trim();
  if (!lower) return "";
  if (lower === "jum'at") return "jumat";
  return lower;
};

const buildRangeFromPair = (start, end) => {
  if (!start && !end) return "-";
  if (start && end) return `${start}-${end}`;
  return start || end || "-";
};

const getField = (row, keys) => {
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = row?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
};

const mapScheduleRow = (row = {}) => {
  const masuk = buildRangeFromPair(
    getField(row, ["masuk", "jam_masuk_start", "jam_masuk"]),
    getField(row, ["masukEnd", "jam_masuk_end"])
  );
  const istirahat = buildRangeFromPair(
    getField(row, ["istirahat", "jam_istirahat_start", "break_start"]),
    getField(row, ["istirahatEnd", "jam_istirahat_end", "break_end"])
  );
  const kembali = buildRangeFromPair(
    getField(row, ["kembali", "jam_kembali_start", "kembali_start"]),
    getField(row, ["kembaliEnd", "jam_kembali_end", "kembali_end"])
  );
  const pulang = buildRangeFromPair(
    getField(row, ["pulang", "jam_pulang_start"]),
    getField(row, ["pulangEnd", "jam_pulang_end"])
  );

  return {
    dayKey: normalizeDayKey(row?.hari || row?.day),
    masuk,
    istirahat,
    kembali,
    pulang,
  };
};

export const useJamKantorCardModel = (data = []) => {
  const today = getTodayInfo();
  const normalizedToday = normalizeDayKey(
    today.dateObj.toLocaleDateString("id-ID", { weekday: "long" })
  );

  const normalizedData = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    return source.map(mapScheduleRow).filter((row) => DAY_ORDER.includes(row.dayKey));
  }, [data]);

  const [selectedDay, setSelectedDay] = useState(
    DAY_ORDER.includes(normalizedToday) ? normalizedToday : "senin"
  );

  const scheduleByDay = useMemo(() => {
    const mapped = {};
    normalizedData.forEach((row) => {
      mapped[row.dayKey] = row;
    });
    return mapped;
  }, [normalizedData]);

  const rows = useMemo(
    () =>
      DAY_ORDER.map((dayKey) => {
        const row = scheduleByDay[dayKey];
        return {
          dayKey,
          label: DAY_LABELS[dayKey],
          masuk: row?.masuk || "-",
          istirahat: row?.istirahat || "-",
          kembali: row?.kembali || "-",
          pulang: row?.pulang || "-",
          isSelected: selectedDay === dayKey,
        };
      }),
    [scheduleByDay, selectedDay]
  );

  return {
    todayText: today.formatted,
    rows,
    selectedDay,
    setSelectedDay,
  };
};

export default useJamKantorCardModel;
