import Swal from "sweetalert2";
import { useAbsensiStore } from "../stores/useAbsensiStore";
import { postAbsensi, getAbsensiPdf, getAbsensiByDate } from "../helpers/apiClient";


const useAbsensi = () => {
  const {
    setLoading,
    setPdfLoading,
    setSuccessMessage,
    incrementTableKey,
    setAbsensiData,
    setPaginationInfo,
  } = useAbsensiStore();


  // Error Alert
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  // Succes Alert
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  };

  // Handle Absen
  const handleAbsen = async (onSuccess) => {
    try{
      setLoading(true);

      const response = await postAbsensi(); 

      if (response.status >= 200 && response.status < 300) {
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const successMsg =
        response.data?.message ||
          `Absensi berhasil dicatat pada pukul ${currentTime}`;


        setSuccessMessage(successMsg);
        incrementTableKey();

        if (onSuccess) onSuccess(successMsg);
      }
    }catch (error) {
      console.error("Error during absensi:", error);
      let errorMsg = "Terjadi kesalahan saat melakukan absensi.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg =
              error.response.data?.message ||
              "Sesi login telah berakhir. Silakan login kembali.";
            break;
          case 403: 
            errorMsg =
              error.response.data?.message ||
              "Anda tidak memiliki izin untuk melakukan absensi.";
            break;
          case 422:
            errorMsg = 
              error.response.data?.message || "Data absensi tidak valid.";
            break;
          case 429:
            errorMsg = "Terlalu banyak percobaan. Silakan coba lagi nanti.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }

      showErrorAlert(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // Handle Download PDF
  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);

      const response = await getAbsensiPdf();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;


      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `absensi-${currentDate}.pdf`;
      link.setAttribute("download", filename);


      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);


      showSuccessAlert("Data absensi berhasil diunduh dalam format PDF!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      let errorMsg = "Terjadi kesalahan saat mengunduh PDF.";


      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg = "Sesi login telah berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMsg =
              "Anda tidak memiliki izin untuk mengunduh data absensi.";
            break;
          case 404:
            errorMsg = "Data absensi tidak ditemukan.";
            break;
          case 500:
            errorMsg = "Terjadi kesalahan server saat membuat PDF.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg =
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
       showErrorAlert(errorMsg);
    } finally {
      setPdfLoading(false);
    }
  };

  // List absen dengan pagination dan filter tanggal
  const getAbsensiList = async (page = 1, perPage = 10, startDate, endDate) => {
      setLoading(true);

      try {
        const params = {
          page,
          per_page: perPage,
        };
        if (startDate) {
          params.start_date = startDate.toISOString().split("T")[0];
        }
        if (endDate) {
          params.end_date = endDate.toISOString().split("T")[0];
        }
        const response = await getAbsensiByDate(params);
        if (response.status === 200) {
          const { data, meta } = response.data;
          setAbsensiData(data); 
          setPaginationInfo({
          currentPage: meta.current_page,
          lastPage: meta.last_page,
          total: meta.total,
          perPage: meta.per_page,
        });
          incrementTableKey();
        }
      } catch (error) {
        console.error("Error fetching absensi data:", error);
        let errorMsg = "Terjadi kesalahan saat mengambil data absensi.";
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMsg = error.response.data?.message || "Sesi login telah berakhir. Silakan login kembali.";
              break;
            case 403:
              errorMsg = error.response.data?.message || "Anda tidak memiliki izin untuk melihat data ini.";
              break;
            case 404:
              errorMsg = error.response.data?.message || "Data tidak ditemukan.";
              break;
            default:
              errorMsg = error.response.data?.message || errorMsg;
          }
        } else if (error.request) {
          errorMsg = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        }
        showErrorAlert(errorMsg);
      } finally {
        setLoading(false);
      }
    };


  return { handleAbsen, handleDownloadPDF, getAbsensiList};
};


export default useAbsensi;