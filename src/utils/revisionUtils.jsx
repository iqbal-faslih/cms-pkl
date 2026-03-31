import React from "react";
import { BsDash, BsPlus } from "react-icons/bs";

export const statusColors = {
  "belum dikerjakan": {
    backgroundClass: "bg-[#306BFF]",
    statusText: "Belum Dikerjakan",
    icon: null,
  },
  "terlambat": {
    backgroundClass: "bg-[#FF0002]",
    statusText: "Terlambat",
    icon: null,
  },
  "dalam proses": {
    backgroundClass: "bg-[#FF8C00]",
    statusText: "Dalam Proses",
    icon: <BsDash size={16} />,
  },
  selesai: {
    backgroundClass: "bg-[#16A34A]",
    statusText: "Selesai",
    icon: <BsPlus size={16} />,
  },
};