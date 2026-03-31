import React from "react";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";

/**
 * Excel Export Button Component
 * Automatically downloads Excel file with formatted table data
 * 
 * @param {Array} columns - Column configuration
 * @param {Array} data - Row data to export
 * @param {String} fileName - Name of the Excel file (without extension)
 * @param {String} sheetName - Name of the worksheet
 * @param {Array} excludeKeys - Keys to exclude from export (e.g., ["aksi", "checkbox"])
 */
const ExcelExportButton = ({
  columns = [],
  data = [],
  fileName = "laporan-kehadiran",
  sheetName = "Laporan",
  excludeKeys = ["aksi", "checkbox"],
}) => {
  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    // Filter columns to exclude non-exportable keys
    const exportableColumns = columns.filter(
      (col) => !excludeKeys.includes(col.key)
    );

    // Create headers from column labels
    const headers = exportableColumns.map((col) => col.label || col.key);

    // Transform data rows
    const rows = data.map((row, index) => {
      return exportableColumns.map((col) => {
        const key = col.key;
        let cellValue = "";

        // Handle special cases
        if (key === "no") {
          return index + 1;
        }

        if (key === "nama") {
          return row.nama || "";
        }

        if (key === "sekolah") {
          return row.sekolah || "";
        }

        if (key === "jurusan") {
          return row.jurusan || "";
        }

        if (key === "tanggal_izin" || key === "created_at" || key === "tanggal") {
          const dateValue = row[key] || row.tanggal_izin || row.created_at || "";
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
          const reason = row.alasan || row.deskripsi || "";
          if (reason.toLowerCase().includes("izin")) {
            return `Izin - ${reason}`;
          } else if (reason.toLowerCase().includes("sakit")) {
            return `Sakit - ${reason}`;
          }
          return reason || "-";
        }

        if (key === "status" || key === "status_izin") {
          return row[key] || "";
        }

        // Handle time fields
        if (key === "jam_masuk" || key === "jam_keluar" || key === "jam_pulang") {
          return row[key] || "";
        }

        if (key === "metode") {
          return row[key] || "";
        }

        if (key === "status_kehadiran") {
          return row[key] || "";
        }

        if (key === "id_peserta") {
          return row[key] || row.id || "";
        }

        // Default: return raw value
        const rawValue = row[key];
        return rawValue != null ? rawValue : "";
      });
    });

    // Combine headers and rows
    const worksheetData = [headers, ...rows];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const columnWidths = exportableColumns.map((col) => {
      if (col.key === "no") return { wch: 5 };
      if (col.key === "nama") return { wch: 25 };
      if (col.key === "sekolah") return { wch: 30 };
      if (col.key === "jurusan") return { wch: 20 };
      if (col.key === "tanggal_izin" || col.key === "created_at" || col.key === "tanggal") return { wch: 15 };
      if (col.key === "alasan") return { wch: 35 };
      if (col.key === "status" || col.key === "status_izin") return { wch: 15 };
      if (col.key === "jam_masuk" || col.key === "jam_keluar" || col.key === "jam_pulang") return { wch: 12 };
      if (col.key === "metode") return { wch: 12 };
      if (col.key === "status_kehadiran") return { wch: 15 };
      if (col.key === "id_peserta") return { wch: 15 };
      return { wch: 15 };
    });

    worksheet["!cols"] = columnWidths;

    // Style header row (bold)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "E5E7EB" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const fullFileName = `${fileName}-${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, fullFileName);
  };

  return (
    <button
      onClick={handleExportExcel}
      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition-colors"
      title="Export to Excel"
    >
      <FiDownload className="w-4 h-4" />
      Export Excel
    </button>
  );
};

export default ExcelExportButton;