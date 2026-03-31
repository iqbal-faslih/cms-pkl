import { useState, useEffect, useCallback } from "react";
import { getMockJurnalResponse } from "../../../utils/mockJurnalData";
import { getJurnalSiswa } from "../../../helpers/apiClient"; 
import { generateEventsWithEmptyDates } from "../../../utils/siswa/jurnal/jurnalTransform";

export const useJurnalData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchJurnal = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulasi delay API call
      // await new Promise((resolve) => setTimeout(resolve, 500));

      // === Ganti ini kalau sudah pakai API asli ===
      // const response = getMockJurnalResponse();
      const response = await getJurnalSiswa();

      const jurnalData = response?.data?.data || [];

      // Hitung rentang tanggal: 30 hari terakhir sampai hari ini
      const today = new Date();
      const endDate = today.toISOString().split("T")[0];

      const start = new Date();
      start.setDate(today.getDate() - 30);
      const startDate = start.toISOString().split("T")[0];

      // Generate events: campuran "Mengisi" & "Tidak Mengisi"
      const allEvents = generateEventsWithEmptyDates(
        jurnalData,
        startDate,
        endDate
      );

      setEvents(allEvents);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Gagal mengambil data jurnal", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJurnal();
  }, [fetchJurnal]);

  return {
    events,        // array event untuk FullCalendar
    loading,       // status loading
    error,         // error state
    refetchJurnal: fetchJurnal, // function refresh
    lastUpdated,   // timestamp kapan terakhir refresh
  };
};
