import React from "react";
import { FilterDropButton, SortButton, DateButton, Button } from "../components/button";
import Search from "../components/Search";
import { FiDownload } from "react-icons/fi";

export const approvalConfig = {
  headerConfig: {
    split: true, // Menggunakan split mode untuk dua area
    title: "Data Approval",
    subtitle: "Kelola data penerimaan",
    subtitleColor: "text-emerald-500",
    titleLeftActions: [],
    titleRightActions: [], // Tab buttons akan diisi di component
    top: {
      // Area atas untuk search dan filter
      left: [], // Search akan diisi di component
      right: [], // Filter buttons akan diisi di component
      center: [],
      className: "mb-4",
      showDivider: false,
    },
    bottom: {
      left: [],
      right: [],
      center: [],
      className: "",
    },
  },

  tableConfig: {
    className: "bg-transparent",
    headerStyle: {
      bgColor: "bg-transparent",
      textColor: "text-gray-500",
      fontWeight: "font-semibold text-sm",
      px: "px-6",
      py: "py-4",
      // textAlign: "text-left",
      borderBottom: "",
    },

    cellStyle: {
      px: "px-6",
      py: "py-3",
      textAlign: "text-left",
      textColor: "text-gray-700",
      fontWeight: "font-normal",
      rowHover: "hover:bg-gray-50",
      rowTransition: "transition-all duration-150",
      borderBottom: "border-b border-gray-300",
    },

    pendaftaran: {
      columns: [
        {
          key: "no",
          label: "Number",
          headerClassName: "text-left",
          cellClassName: "text-left",
        },
        {
          key: "nama",
          label: "Nama",
          headerClassName: "text-left",

          render: (value, row) => {
            return React.createElement(
              "div",
              { className: "flex items-center gap-3" },
              React.createElement("img", {
                src: row.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(value) + "&background=random",
                alt: value,
                className: "w-8 h-8 rounded-full object-cover",
              }),
              React.createElement("span", null, value)
            );
          },
        },
        { key: "sekolah", label: "Asal Sekolah", headerClassName: "text-left" },
        { key: "jurusan", label: "Jurusan", headerClassName: "text-left" },
        {
          key: "lowongan",
          label: "Lowongan",
          headerClassName: "text-left",
          cellClassName: "text-left",
          render: (value) =>
            React.createElement(
              "span",
              {
                className:
                  "inline-flex items-center max-w-[220px] truncate px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200",
                title: value || "-",
              },
              value || "-"
            ),
        },
        { 
          key: "masa_magang", 
          label: "Masa Magang", 
          headerClassName: "text-left",
          cellClassName: "text-left",
          render: (value) =>
            React.createElement(
              "span",
              {
                className:
                  "inline-flex items-center max-w-[220px] truncate px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200",
                title: value || "-",
              },
              value || "-"
            ),
        },
        {
          key: "status",
          label: "Status Pendaftaran",
          headerClassName: "text-left",
          cellClassName: "text-center",
          render: (value) => {
            const color = value === "Approve" ? "bg-green-100 text-green-700" : value === "Reject" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700";
            return React.createElement(
              "span",
              {
                className: `inline-flex justify-center items-center px-3 w-28 h-7 text-xs font-medium rounded-sm ${color}`,
              },
              value
            );
          },
        },
        {
          key: "aksi",
          label: "Aksi",
          headerClassName: "text-center",
          cellClassName: "text-center",
          render: () =>
            React.createElement(
              "button",
              {
                className: "px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
                onClick: () => {
                  // Removed event dispatching to integrate with TableApproval local modal handler
                  // You can handle modal open logic directly in TableApproval columns if needed
                },
              },
              "Lihat Detail"
            ),
        },
      ],
    },

    izin: {
      columns: [
        // {
        //   key: "checkbox",
        //   label: "",
        //   headerClassName: "text-left w-12",
        //   cellClassName: "text-left w-12",
        //   render: () => null, // Will be handled in TableApproval component
        // },
        {
          key: "no",
          label: "Number",
          headerClassName: "text-left",
          cellClassName: "text-left",
        },
        {
          key: "nama",
          label: "Nama",
          headerClassName: "text-left",
          cellClassName: "text-left",
          render: (value, row) => {
            return React.createElement(
              "div",
              { className: "flex items-center gap-3" },
              React.createElement("img", {
                src: row.profilePicture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(value) + "&background=random",
                alt: value,
                className: "w-8 h-8 rounded-full object-cover",
              }),
              React.createElement("span", null, value)
            );
          },
        },
        { key: "sekolah", label: "Asal Sekolah", headerClassName: "text-left" },
        {
          key: "email",
          label: "Email",
          headerClassName: "text-left",
          cellClassName: "text-left",
          render: (value) => value || "-"
        },
        { key: "tanggal_izin", label: "Tanggal Izin", headerClassName: "text-left" },
        {
          key: "alasan",
          label: "Alasan Izin",
          headerClassName: "text-left",
          cellClassName: "text-left",
          render: (value) => {
            let badgeText = "Lainnya";
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-300";
            if (value.toLowerCase().includes("izin")) {
              badgeText = "Izin";
              badgeClass = "bg-orange-200 text-orange-600";
            } else if (value.toLowerCase().includes("sakit")) {
              badgeText = "Sakit";
              badgeClass = "bg-red-100 text-red-500";
            }
            return React.createElement(
              "span",
              {
                className: `inline-flex justify-center items-center px-3 w-22 h-7 rounded-md text-sm font-medium ${badgeClass}`,
                title: value,
              },
              badgeText
            );
          },
        },
        {
          key: "status_izin",
          label: "Status Izin",
          headerClassName: "text-left",
          cellClassName: "text-center",
          render: (value) => {
            // Preserve styles for Diterima and Ditolak as is (do not change button styling)
            const diterimaStyle = "bg-green-600 text-white";
            const ditolakStyle = "bg-gray-200 text-gray-600";
            const pendingStyle = "bg-yellow-100 text-yellow-700";

            const color = value === "Approve" ? diterimaStyle : value === "Reject" ? ditolakStyle : value === "Pending" ? pendingStyle : pendingStyle;

            return React.createElement(
              "span",
              {
                className: `inline-flex justify-center items-center px-3 w-28 h-7 text-sm font-medium rounded-sm ${color}`,
              },
              value
            );
          },
        },
        {
          key: "aksi",
          label: "Lihat Detail",
          headerClassName: "text-center",
          cellClassName: "text-center",
          render: () =>
            React.createElement(
              "button",
              {
                className: "px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm",
                onClick: () => {
                  // Removed event dispatching to integrate with TableApproval local modal handler
                  // You can handle modal open logic directly in TableApproval columns if needed
                },
              },
              "Action"
            ),
        },
      ],
    },
  },
};
