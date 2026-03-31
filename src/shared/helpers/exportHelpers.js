import * as XLSX from "xlsx";

export const exportIndividualExcel = (row, columns) => {
  const exportData = [row];
  const exportColumns = columns.filter(
    (col) => col.key !== "aksi" && col.key !== "checkbox"
  );

  const headers = exportColumns.map((col) => col.label || col.key);

  const rows = exportData.map((item, index) => {
    return exportColumns.map((col) => {
      const key = col.key;
      if (key === "no") return index + 1;
      
      if (key === "tanggal_izin" || key === "created_at") {
        const dateValue = item[key] || "";
        if (dateValue) {
          return new Date(dateValue).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        return "";
      }

      if (key === "alasan") {
        const reason = item.alasan || item.deskripsi || "";
        if (reason.toLowerCase().includes("izin")) return `Izin - ${reason}`;
        else if (reason.toLowerCase().includes("sakit")) return `Sakit - ${reason}`;
        return reason || "-";
      }

      return item[key] || "";
    });
  });

  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  worksheet["!cols"] = exportColumns.map(() => ({ wch: 20 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Individual");
  
  const timestamp = new Date().toISOString().split("T")[0];
  const fileName = `laporan-${row.nama?.replace(/\s+/g, "-") || "data"}-${timestamp}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
};