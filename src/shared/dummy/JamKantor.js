export const loadDummySchedule = () => {
    const dummy = dayOrder.map((day) => ({
      hari: day,
      masuk: "08:00",
      masukEnd: "08:15",
      istirahat: "12:00",
      istirahatEnd: "13:00",
      kembali: "12:25",
      kembaliEnd: "13:00",
      pulang: "16:00",
      pulangEnd: "17:00",
      status: true,
    }));

    setScheduleData(dummy);
  };
