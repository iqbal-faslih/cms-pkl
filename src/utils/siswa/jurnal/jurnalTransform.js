// utils/eventTransformers.js
import { formatDetailDate, isPastDate } from "../../dateUtils";

export const transformJurnalToEvent = (jurnal) => ({
  id: jurnal.id,
  title: "Mengisi",
  start: jurnal.tanggal,
  allDay: true,
  extendedProps: {
    deskripsi: jurnal.deskripsi,
    created_at: jurnal.created_at,
    bukti: jurnal.bukti?.path || null,
    originalData: jurnal,
    status: "mengisi",
    isPastDate: isPastDate(jurnal.tanggal),
  },
  backgroundColor: "#ECFDF5",
  textColor: "#059669",
  borderColor: "#D1FAE5",
});

export const transformEmptyDateToEvent = (date) => ({
  id: `empty-${date}`,
  title: "Tidak Mengisi",
  start: date,
  allDay: true,
  extendedProps: {
    status: "tidak_mengisi",
    originalData: null,
    isPastDate: isPastDate(date),
  },
  backgroundColor: "#FEF2F2",
  textColor: "#DC2626",
  borderColor: "#FECACA",
});

export const transformJurnalArrayToEvents = (jurnalArray) => {
  return jurnalArray.map(transformJurnalToEvent);
};

export const generateEventsWithEmptyDates = (jurnalArray, startDate, endDate) => {
  const filledEvents = transformJurnalArrayToEvents(jurnalArray);
  const filledDates = new Set(filledEvents.map((event) => event.start));

  const emptyEvents = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];

    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (!filledDates.has(dateStr) && isPastDate(dateStr)) {
        emptyEvents.push(transformEmptyDateToEvent(dateStr));
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return [...filledEvents, ...emptyEvents];
};

export const transformEventToModalData = (eventInfo) => {
  const status = eventInfo.event.extendedProps.status;
  const eventDate = eventInfo.event.start.toISOString().split("T")[0];
  const isPast = isPastDate(eventDate);
  const eventData = eventInfo.event.extendedProps.originalData;

  if (status === "tidak_mengisi") {
    return {
      user: "Siswa",
      school: "Sekolah",
      date: formatDetailDate(eventDate),
      title: "Tidak Mengisi",
      image: "",
      description: "Jurnal kosong pada tanggal ini",
      originalData: null,
      status: "tidak_mengisi",
      isPast,
      canCreate: !isPast,
    };
  }

  return {
    user: eventData?.user?.name || eventData?.nama_user || "User",
    school: eventData?.school?.name || eventData?.nama_sekolah || "Sekolah",
    date: formatDetailDate(eventData?.tanggal || eventDate),
    title: eventData?.judul || "Jurnal Harian",
    image: eventData?.bukti?.path || "",
    description: eventData?.deskripsi || "Tidak ada deskripsi",
    originalData: eventData,
    status: "mengisi",
    isPast,
    canEdit: !isPast,
  };
};
