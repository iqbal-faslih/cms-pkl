import { useState, useEffect } from "react";
import { getJadwalPiket } from "../helpers/apiClient";

export const useJadwalPiket = () => {
  const [shift, setShift] = useState("Pagi");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    Pagi: [],
    Sore: [],
  });
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null); 
      
      const res = await getJadwalPiket();
      
      const pagi = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "pagi"
      );
      const sore = res.data.data.filter(
        (schedule) => schedule.shift.toLowerCase() === "sore"
      );

      const formattedSchedule = {
        Pagi: pagi.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Member names
        })),
        Sore: sore.map((schedule) => ({
          id: schedule.id,
          hari: schedule.hari,
          shift: schedule.shift,
          members: schedule.peserta.map((p) => p.nama), // Member names
        })),
      };

      setScheduleData(formattedSchedule);
    } catch (error) {
      console.error("Failed to fetch schedule data:", error);
      setError(error.message || "Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
            fetchSchedule();
    }, [refetchTrigger]);

    const refetch = () => {
        setRefetchTrigger(prev => prev + 1);
    };

  return {
    shift,
    setShift,
    loading,
    error,
    scheduleData,
    refetch
  };
};