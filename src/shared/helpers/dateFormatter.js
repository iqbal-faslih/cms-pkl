import { parse, format, isValid } from "date-fns";

export const toDisplayFormat = (isoDate) => {
  if (!isoDate) return "";

  try {
    const cleanDate = isoDate.split("T")[0].replace(/[/.]/g, "-");

    const parsed = parse(cleanDate, "yyyy-MM-dd", new Date());
    if (!isValid(parsed)) {
      const altParsed = parse(cleanDate, "dd-MM-yyyy", new Date());
      return isValid(altParsed) ? format(altParsed, "dd-MM-yyyy") : "";
    }

    return format(parsed, "dd-MM-yyyy");
  } catch (err) {
    console.error("Sumthin wrong w that format:", isoDate, err);
    return "";
  }
};

export const toBackendFormat = (displayDate) => {
  if (!displayDate) return "";

  try {
    if (displayDate instanceof Date) {
      return format(displayDate, "yyyy-MM-dd");
    }

    const normalized = displayDate.replace(/[/.]/g, "-");

    const parsed = parse(normalized, "dd-MM-yyyy", new Date());
    if (!isValid(parsed)) {
      const altParsed = parse(normalized, "yyyy-MM-dd", new Date());
      return isValid(altParsed) ? format(altParsed, "yyyy-MM-dd") : "";
    }

    return format(parsed, "yyyy-MM-dd");
  } catch (err) {
    console.error("Gagal euy:", displayDate, err);
    return"";
}
};
