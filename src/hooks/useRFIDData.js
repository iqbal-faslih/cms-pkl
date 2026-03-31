import { useState } from "react";
import { dataSiswa } from "../data/rfidData";

export const useRFIDData = () => {
  const [activeTab, setActiveTab] = useState("dataSiswa");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [rfidValue, setRfidValue] = useState("");
  const [studentName, setStudentName] = useState("");

  // Filter data based on active tab (with or without RFID)
  const getFilteredData = () => {
    let filteredByTab = activeTab === "dataSiswa"
      ? dataSiswa.filter(student => student.rfidTag) // Students with RFID
      : dataSiswa.filter(student => !student.rfidTag); // Students without RFID

    // Additional search term and date filtering
    return filteredByTab.filter((item) => {
      // Filter based on search term
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.rfidTag && item.rfidTag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter based on selected date if applicable
      if (selectedDate) {
        const magangDate = new Date(item.masaMagang.split(" - ")[0]);
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        return matchesSearch &&
          magangDate.getMonth() === selectedMonth &&
          magangDate.getFullYear() === selectedYear;
      }

      return matchesSearch;
    });
  };

  const filteredData = getFilteredData();

  const handleRFIDAction = (id, action) => {
    const student = dataSiswa.find(s => s.id === id);
    setSelectedStudent(student);
    setStudentName(student.nama);

    if (action === "Ubah") {
      setRfidValue(student.rfidTag);
      setShowUpdateModal(true);
    } else {
      setRfidValue("");
      setShowRegisterModal(true);
    }
  };

  const handleSave = () => {
    // Here you would typically update your data in a real application
    console.log(`Saved RFID ${rfidValue} for student: ${studentName}`);

    // Close modals
    setShowRegisterModal(false);
    setShowUpdateModal(false);
  };

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    showRegisterModal,
    setShowRegisterModal,
    showUpdateModal,
    setShowUpdateModal,
    selectedStudent,
    rfidValue,
    setRfidValue,
    studentName,
    filteredData,
    handleRFIDAction,
    handleSave,
  };
};
