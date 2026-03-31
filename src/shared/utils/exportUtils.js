import * as XLSX from "xlsx";

export const exportIndividualExcel = (row, activeTab) => {
  // Create data for individual export
  const exportData = [row];

  // Get columns for current tab
  const exportColumns = activeTab === "pendaftaran"
    ? [
        { key: "no", label: "No" },
        { key: "nama", label: "Nama" },
        { key: "sekolah", label: "Sekolah" },
        { key: "jurusan", label: "Jurusan" },
        { key: "created_at", label: "Tanggal" },
        { key: "status", label: "Status" },
      ]
    : [
        { key: "no", label: "No" },
        { key: "nama", label: "Nama" },
        { key: "sekolah", label: "Sekolah" },
        { key: "jurusan", label: "Jurusan" },
        { key: "tanggal_izin", label: "Tanggal Izin" },
        { key: "alasan", label: "Alasan" },
        { key: "status_izin", label: "Status" },
      ];

  // Create headers
  const headers = exportColumns.map((col) => col.label || col.key);

  // Transform data
  const rows = exportData.map((item, index) => {
    return exportColumns.map((col) => {
      const key = col.key;

      if (key === "no") return index + 1;
      if (key === "nama") return item.nama || "";
      if (key === "sekolah") return item.sekolah || "";
      if (key === "jurusan") return item.jurusan || "";

      if (key === "tanggal_izin" || key === "created_at") {
        const dateValue = item[key] || item.tanggal_izin || item.created_at || "";
        if (dateValue) {
          const date = new Date(dateValue);
          return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        }
        return "";
      }

      if (key === "alasan") {
        const reason = item.alasan || item.deskripsi || "";
        if (reason.toLowerCase().includes("izin")) {
          return `Izin - ${reason}`;
        } else if (reason.toLowerCase().includes("sakit")) {
          return `Sakit - ${reason}`;
        }
        return reason || "-";
      }

      if (key === "status" || key === "status_izin") {
        return item[key] || "";
      }

      const rawValue = item[key];
      return rawValue != null ? rawValue : "";
    });
  });

  // Combine headers and rows
  const worksheetData = [headers, ...rows];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const columnWidths = exportColumns.map((col) => {
    if (col.key === "no") return { wch: 5 };
    if (col.key === "nama") return { wch: 25 };
    if (col.key === "sekolah") return { wch: 30 };
    if (col.key === "jurusan") return { wch: 20 };
    if (col.key === "tanggal_izin" || col.key === "created_at") return { wch: 15 };
    if (col.key === "alasan") return { wch: 35 };
    if (col.key === "status" || col.key === "status_izin") return { wch: 15 };
    return { wch: 15 };
  });

  worksheet["!cols"] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Individual");

  // Generate filename
  const timestamp = new Date().toISOString().split("T")[0];
  const fullFileName = `laporan-${row.nama?.replace(/\s+/g, "-") || "data"}-${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(workbook, fullFileName);
};
