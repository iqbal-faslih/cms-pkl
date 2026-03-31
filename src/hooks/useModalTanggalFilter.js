import { useState, useEffect } from "react";

export const useModalTanggalFilter = ({ isOpen, onApplyFilter, onClose }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [filterOption, setFilterOption] = useState("Custom");
  useEffect(() => {
    if (!isOpen) {
      const today = new Date();
      setDateRange([
        {
          startDate: today,
          endDate: today,
          key: "selection",
        },
      ]);
      setFilterOption("Custom");
    }
  }, [isOpen]);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
    setFilterOption("Custom");
  };

  const handlePresetChange = (option) => {
    const today = new Date();
    let start = null;
    let end = new Date();

    switch (option) {
      case "Hari Ini":
        start = new Date(today);
        end = new Date(today);
        break;
      case "Minggu Ini":
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        end = new Date();
        break;
      case "Bulan Ini":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      default:
        start = null;
        end = null;
    }

    setDateRange([
      {
        startDate: start,
        endDate: end,
        key: "selection",
      },
    ]);
    setFilterOption(option);
  };

  const handleApply = () => {
    onApplyFilter(dateRange[0].startDate, dateRange[0].endDate);
  };

  return {
    dateRange,
    filterOption,
    handleDateChange,
    handlePresetChange,
    handleApply,
  };
};
