import { useState, useEffect } from "react";
import { getRiwayatPresentasi } from "../helpers/apiClient";
import { capitalizeMethod, formatDate, formatTime, transformStatus } from "../helpers/riwayatPresentasiHelper";

export const useRiwayatPresentasi = () => {
  const [allMeetings, setAllMeetings] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);


    const fetchRiwayatPresentasiData = async () => {
      try {
        setIsLoading(true);
        const response = await getRiwayatPresentasi();

        if (response.data.status === "success") {
          const transformedData = response.data.data.map((meeting, index) => {
            const jadwalPresentasi = meeting.jadwal_Presentasi || {};
            let locationOrZoom = "";

            if (jadwalPresentasi.tipe === "online") {
              locationOrZoom =
                jadwalPresentasi.link_zoom ||
                jadwalPresentasi.lokasi ||
                "Link zoom tidak tersedia";
            } else {
              locationOrZoom = jadwalPresentasi.lokasi || "PT. HUMMATECH";
            }

            return {
              id: meeting.id || index + 1,
              project: meeting.projek || `Project ${index + 1}`,
              date: formatDate(jadwalPresentasi.tanggal),
              time: `${formatTime(jadwalPresentasi.waktu_mulai)} - ${formatTime(jadwalPresentasi.waktu_selesai)} WIB`,
              method: capitalizeMethod(jadwalPresentasi.tipe || "Offline"),
              location: locationOrZoom,
              status: transformStatus(meeting.status || jadwalPresentasi.status),
              rawData: meeting,
            };
          });

          setAllMeetings(transformedData);
          setAvailableProjects([...new Set(transformedData.map(m => m.project))]);
        } else {
          setError("Failed to fetch meeting data");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data riwayat presentasi");
      } finally {
        setIsLoading(false);
      }
    };


    useEffect(() => {
        fetchRiwayatPresentasiData();
    }, [refetchTrigger]);

    const refetch = () => {
        setRefetchTrigger(prev => prev + 1);
    };

  return { allMeetings, availableProjects, isLoading, error, refetch,
    fetchRiwayatPresentasiData };
};
