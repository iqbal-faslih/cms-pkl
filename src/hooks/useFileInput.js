import { useState } from "react";
import Swal from "sweetalert2";

const useFileInput = (maxSizeMB = 2) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ];

  const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const maxSize = maxSizeMB * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "File terlalu besar",
          text: `Ukuran file maksimal ${maxSizeMB}MB`,
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      if (!allowedTypes.includes(selectedFile.type)) {
        Swal.fire({
          icon: "error",
          title: "Format file tidak valid",
          text: "Hanya diperbolehkan: PDF, DOC, DOCX, JPG, JPEG, PNG",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const ext = selectedFile.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        Swal.fire({
          icon: "error",
          title: "Ekstensi file tidak valid",
          text: "Hanya diperbolehkan: .pdf, .doc, .docx, .jpg, .jpeg, .png",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  return { file, fileName, handleFileChange, setFile, setFileName };
};

export default useFileInput;
