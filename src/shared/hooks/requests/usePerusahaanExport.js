import { useState } from "react";
import axios from "axios";

export const usePerusahaanExport = () => {
  const [loading, setLoading] = useState(false);

  const onExport = async (type) => {
    try {
      setLoading(true);

      const endpoint =
        type === "pdf"
          ? "/perusahaan-export/pdf"
          : "/perusahaan-export/excel";

      const response = await axios.get(endpoint, {
        responseType: "blob",
      });

      const fileName =
        type === "pdf"
          ? "jurnal-perusahaan.pdf"
          : "jurnal-perusahaan.xlsx";

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export gagal:", error);
    } finally {
      setLoading(false);
    }
  };

  return { onExport, loading };
};
